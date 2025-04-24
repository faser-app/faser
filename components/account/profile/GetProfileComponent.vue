<template>
    <div
        class="min-h-[calc(100vh-4.5rem)] text-white profile-container"
        :style="{ backgroundColor: currentPalette.bg }"
    >
        <div class="md:flex w-full justify-center" v-if="loaded && success">
            <!-- Main Profile Content -->
            <div class="md:w-4/5 max-w-[90rem] w-full px-4">
                <!-- Profile Header Section -->
                <div
                    class="profile-card rounded-xl overflow-hidden shadow-lg mb-6"
                    :style="{ backgroundColor: currentPalette.bgSecondary }"
                >
                    <!-- Profile Cover Image (placeholder) -->
                    <div
                        class="profile-cover h-32 md:h-48 w-full"
                        :style="
                            'background: linear-gradient(45deg, ' +
                            gradient1 +
                            ', ' +
                            gradient2 +
                            ')'
                        "
                    ></div>
                    <!-- Profile Header Content -->
                    <div class="px-6 pt-0 pb-6 relative">
                        <!-- Profile Picture -->
                        <div class="profile-picture-container">
                            <img
                                v-if="hasProfilePicture && loaded"
                                :src="
                                    'https://s3.faser.app/profilepictures/' +
                                    profileData.id +
                                    '/image.png?t=' +
                                    new Date().getTime()
                                "
                                @error="hasProfilePicture = false"
                                alt="profile picture"
                                class="profile-picture bg-gray-900 object-cover border-4 ph-no-capture"
                                :class="{
                                    'rounded-full':
                                        !profileData.businessAccount,
                                    'rounded-md': profileData.businessAccount,
                                    'border-gray-800':
                                        currentPalette.name === 'normal',
                                    'border-gray-900':
                                        currentPalette.name !== 'normal',
                                }"
                            />
                            <div
                                v-else
                                class="profile-picture flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
                                :class="{
                                    'rounded-full':
                                        !profileData.businessAccount,
                                    'rounded-md': profileData.businessAccount,
                                }"
                            >
                                <i class="fa-solid fa-user text-4xl"></i>
                            </div>

                            <div
                                v-if="isOnline"
                                class="bg-gray-900 flex items-center justify-center md:h-10 md:w-10 h-6 w-6 absolute rounded-full md:top-22 md:left-22 top-17 left-17"
                            >
                                <div
                                    class="bg-green-500 md:h-6 md:w-6 h-3 w-3 rounded-full"
                                ></div>
                            </div>
                        </div>

                        <!-- Profile Actions (Mobile) -->
                        <div
                            class="mr-2 flex gap-2 absolute right-4 top-2 z-10"
                        >
                            <button
                                @click="reloadProfile"
                                class="bg-gray-800 px-2 rounded-full"
                            >
                                <i
                                    class="fa-solid fa-rotate-right"
                                    :class="{ reloading: reloading }"
                                ></i>
                            </button>
                            <Menu
                                as="div"
                                class="relative md:hidden inline-block text-left"
                            >
                                <div>
                                    <MenuButton
                                        class="inline-flex justify-center rounded-full bg-gray-800 bg-opacity-50 p-2 text-sm text-white hover:bg-opacity-70 transition-all"
                                    >
                                        <i class="fa-solid fa-users"></i>
                                    </MenuButton>
                                </div>
                                <transition
                                    enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="transform scale-95 opacity-0"
                                    enter-to-class="transform scale-100 opacity-100"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="transform scale-100 opacity-100"
                                    leave-to-class="transform scale-95 opacity-0"
                                >
                                    <MenuItems
                                        class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                                        :style="{
                                            backgroundColor: currentPalette.bg,
                                        }"
                                    >
                                        <div class="px-1 py-1 ph-no-capture">
                                            <MenuItem
                                                v-for="community in communities"
                                                v-slot="{ active }"
                                            >
                                                <RouterLink
                                                    :to="
                                                        '/communities/' +
                                                        community.id
                                                    "
                                                    :class="[
                                                        active
                                                            ? 'bg-gray-700 text-white'
                                                            : 'text-gray-200',
                                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                    ]"
                                                >
                                                    <i
                                                        class="fa-solid fa-users mr-2"
                                                    ></i>
                                                    {{ community.displayName }}
                                                </RouterLink>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>

                        <!-- Profile Info Section -->
                        <div class="mt-12 pb-4">
                            <!-- Badges -->
                            <div
                                class="flex flex-wrap gap-2 text-sm mb-3"
                                v-if="badges.length !== 0"
                            >
                                <div
                                    v-for="badge in badges"
                                    :key="badge.name"
                                    class="badge flex items-center cursor-default rounded-full px-3 py-1 ph-no-capture"
                                    :style="{
                                        backgroundColor: badge.color + '22',
                                        border: '1px solid ' + badge.color,
                                        color: badge.color,
                                    }"
                                >
                                    {{ badge.name }}
                                </div>
                            </div>

                            <!-- Name and Verification -->
                            <div class="flex items-center mb-1">
                                <h1 class="text-2xl font-bold mr-2">
                                    {{ profileData.displayName }}
                                </h1>
                                <div
                                    v-if="profileData.businessAccount"
                                    class="verified-badge business ph-no-capture"
                                >
                                    <i
                                        class="fa-solid verifiedBadge fa-check"
                                    ></i>
                                </div>
                                <div
                                    v-else-if="profileData.verifiedAccount"
                                    class="verified-badge personal ph-no-capture"
                                >
                                    <i
                                        class="fa-solid verifiedBadge fa-check"
                                    ></i>
                                </div>
                            </div>

                            <!-- Username -->
                            <p class="text-gray-400 mb-3 ph-no-capture">
                                @{{ route.params.user.replace('@', '') }}
                            </p>

                            <!-- Follow Button -->
                            <div
                                v-if="isAbleToFollow"
                                @click="toggleFollow"
                                class="inline-block cursor-pointer select-none rounded-md overflow-hidden"
                            >
                                <div class="relative h-10 w-24">
                                    <div
                                        class="absolute inset-0 bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] flex items-center justify-center"
                                        v-if="followed"
                                    >
                                        <p>Followed</p>
                                    </div>
                                    <div
                                        class="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-100"
                                        v-else
                                    >
                                        <p>Follow</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Statistics Section -->
                        <div class="border-b border-gray-700/50">
                            <div
                                class="text-gray-400 stats-section flex flex-wrap gap-6 md:gap-8 mt-4 pb-4"
                            >
                                <div
                                    class="text-center cursor-pointer stat-item"
                                    @click="openFollower = true"
                                >
                                    <p class="font-bold text-xl ph-no-capture">
                                        {{ followers }}
                                    </p>
                                    <p class="text-sm text-gray-400">
                                        Followers
                                    </p>
                                </div>
                                <div
                                    class="text-center cursor-pointer stat-item"
                                    @click="openFollowing = true"
                                >
                                    <p class="font-bold text-xl ph-no-capture">
                                        {{ following }}
                                    </p>
                                    <p class="text-sm text-gray-400">
                                        Following
                                    </p>
                                </div>
                                <div class="text-center stat-item">
                                    <p class="font-bold text-xl ph-no-capture">
                                        {{ posts }}
                                    </p>
                                    <p class="text-sm text-gray-400">Posts</p>
                                </div>
                                <div
                                    class="text-sm text-gray-400 ml-auto self-end ph-no-capture"
                                >
                                    Member since {{ sinceString }}
                                </div>
                            </div>
                            <!--                            <div class="text-gray-400 flex items-center">-->
                            <!--                                <div-->
                            <!--                                    v-for="i in 3"-->
                            <!--                                    :key="i"-->
                            <!--                                    class="flex items-center"-->
                            <!--                                >-->
                            <!--                                    <img-->
                            <!--                                        src="https://picsum.photos/200"-->
                            <!--                                        class="absolute h-6 w-6 rounded-full"-->
                            <!--                                        :style="{-->
                            <!--                                            marginLeft: 0.75 * (i - 1) + 'rem',-->
                            <!--                                        }"-->
                            <!--                                    />-->
                            <!--                                </div>-->

                            <!--                                <p class="ml-14 text-sm">-->
                            <!--                                    Followed by-->
                            <!--                                    <strong class="text-white">onemo</strong>-->
                            <!--                                    and-->
                            <!--                                    <strong class="text-white">13 others</strong-->
                            <!--                                    >.-->
                            <!--                                </p>-->
                            <!--                            </div>-->

                            <!--                            <div-->
                            <!--                                v-for="i in profileData.follower.length"-->
                            <!--                                :key="i"-->
                            <!--                            >-->
                            <!--                                <div-->
                            <!--                                    v-if="-->
                            <!--                                        ownProfileData.following.includes(-->
                            <!--                                            profileData.follower[i]-->
                            <!--                                        )-->
                            <!--                                    "-->
                            <!--                                >-->
                            <!--                                    Hallo-->
                            <!--                                </div>-->
                            <!--                            </div>-->

                            <!--                            {{ ownProfileData.following }}-->
                            <!--                            {{ profileData.follower }}-->
                        </div>

                        <!-- Music section -->
                        <div
                            v-if="music.songAuthor"
                            class="music-section my-6 ph-no-capture"
                        >
                            <iframe
                                :src="
                                    'https://open.spotify.com/embed/track/' +
                                    music.songId
                                "
                                class="spotify-embed rounded-lg shadow-lg w-full mx-auto md:w-3/4"
                                height="80"
                                frameBorder="0"
                                allowfullscreen=""
                                allow="clipboard-write; encrypted-media;"
                            ></iframe>
                        </div>

                        <!-- Bio Section -->
                        <div
                            class="bio-section my-6 p-4 rounded-lg bio ph-no-capture"
                            :style="{ backgroundColor: currentPalette.bg }"
                        >
                            <p
                                v-if="profileData.bio"
                                class="markdown-content"
                                v-html="markdownHTML"
                            ></p>
                            <p v-else class="italic text-gray-400">
                                No bio. Just imagine something cool here.
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div
                            class="action-buttons-grid grid grid-cols-2 gap-3 my-6"
                        >
                            <div
                                to="/account/settings"
                                @click="openReport = true"
                                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2"
                                :style="{
                                    backgroundColor:
                                        currentPalette.buttonPrimary,
                                    color: currentPalette.textSecondary,
                                }"
                            >
                                <i class="fa-solid fa-shield mr-2"></i>
                                Report Profile
                            </div>
                            <div
                                to="/account/settings"
                                @click="alertNotImplemented"
                                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2"
                                :style="{
                                    backgroundColor:
                                        currentPalette.buttonPrimary,
                                    color: currentPalette.textSecondary,
                                }"
                            >
                                <i class="fa-solid fa-ban mr-2"></i>
                                Block User
                            </div>
                            <div
                                @click="shareProfile"
                                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2"
                                :style="{
                                    backgroundColor:
                                        currentPalette.buttonPrimary,
                                    color: currentPalette.textSecondary,
                                }"
                            >
                                <i class="fa-solid fa-share mr-2"></i>
                                Share Profile
                            </div>
                            <RouterLink
                                :to="'/messages/' + profileData.id"
                                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2"
                                :style="{
                                    backgroundColor:
                                        currentPalette.buttonPrimary,
                                    color: currentPalette.textSecondary,
                                }"
                            >
                                <i class="fa-solid fa-message mr-2"></i>
                                Message
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Posts Section -->
                <div
                    class="posts-section rounded-xl overflow-hidden shadow-lg"
                    :style="{ backgroundColor: currentPalette.bgSecondary }"
                >
                    <h2
                        class="text-xl font-semibold p-4 border-b border-gray-700/50"
                    >
                        Posts
                    </h2>
                    <div
                        v-if="posts == 0"
                        class="empty-posts flex flex-col items-center justify-center py-16"
                    >
                        <i
                            class="fa-regular fa-newspaper text-4xl text-gray-500 mb-4"
                        ></i>
                        <p class="italic text-gray-400">No posts yet</p>
                    </div>
                    <div v-else class="posts-list">
                        <div
                            v-for="(post, index) in loadedPosts"
                            :key="post.id"
                            :class="{
                                'border-b border-gray-700/50':
                                    index !== loadedPosts.length - 1,
                            }"
                        >
                            <PostGetPostComponent
                                class="ph-no-capture"
                                :postId="post"
                                ownProfile="true"
                                :profile="profileData"
                                :ownProfile="ownProfile"
                                :account="accountData"
                                :ownProfileData="ownProfileData"
                                :border="false"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar (Communities) - Desktop Only -->
            <div class="communities-sidebar md:block hidden md:w-1/5 mr-3">
                <div
                    v-if="communities.length > 0"
                    class="sidebar-section rounded-xl p-4 shadow-lg"
                    :style="{ backgroundColor: currentPalette.bgSecondary }"
                >
                    <h2 class="text-xl font-semibold mb-4 text-center">
                        Communities
                    </h2>
                    <div class="space-y-3">
                        <div
                            v-for="community in communities"
                            :key="community.name"
                            class="ph-no-capture"
                        >
                            <RouterLink :to="'/communities/' + community.id">
                                <CommunityLinkComponent
                                    :community="community"
                                />
                            </RouterLink>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="sidebar-section text-center text-gray-400 rounded-xl p-4 shadow-lg"
                    :style="{ backgroundColor: currentPalette.bgSecondary }"
                >
                    <p v-if="!privateAccount">No Communities yet</p>
                    <p v-else>Private account</p>
                </div>
            </div>
        </div>

        <div v-if="!success && loaded">
            <div class="flex min-h-svh w-full justify-center items-center">
                <div class="text-center">
                    <p class="text-3xl text-gray-400">404 Not found</p>
                    <p class="text-gray-400">This user is not available</p>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- Followers Modal -->
        <BaseModalComponent
            :show-submit-button="false"
            cancel-text="Close"
            class="modal-overlay"
            :isOpen="openFollower"
            @close="openFollower = false"
            :title="'Followers (' + followers + ')'"
        >
            <div class="modal-body">
                <div
                    v-if="
                        profileData.follower && profileData.follower.length > 0
                    "
                    class="followers-list"
                >
                    <div
                        v-for="(user, index) in profileData.follower"
                        :key="user"
                        :class="{
                            'border-b border-gray-700/50 pb-2':
                                index !== profileData.follower.length - 1,
                            'mt-2': index !== 0,
                        }"
                    >
                        <AccountProfileGetFollowComponent
                            :id="user"
                            @open-profile="openProfile"
                        />
                    </div>
                </div>
                <div v-else class="empty-state">
                    <i
                        class="fa-solid fa-users-slash text-4xl text-gray-500 mb-4"
                    ></i>
                    <h1>This user is not followed by anyone</h1>
                </div>
            </div>
        </BaseModalComponent>

        <!-- Following Modal -->
        <BaseModalComponent
            :show-submit-button="false"
            cancel-text="Close"
            class="modal-overlay"
            :isOpen="openFollowing"
            @close="openFollowing = false"
            :title="'Following (' + following + ')'"
        >
            <div class="modal-body">
                <div
                    v-if="
                        profileData.following &&
                        profileData.following.length > 0
                    "
                    class="following-list"
                >
                    <div
                        v-for="(user, index) in profileData.following"
                        :key="user"
                        :class="{
                            'border-b border-gray-700/50 pb-2':
                                index !== profileData.following.length - 1,
                            'mt-2': index !== 0,
                        }"
                    >
                        <AccountProfileGetFollowComponent
                            :id="user"
                            @open-profile="openProfile"
                        />
                    </div>
                </div>
                <div v-else class="empty-state">
                    <i
                        class="fa-solid fa-users-slash text-4xl text-gray-500 mb-4"
                    ></i>
                    <h1>This user is not following anyone</h1>
                </div>
            </div>
        </BaseModalComponent>

        <!-- Report Modal -->
        <Transition name="fade">
            <div v-if="openReport" class="modal-overlay">
                <div
                    class="modal-container"
                    :style="{ backgroundColor: currentPalette.bg }"
                >
                    <div class="modal-header">
                        <h1 class="modal-title">Report Profile</h1>
                        <button
                            @click="openReport = false"
                            class="modal-close-button"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <SupportFieldsComponent
                            :predefinedSubject="
                                'User Report for ' + profileData.displayName
                            "
                            :predefinedMessage="
                                'I want to report this person because...\n\nUser ID: ' +
                                profileData.id
                            "
                        />
                        <p class="ml-4 mb-4">
                            Please provide the User ID for the Person you want
                            to report.
                        </p>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Login Modal -->
        <Transition name="fade">
            <div v-if="showLoginModal" class="modal-overlay">
                <div
                    class="modal-container"
                    :style="{ backgroundColor: currentPalette.bg }"
                >
                    <div class="modal-header">
                        <h1 class="modal-title">Login Required</h1>
                        <button
                            @click="showLoginModal = false"
                            class="modal-close-button"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <LoginComponent />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import Cookies from 'js-cookie'
