<template>
    <div
        class="min-h-[calc(100vh-4.5rem)] text-white profile-container"
        :style="{ backgroundColor: currentPalette.bg }"
    >
        <!-- Profile Content -->
        <div class="md:flex w-full justify-center">
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
                                class="bg-gray-900 flex items-center justify-center md:h-10 md:w-10 h-6 w-6 absolute rounded-full md:top-22 md:left-22 top-17 left-17"
                            >
                                <div
                                    class="bg-green-500 md:h-6 md:w-6 h-3 w-3 rounded-full"
                                ></div>
                            </div>
                        </div>
                        <!-- Profile Actions (Mobile) -->
                        <div class="mr-2 absolute right-4 top-2 z-10">
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
                                @{{ accountData.username }}
                            </p>
                            <!-- Note: No follow button on own profile -->
                        </div>
                        <!-- Statistics Section -->
                        <div
                            class="stats-section flex flex-wrap gap-6 md:gap-8 mt-4 pb-4 border-b border-gray-700/50"
                        >
                            <div
                                class="text-center cursor-pointer stat-item"
                                @click="openFollower = true"
                            >
                                <p class="font-bold text-xl ph-no-capture">
                                    {{ followers }}
                                </p>
                                <p class="text-sm text-gray-400">Followers</p>
                            </div>
                            <div
                                class="text-center cursor-pointer stat-item"
                                @click="openFollowing = true"
                            >
                                <p class="font-bold text-xl ph-no-capture">
                                    {{ following }}
                                </p>
                                <p class="text-sm text-gray-400">Following</p>
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
                            <RouterLink
                                to="/account/settings"
                                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2"
                                :style="{
                                    backgroundColor:
                                        currentPalette.buttonPrimary,
                                    color: currentPalette.textSecondary,
                                }"
                            >
                                <i class="fa-solid fa-gear mr-2"></i>
                                Account Settings
                            </RouterLink>
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
                                <i class="fa-solid fa-share mr-2"></i>
                                Share Profile
                            </div>
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
                                    :profile-community-settings="
                                        ownProfileData.communities.find(
                                            (item) => item.id === community.id
                                        )
                                    "
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
                    <h1>You are not followed by anyone</h1>
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
                    <h1>You are not following anyone</h1>
                </div>
            </div>
        </BaseModalComponent>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import currentPalette from '~/vars/getColors'
import CommunityLinkComponent from '../account/profile/CommunityLinkComponent.vue'
import ColorThief from 'colorthief'
import BaseModalComponent from '../ui/BaseModalComponent.vue'

const md = new MarkdownIt({
    html: false,
    linkify: false,
}).disable(['code', 'table', 'heading', 'hr', 'image'])
const router = useRouter()
const runtimeConfig = useRuntimeConfig()

const url = baseURL + '/api/account/getOwnProfile'
const accountData = ref({})
const profileData = ref({})
const ownProfileData = ref({})
const posts = ref(0)
const followers = ref(0)
const following = ref(0)
const postsValue = ref([])
const sinceString = ref('')
const openFollower = ref(false)
const openFollowing = ref(false)
const hasProfilePicture = ref(true)
const loaded = ref(false)
const markdownHTML = ref('')
const badges = ref([])
const communities = ref([])
const music = ref([])
const loadedPosts = ref([])
const postIndex = ref(0)
const loading = ref(false)
const gradient1 = ref('#000000')
const gradient2 = ref('#000000')
const lastRequest = ref(0)

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
}

axios
    .get(url, {
        headers: {
            token: Cookies.get('token'),
        },
    })
    .then((response) => {
        accountData.value = response.data[1]
        profileData.value = response.data[0]

        const accountCreated = new Date(accountData.value.accountCreated)
        const accountCreatedString = accountCreated.toLocaleDateString()
        sinceString.value = accountCreatedString

        markdownHTML.value = md.render(response.data[0].bio)

        music.value = response.data[0].music

        badges.value = response.data[0].badges

        ownProfileData.value = response.data[0]

        const colorThief = new ColorThief()
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src =
            'https://s3.faser.app/profilepictures/' +
            profileData.value.id +
            '/image.png?t=' +
            new Date().getTime()
        img.onload = function () {
            const palette = colorThief.getPalette(img, 2)
            gradient1.value = `#${componentToHex(palette[0][0])}${componentToHex(palette[0][1])}${componentToHex(palette[0][2])}`
            gradient2.value = `#${componentToHex(palette[1][0])}${componentToHex(palette[1][1])}${componentToHex(palette[1][2])}`
        }

        for (let i = 0; i < response.data[0].communities.length; i++) {
            axios
                .post(baseURL + '/api/community/getCommunity', {
                    communityId: response.data[0].communities[i].id,
                })
                .then((response) => {
                    communities.value.push(response.data.community)
                })
        }

        posts.value = response.data[0].posts.length
        followers.value = response.data[0].follower.length
        following.value = response.data[0].following.length

        postsValue.value = response.data[0].posts.reverse()

        loadPosts(25)

        loaded.value = true

        // axios
        //   .get(
        //     baseURL + "/api/profile/getProfilePhoto?username=" +
        //     accountData.value.username
        //   )
        //   .then((response) => {
        //     hasProfilePicture.value = true;
        //     loaded.value = true;
        //   })
        //   .catch((error) => {
        //     hasProfilePicture.value = false;
        //     loaded.value = true;
        //   });
    })
    .catch((error) => {
        if (error.response.data.status === 'error') {
            router.push('/login')
        }
    })

function openProfile(name) {
    openFollower.value = false
    openFollowing.value = false
    console.log(name)
    router.push('/' + name)
}

document.addEventListener('scroll', (event) => {
    if (document.body.offsetHeight - 8000 < window.scrollY) {
        if (lastRequest.value + 1000 < Date.now()) {
            lastRequest.value = Date.now()

            loadPosts(25)
        }
    }
})

function loadPosts(postsToLoad) {
    for (let i = 0; i < postsToLoad; i++) {
        if (postIndex.value < postsValue.value.length) {
            loadedPosts.value.push(postsValue.value[postIndex.value])
            postIndex.value++
        }
    }
}

function shareProfile() {
    navigator.share({
        title: 'Check out my profile on Faser',
        url: 'https://faser.app/' + accountData.value.username,
    })
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
