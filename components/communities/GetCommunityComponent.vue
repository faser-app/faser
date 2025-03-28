<template>
    <div class="min-h-[calc(100vh-4.5rem)] text-white community-container"
        :style="{ backgroundColor: currentPalette.bg }">
        <!-- Community Content -->
        <div class="md:flex w-full justify-center" v-if="loaded">
            <!-- Main Community Content -->
            <div class="md:w-4/5 max-w-[90rem] w-full px-4">
                <!-- Community Header Card -->
                <div class="community-card rounded-xl overflow-hidden shadow-lg mb-6"
                    :style="{ backgroundColor: currentPalette.bgSecondary }">

                    <!-- Community Cover Image (placeholder) -->
                    <div class="community-cover h-32 md:h-48 w-full bg-gradient-to-r from-gray-800 to-gray-700"></div>

                    <!-- Community Header Content -->
                    <div class="px-6 pt-0 pb-6 relative">
                        <!-- Community Actions Menu -->
                        <div class="absolute right-4 top-2 z-10">
                            <Menu as="div" class="relative inline-block text-left">
                                <div>
                                    <MenuButton
                                        class="inline-flex justify-center rounded-full bg-gray-800 bg-opacity-50 p-2 text-sm text-white hover:bg-opacity-70 transition-all">
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </MenuButton>
                                </div>
                                <transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="transform scale-95 opacity-0"
                                    enter-to-class="transform scale-100 opacity-100"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="transform scale-100 opacity-100"
                                    leave-to-class="transform scale-95 opacity-0">
                                    <MenuItems
                                        class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                                        :style="{ backgroundColor: currentPalette.bg }">
                                        <div class="px-1 py-1">
                                            <MenuItem v-slot="{ active }">
                                            <button :class="[
                                                    active ? 'bg-gray-700 text-white' : 'text-gray-200',
                                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]" @click="showRulesModal = true">
                                                <i class="fa-solid fa-scroll mr-2"></i>
                                                Rules
                                            </button>
                                            </MenuItem>
                                            <MenuItem v-slot="{ active }">
                                            <button :class="[
                                                    active ? 'bg-gray-700 text-white' : 'text-gray-200',
                                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]" @click="showInviteLinkModal = true">
                                                <i class="fa-solid fa-link mr-2"></i>
                                                Create Invite link
                                            </button>
                                            </MenuItem>
                                            <MenuItem
                                                v-if="communityObject.moderators && communityObject.moderators.includes(ownProfileData.id)"
                                                v-slot="{ active }">
                                            <button :class="[
                                                    active ? 'bg-gray-700 text-white' : 'text-gray-200',
                                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]" @click="showEditModal = true">
                                                <i class="fa-solid fa-pen-to-square mr-2"></i>
                                                Edit Community
                                            </button>
                                            </MenuItem>
                                            <MenuItem v-if="!memberArray.includes(id)" v-slot="{ active }">
                                            <button :class="[
                                                    active ? 'bg-gray-700 text-green-500' : 'text-green-500',
                                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]" @click="joinCommunity">
                                                <i class="fa-solid fa-user-plus mr-2"></i>
                                                Join Community
                                            </button>
                                            </MenuItem>
                                            <MenuItem v-else v-slot="{ active }">
                                            <button :class="[
                                                    active ? 'bg-gray-700 text-red-500' : 'text-red-500',
                                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]" @click="leaveCommunity">
                                                <i class="fa-solid fa-user-minus mr-2"></i>
                                                Leave Community
                                            </button>
                                            </MenuItem>
                                            <MenuItem v-if="communityObject.owner === ownProfileData.id"
                                                v-slot="{ active }">
                                            <button :class="[
                                                    active ? 'bg-gray-700 text-red-500' : 'text-red-500',
                                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                                ]" @click="deleteCommunity">
                                                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                                                Delete Community
                                            </button>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>

                        <!-- Community Picture -->
                        <div class="community-picture-container">
                            <div v-if="haveImage" class="community-picture object-cover border-4"
                                @click="openCommunityImage = true" :style="{
                                    backgroundImage: `url('https://s3.faser.app/communityimages/${communityObject.id}/image.png')`,
                                    backgroundColor: '#1118276c',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderColor: currentPalette.name === 'normal' ? '#1e293b' : '#0f172a'
                                }">
                            </div>
                            <div v-else
                                class="community-picture flex border justify-center items-center border-[#96969627] bg-[#1118276c]">
                                <i class="fa-solid fa-users text-4xl"></i>
                            </div>

                            <!-- Community Image Modal -->
                            <div v-if="openCommunityImage" @click.self="openCommunityImage = false"
                                class="modal-overlay">
                                <img v-if="haveImage"
                                    :src="'https://s3.faser.app/communityimages/' + communityObject.id + '/image.png'"
                                    class="rounded-lg max-w-[80vw] max-h-[80vh] object-cover"
                                    @click="openCommunityImage = false" alt="Community Image"
                                    @error="haveImage = false" />
                            </div>
                        </div>

                        <!-- Community Info Section -->
                        <div class="mt-12 pb-4">
                            <!-- Community Name and Status -->
                            <div class="flex items-center mb-1">
                                <h1 class="text-2xl font-bold mr-2">{{ displayName }}</h1>
                                <div v-if="communityObject.private" class="status-badge private">
                                    <i class="fa-solid fa-lock text-xs"></i>
                                </div>
                                <div v-else class="status-badge public">
                                    <i class="fa-solid fa-globe text-xs"></i>
                                </div>
                            </div>

                            <!-- Community Description -->
                            <p class="text-gray-300 mb-3">{{ description }}</p>

                            <!-- Community Tags -->
                            <div v-if="communityObject.tags && communityObject.tags.length > 0"
                                class="flex flex-wrap gap-2 text-sm mb-4">
                                <div v-for="tag in communityObject.tags" :key="tag"
                                    class="tag flex items-center cursor-default rounded-full px-3 py-1" :style="{
                                        backgroundColor: '#3b82f622', 
                                        border: '1px solid #60a5fa',
                                        color: '#60a5fa'
                                    }">
                                    {{ tag }}
                                </div>
                            </div>

                            <!-- Join/Leave Button -->
                            <div v-if="!memberArray.includes(id)" @click="joinCommunity" class="join-button">
                                <span>Join Community</span>
                            </div>
                            <div v-else @click="leaveCommunity" class="leave-button">
                                <span>Leave Community</span>
                            </div>
                        </div>

                        <!-- Statistics Section -->
                        <div class="stats-section flex flex-wrap gap-6 md:gap-8 mt-4 pb-4 border-b border-gray-700/50">
                            <div class="text-center stat-item">
                                <p class="font-bold text-xl">{{ members }}</p>
                                <p class="text-sm text-gray-400">Members</p>
                            </div>
                            <div class="text-center stat-item">
                                <p class="font-bold text-xl">{{ moderators ? moderators.length : 0 }}</p>
                                <p class="text-sm text-gray-400">Moderators</p>
                            </div>
                            <div class="text-center stat-item">
                                <p class="font-bold text-xl">{{ posts }}</p>
                                <p class="text-sm text-gray-400">Posts</p>
                            </div>
                        </div>

                        <!-- Community Quick Actions -->
                        <div class="quick-actions mt-6">
                            <div v-if="memberArray.includes(id)" class="mb-4 w-full">
                                <CreatePostComponent text="Create Post" :own-profile="ownProfileData" :mobile="false"
                                    :community="true" :community-id="props.communityId"
                                    :community-object="communityObject" />
                            </div>
                            <div v-else-if="!communityObject.private" class="info-message mb-4">
                                <i class="fa-solid fa-info-circle mr-2"></i>
                                <span>Join this community to create posts</span>
                            </div>
                            <div v-else class="info-message mb-4">
                                <i class="fa-solid fa-lock mr-2"></i>
                                <span>This community is private. You need to be invited to see posts.</span>
                            </div>

                            <!-- Action Buttons -->
                            <div class="action-buttons-grid grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
                                <button @click="showRulesModal = true" class="action-button"
                                    :style="{ backgroundColor: currentPalette.buttonPrimary }">
                                    <i class="fa-solid fa-scroll mr-2"></i>
                                    Community Rules
                                </button>

                                <button @click="showInviteLinkModal = true" class="action-button"
                                    :style="{ backgroundColor: currentPalette.buttonPrimary }">
                                    <i class="fa-solid fa-link mr-2"></i>
                                    Invite Members
                                </button>

                                <button
                                    v-if="communityObject.moderators && communityObject.moderators.includes(ownProfileData.id)"
                                    @click="showEditModal = true" class="action-button"
                                    :style="{ backgroundColor: currentPalette.buttonPrimary }">
                                    <i class="fa-solid fa-pen-to-square mr-2"></i>
                                    Edit Community
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Posts Section -->
                <div class="posts-section rounded-xl overflow-hidden shadow-lg"
                    :style="{ backgroundColor: currentPalette.bgSecondary }">
                    <h2 class="text-xl font-semibold p-4 border-b border-gray-700/50">Community Posts</h2>

                    <div v-if="posts === 0 && !communityObject.private"
                        class="empty-posts flex flex-col items-center justify-center py-16">
                        <i class="fa-regular fa-newspaper text-4xl text-gray-500 mb-4"></i>
                        <p class="italic text-gray-400">No posts in this community yet</p>
                    </div>

                    <div v-else-if="posts === 0 && communityObject.private"
                        class="empty-posts flex flex-col items-center justify-center py-16">
                        <i class="fa-solid fa-lock text-4xl text-gray-500 mb-4"></i>
                        <p class="italic text-gray-400">
                            This community is private. You need to be invited to see posts.
                        </p>
                    </div>

                    <div v-else class="posts-list">
                        <div v-for="(post, index) in loadedPosts" :key="post"
                            :class="{ 'border-b border-gray-700/50': index !== loadedPosts.length - 1 }">
                            <PostGetPostComponent :postId="post" ownProfile="false" :is-community="true"
                                :profile="profileData" :ownProfile="ownProfile" :community-id="communityObject.id"
                                :account="accountData" :own-profile-data="ownProfileData" :border="false" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Spinner or 404 Not Found could be added here -->
    </div>

    <!-- Modals -->
    <!-- Rules Modal -->
    <ViewRulesModal :showModal="showRulesModal" :rules="rules" @close="showRulesModal = false" class="z-100" />

    <!-- Invite Link Modal -->
    <CreateInviteLinkModalComponent :showModal="showInviteLinkModal" :community-id="communityObject.id"
        @close="showInviteLinkModal = false" class="z-100" />

    <!-- Edit Community Modal -->
    <CommunitiesUpdateCommunityComponent :show-modal="showEditModal" :community="communityObject"
        @update="updateCommunity" @close="showEditModal = false" />