import { useHead } from '#app'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import currentPalette from '~/vars/getColors'
import CommunityLinkComponent from './CommunityLinkComponent.vue'
import ColorThief from 'colorthief'
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'
import userinfo from '~/vars/userinfo.js'

useHead({
    meta: [
        {
            name: 'theme-color',
            content: '#030712',
        },
    ],
})

const router = useRouter()
const md = new MarkdownIt({
    html: false,
    linkify: false,
    breaks: true,
}).disable(['code', 'table', 'heading', 'hr', 'image'])

const runtimeConfig = useRuntimeConfig()

const url = baseURL + '/api/account/getProfile'
const profileData = ref({})
const sinceString = ref('')
const badges = ref([])
const success = ref(false)
const loaded = ref(false)
const postsValue = ref([])
const posts = ref(0)
const followers = ref(0)
const following = ref(0)
const openFollower = ref(false)
const showLoginModal = ref(false)
const loggedIn = ref(Cookies.get('token') ? true : false)
const openFollowing = ref(false)
const privateAccount = ref(false)
const isAbleToFollow = ref(true)
const followed = ref(false)
const hasProfilePicture = ref(true)
const imageLoaded = ref(false)
const markdownHTML = ref('')
const ownId = ref(0)
const ownProfile = ref({})
const ownProfileData = ref({})
const communities = ref([])
const route = useRoute()
const username = route.params.user.replace('@', '')
const openReport = ref(false)
const music = ref([])
const accountData = ref({})
const loadedPosts = ref([])
const postIndex = ref(0)
const loading = ref(false)
const gradient1 = ref('#000000')
const gradient2 = ref('#000000')
const lastRequest = ref(0)
const isOnline = ref(false)
const reloading = ref(false)

