<template>
    <div class="min-h-screen" :style="{ backgroundColor: currentPalette.bg, color: currentPalette.textPrimary }">
        <div class="w-full pb-12 pt-2 px-2" :style="{ backgroundColor: currentPalette.bgSecondary }" v-if="loaded">
            <div v-if="memberArray.includes(id)" class="w-fit">
                <CreatePostComponent text="+" :own-profile="ownProfileData" :mobile="false" :community="true"
                    :community-id="props.communityId" :community-object="communityObject" />
            </div>
            <div v-else-if="!communityObject.private" class="w-full flex justify-center mt-2">
                <div class="w-96 text-gray-400 italic mt-2 p-4 mx-2 rounded-md text-center"
                    :style="{ backgroundColor: currentPalette.bgSecondary }">
                    <p>Join this community to make post.</p>
                </div>
            </div>
            <div v-else class="w-full flex justify-center mt-2">
                <div class="w-96 text-gray-400 italic mt-2 p-4 mx-2 rounded-md text-center"
                    :style="{ backgroundColor: currentPalette.bgSecondary }">
                    <p>This community is private. You need to be invited to make posts.</p>
                </div>
            </div>
            <div class="flex justify-end w-full h-0 px-3">
                <p class="-translate-y-10">
                <Menu as="div" class="relative inline-block text-left">
                    <div>
                        <MenuButton
                            class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </MenuButton>
                    </div>

                    <transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <MenuItems
                            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none"
                            :style="{ backgroundColor: currentPalette.bgSecondary }">
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                <button :class="[
                                    active ? 'bg-gray-600 text-white' : 'text-gray-200',
                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                ]" @click="showRulesModal = true">
                                    Rules
                                </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                <button :class="[
                                    active ? 'bg-gray-600 text-white' : 'text-gray-200',
                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                ]" @click="showInviteLinkModal = true">
                                    Create Invite link
                                </button>
                                </MenuItem>
                                <MenuItem v-if="!memberArray.includes(id)" v-slot="{ active }">
                                <button :class="[
                                        active ? 'bg-gray-600 text-green-500' : 'text-green-500',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="joinCommunity">
                                    Join Community
                                </button>
                                </MenuItem>
                                <MenuItem v-else v-slot="{ active }">
                                <button :class="[
                                        active ? 'bg-gray-600 text-red-500' : 'text-red-500',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="leaveCommunity">
                                    Leave Community
                                </button>
                                </MenuItem>
                                <MenuItem v-if="communityObject.owner === ownProfileData.id" v-slot="{ active }">
                                <button :class="[
                                        active ? 'bg-gray-600 text-red-500' : 'text-red-500',
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
                </p>
            </div>
            <div class="flex justify-center w-full h-24">
                <div class="border border-gray-700 h-24 w-24 rounded-full flex justify-center items-center">
                    <i class="fa-solid fa-users text-4xl"></i>
                </div>
            </div>
            <div class="flex justify-center w-full mt-2 text-3xl font-bold">
                <h1>{{ displayName }}</h1>
            </div>
            <div class="flex justify-center w-full mt-2">
                <h1>{{ description }}</h1>
            </div>

            <div class="flex w-full justify-center gap-4 mt-4">
                <div class="flex flex-col items-center">
                    <span class="text-gray-400">Members</span>
                    <span class="text-white">{{ members }}</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-gray-400">Moderators</span>
                    <span class="text-white">{{ moderators.length }}</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-gray-400">Posts</span>
                    <span class="text-white">{{ posts }}</span>
                </div>
            </div>
        </div>

        <div class="w-screen flex justify-center">
            <div class="md:w-4/5 max-w-[90rem] w-full mr-4">
                <div class="flex flex-wrap mt-2 mb-2 md:w-full md:ml-1 rounded-md pl-1 md:pr-2 items-center md:mr-2 h-fit"
                    :style="{ backgroundColor: currentPalette.bgSecondary }">
                    <div class="p-2 mt-2 w-full md:pr-3 md:ml-2 rounded-md items-center h-fit"
                        :style="{ backgroundColor: currentPalette.bgSecondary }">
                        <div v-if="posts === 0 && !communityObject.private"
                            class="h-36 flex justify-center items-center">
                            <p class="italic text-gray-400">No posts yet</p>
                        </div>
                        <div v-else-if="posts === 0 && communityObject.private"
                            class="h-36 flex justify-center items-center">
                            <p class="text-gray-400 italic text-center">This community is private. You need to be
                                invited to
                                see
                                posts.</p>
                        </div>
                        <div v-else v-for="(post, index) in loadedPosts" :key="post" class="w-full block">
                            <PostGetPostComponent :postId="post" ownProfile="false" :is-community="true"
                                :profile="profileData" :ownProfile="ownProfile" :community-id="communityObject.id"
                                :account="accountData" :own-profile-data="ownProfileData"
                                :border="index !== loadedPosts.length - 1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ViewRulesModal :showModal="showRulesModal" :rules="rules" @close="showRulesModal = false" class="z-[100]" />
    <CreateInviteLinkModalComponent :showModal="showInviteLinkModal" :community-id="communityObject.id"
        @close="showInviteLinkModal = false" class="z-[100]" />
</template>

<script setup>
import axios from 'axios';
import Cookie from "js-cookie"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import ViewRulesModal from './ViewRulesModalComponent.vue';
import CreatePostComponent from '../post/CreatePostComponent.vue';
import CreateInviteLinkModal from './CreateInviteLinkModalComponent.vue';
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
const postIndex = ref(0)
const lastRequest = ref(0)
const loadedPosts = ref([])
const runtimeConfig = useRuntimeConfig()



onMounted(() => {
    axios.get("https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile", {
        headers: {
            token: Cookie.get("token")
        }
    })
        .then((response) => {
            id.value = response.data[0].id
            ownProfileData.value = response.data[0]
            accountData.value = response.data[1];
        })

    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/getCommunity", {
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


    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/getPosts", {
        token: Cookie.get("token"),
        communityId: props.communityId
    })
        .then((response) => {
            posts.value = response.data.posts.length
            postsValue.value = response.data.posts

            loadPosts(25)
        })

    getMembers()
})

function getMembers() {
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/getMembers", {
        communityId: props.communityId
    })
        .then((response) => {
            memberArray.value = response.data.members
        })
}

function leaveCommunity() {
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/leaveCommunity", {
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
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/joinCommunity", {
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
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/deleteCommunity", {
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