</template>

<script setup>
import axios from 'axios';
import Cookie from "js-cookie"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import ViewRulesModal from './ViewRulesModalComponent.vue';
import CreatePostComponent from '../post/CreatePostComponent.vue';
import currentPalette from '~/vars/getColors';
import CreateInviteLinkModalComponent from './CreateInviteLinkModalComponent.vue';

const props = defineProps({
    communityId: {
        type: String,
        required: true
    }
})

const displayName = ref("")
const description = ref("")
const members = ref("")
const moderators = ref([])
const rules = ref("")
const openCommunityImage = ref(false)
const showRulesModal = ref(false)
const showInviteLinkModal = ref(false)
const id = ref("")
const ownProfile = ref({})
const loaded = ref(false)
const memberArray = ref([])
const posts = ref(0)
const accountData = ref([])
const ownProfileData = ref([])
const profileData = ref([])
const communityObject = ref([])
const postsValue = ref([])
const haveImage = ref(true)
const postIndex = ref(0)
const lastRequest = ref(0)
const loadedPosts = ref([])
const runtimeConfig = useRuntimeConfig()
const showEditModal = ref(false)

function updateCommunity() {
    showEditModal.value = false
    getCommunity()
}

function getCommunity() {
    axios.post(baseURL + "/api/community/getCommunity", {
        token: Cookie.get("token"),
        communityId: props.communityId
    }).then(response => {
        displayName.value = response.data.community.displayName
        description.value = response.data.community.description
        members.value = response.data.community.members
        moderators.value = response.data.community.moderators
        rules.value = response.data.community.rules
        communityObject.value = response.data.community

        useHead({
            title: response.data.community.displayName + ' - faser.app',
        })

        loaded.value = true
    })
}