function shareProfile() {
    navigator.share({
        title: 'Check out this profile on Faser',
        url: 'https://faser.app/' + route.params.user,
    })
}

function alertNotImplemented() {
    alert('This feature is not implemented yet')
}

async function main() {
    axios
        .get(baseURL + '/api/account/getOwnProfile', {
            headers: {
                token: Cookies.get('token'),
            },
        })
        .then(async (ownResponse) => {
            if (ownResponse && ownResponse.data) {
                ownProfileData.value = ownResponse.data[0]
                ownId.value = ownResponse.data[0].id
                accountData.value = ownResponse.data[1]
            } else {
                console.error('Die API hat keine gültigen Daten zurückgegeben.')
            }

            getProfile()
        })
        .catch((error) => {
            console.error('Fehler beim Abrufen des eigenen Profils:', error)
            getProfile()
        })
}

function openProfile(name) {
    openFollower.value = false
    openFollowing.value = false
    console.log(name)
    router.push('/' + name)
}

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
}

async function getProfile() {
    const response = await axios
        .get(url, {
            headers: {
                username: username,
                lang: navigator.language || navigator.userLanguage,
            },
        })
        .catch((error) => {
            if (error.response.status === 404) {
                loaded.value = true
                success.value = false
            } else {
                router.push('/login')
            }
        })

    if (response.status === 200) {
        loaded.value = true
        success.value = true
    }

    const colorThief = new ColorThief()

    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src =
        'https://s3.faser.app/profilepictures/' +
        response.data[0].id +
        '/image.png?t=' +
        new Date().getTime()
    img.onload = () => {
        const palette = colorThief.getPalette(img, 2)
        gradient1.value = `#${componentToHex(palette[0][0])}${componentToHex(palette[0][1])}${componentToHex(palette[0][2])}`
        gradient2.value = `#${componentToHex(palette[1][0])}${componentToHex(palette[1][1])}${componentToHex(palette[1][2])}`
    }

    if (response.data[0].id === ownProfileData.value.id) {
        isAbleToFollow.value = false
    }

    if (response.data[0].follower.includes(ownId.value)) {
        followed.value = true
    }

    profileData.value = response.data[0]

    badges.value = response.data[0].badges

    markdownHTML.value = md.render(response.data[0].bio)

    posts.value = response.data[0].posts.length
    followers.value = response.data[0].follower.length
    following.value = response.data[0].following.length

    isOnline.value = response.data[0].lastOnlineTime > Date.now() - 60000

    communities.value = []

    for (let i = 0; i < response.data[0].communities.length; i++) {
        axios
            .post(baseURL + '/api/community/getCommunity', {
                communityId: response.data[0].communities[i].id,
            })
            .then((response) => {
                communities.value.push(response.data.community)
            })
    }

    music.value = response.data[0].music

    postsValue.value = response.data[0].posts.reverse()

    privateAccount.value = response.data[0].privateAccount

    loadPosts(25)

    const accountCreated = new Date(response.data[1].memberSince)
    const accountCreatedString = accountCreated.toLocaleDateString()
    sinceString.value = accountCreatedString
}

document.addEventListener('scroll', (event) => {
    if (document.body.offsetHeight - 8000 < window.scrollY) {
        if (lastRequest.value + 1000 < Date.now()) {
            lastRequest.value = Date.now()

            loadPosts(25)
        }
    }
})

main()

function loadPosts(postsToLoad) {
    for (let i = 0; i < postsToLoad; i++) {
        if (postIndex.value < postsValue.value.length) {
            loadedPosts.value.push(postsValue.value[postIndex.value])
            postIndex.value++
        }
    }
}

function reloadProfile() {
    getProfile()
    reloading.value = true

    setTimeout(() => {
        reloading.value = false
    }, 500)
}

function toggleFollow() {
    if (!loggedIn.value) {
        showLoginModal.value = true
        return
    }

    let url = ''

    if (followed.value) {
        url = baseURL + '/api/social/unfollowUser'
        followers.value--
    } else {
        url = baseURL + '/api/social/followUser'
        followers.value++
    }

    axios
        .post(url, {
            token: Cookies.get('token'),
            username: route.params.user.replace('@', ''),
        })
        .then()
        .catch((error) => {
            if (error.response.data.message === 'You cannot follow yourself') {
                alert(error.response.data.message)

                if (followed.value) {
                    url = baseURL + '/api/social/unfollowUser'
                    followers.value--
                } else {
                    url = baseURL + '/api/social/followUser'
                    followers.value++
                }

                followed.value = !followed.value
            } else if (error.response.status === 429) {
                alert(error.response.data)

                if (followed.value) {
                    url = baseURL + '/api/social/unfollowUser'
                    followers.value--
                } else {
                    url = baseURL + '/api/social/followUser'
                    followers.value++
                }

                followed.value = !followed.value
            } else if (
                error.response.data.message ===
                'You are already following this user'
            ) {
                if (url.includes('unfollow')) {
                    followers.value++
                } else {
                    followers.value--
                }
            } else {
                router.push('/login')
            }
        })

    followed.value = !followed.value
}
</script>