onMounted(() => {
    axios.get(baseURL + "/api/account/getOwnProfile", {
        headers: {
            token: Cookie.get("token")
        }
    })
        .then((response) => {
            id.value = response.data[0].id
            ownProfileData.value = response.data[0]
            accountData.value = response.data[1];
        })


    axios.post(baseURL + "/api/community/getPosts", {
        token: Cookie.get("token"),
        communityId: props.communityId
    })
        .then((response) => {
            posts.value = response.data.posts.length
            postsValue.value = response.data.posts

            loadPosts(25)
        })

    getMembers()
    getCommunity()
})

function getMembers() {
    axios.post(baseURL + "/api/community/getMembers", {
        communityId: props.communityId
    })
        .then((response) => {
            memberArray.value = response.data.members
        })
}

function leaveCommunity() {
    axios.post(baseURL + "/api/community/leaveCommunity", {
        token: Cookie.get("token"),
        communityId: props.communityId
    })
        .then((response) => {
            getMembers()
        })
        .catch((error) => {
            alert(error.response.data.message)
        })
}

function joinCommunity() {
    axios.post(baseURL + "/api/community/joinCommunity", {
        token: Cookie.get("token"),
        communityId: props.communityId
    })
        .then((response) => {
            getMembers()
        })
        .catch((error) => {
            alert(error.response.data.message)
        })
}

function deleteCommunity() {
    axios.post(baseURL + "/api/community/deleteCommunity", {
        token: Cookie.get("token"),
        communityId: props.communityId
    })
        .then((response) => {
            router.push("/communities")
        })
        .catch((error) => {
            alert(error.response.data.message)
        })
}

document.addEventListener("scroll", (event) => {
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

</script>

<style scoped>
/* Community Styles */
.community-container {
    position: relative;
}

.community-picture-container {
    position: relative;
    margin-top: -48px;
}

.community-picture {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.2s ease;
}

.community-picture:hover {
    transform: scale(1.05);
}

@media (min-width: 768px) {
    .community-picture {
        width: 128px;
        height: 128px;
    }
}

.status-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-left: 8px;
}

.status-badge.public {
    background-color: rgb(34, 197, 94);
    border: 2px solid rgb(134, 239, 172);
}

.status-badge.private {
    background-color: rgb(239, 68, 68);
    border: 2px solid rgb(252, 165, 165);
}

.join-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, #24c7ce, #1ed794);
    color: white;
    font-weight: 500;
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.join-button:hover {
    opacity: 0.9;
}

.leave-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #6b7280;
    color: white;
    font-weight: 500;
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.leave-button:hover {
    background: #ef4444;
}

.stat-item {
    transition: transform 0.15s ease;
}

.stat-item:hover {
    transform: translateY(-2px);
}

.info-message {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(71, 85, 105, 0.5);
    color: #94a3b8;
    font-style: italic;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    color: #f1f5f9;
}

.action-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.tag {
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

/* Animation for community image */
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
</style>