<style scoped>
@import url('~/assets/css/markdown.css');

/* Profile Styles */
.profile-container {
    position: relative;
}

.profile-picture-container {
    position: relative;
    margin-top: -48px;
}

.profile-picture {
    width: 96px;
    height: 96px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
    .profile-picture {
        width: 128px;
        height: 128px;
    }
}

.reloading {
    animation: rotate 0.5s infinite linear;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.verified-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-left: 8px;
}

.verified-badge.personal {
    background-color: rgb(14, 165, 233);
    border: 2px solid rgb(125, 211, 252);
}

.verified-badge.business {
    background-color: rgb(202, 138, 4);
    border: 2px solid rgb(253, 224, 71);
}

.action-button {
    width: 100%;
    transition: all 0.2s;
}

.action-button:hover {
    transform: translateY(-1px);
}

.stat-item {
    transition: transform 0.15s ease;
}

.stat-item:hover {
    transform: translateY(-2px);
}

.spotify-embed {
    max-width: 100%;
}

.badge {
    font-weight: 500;
    font-size: 0.75rem;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-container {
    width: 90%;
    max-width: 60rem;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(75, 85, 99, 0.3);
}

.modal-title {
    flex-grow: 1;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
}

.modal-close-button {
    font-size: 1.25rem;
    color: #9ca3af;
    cursor: pointer;
    transition: color 0.15s;
}

.modal-close-button:hover {
    color: #f1f5f9;
}

.modal-body {
    padding: 1rem 0;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-style: italic;
    color: #9ca3af;
    text-align: center;
}

/* Animation */
.fade-enter-active {
    animation: fadeIn 0.25s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
        filter: blur(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
    }
}

.fade-leave-active {
    animation: fadeOut 0.25s;
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
    }

    to {
        opacity: 0;
        transform: translateY(10px);
        filter: blur(5px);
    }
}

.verifiedBadge {
    transform: translateY(1px);
}
</style>
