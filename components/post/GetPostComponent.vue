<template>
    <div v-if="postVisible" class="w-full max-w-[90rem] p-2 pb-4 text-white"
        :style="{ backgroundColor: currentPalette.bgSecondary }" :class="{
        'border-b border-gray-700': border,
    }">
        <div class="flex items-center"
            v-if="postType === 'comment' && !route.fullPath.split('/')[2].includes(parentPost)">
            <div class="rounded-tl-lg border-t-2 border-l-2 border-gray-500 h-4 w-4 ml-8"></div>
            <RouterLink :to="'/post/' + parentPost" class="ml-2 mb-4 text-gray-400 underline cursor-pointer">Go to
                parent post</RouterLink>
        </div>
        <div class="flex items-center">
            <div class="flex items-center w-full">
                <RouterLink v-if="props.ownProfile === 'false'" :to="'/' + author.username" class="flex items-center">
                    <div v-if="props.ownProfile === 'false'">
                        <img v-if="author.hasProfilePicture" @error="author.hasProfilePicture = false"
                            :src="'https://s3.faser.app/profilepictures/' + author.id + '/image.png'"
                            alt="profile picture" class="h-14 w-14 m-2 object-cover" :class="{
                                'rounded-full': !author.businessAccount,
                                'rounded-lg': author.businessAccount
                            }" />
                        <div v-else
                            class="h-14 w-14 m-2 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
                            :class="{
                                'rounded-full': !author.businessAccount,
                                'rounded-md': author.businessAccount
                            }">
                            <i class="fa-solid fa-user rounded-full text-2xl"></i>
                        </div>
                    </div>
                    <p>{{ author.displayName }}</p>
                    <div v-if="author.businessAccount"
                        class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                        <i class="fa-solid verifiedBadge fa-check"></i>
                    </div>
                    <div v-else-if="author.verifiedAccount"
                        class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                        <i class="fa-solid verifiedBadge fa-check"></i>
                    </div>
                </RouterLink>
                <RouterLink v-else :to="'/' + author.username" class="flex items-center">
                    <img v-if="author.hasProfilePicture" @error="author.hasProfilePicture = false"
                        :src="'https://s3.faser.app/profilepictures/' + author.id + '/image.png'" alt="profile picture"
                        class="h-14 w-14 m-2 object-cover" :class="{
                            'rounded-full': !author.businessAccount,
                            'rounded-lg': author.businessAccount
                        }" />
                    <div v-else
                        class="h-14 w-14 m-2 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
                        :class="{
                            'rounded-full': !author.businessAccount,
                            'rounded-md': author.businessAccount
                        }">
                        <i class="fa-solid fa-user rounded-full text-2xl"></i>
                    </div>

                    <p>{{ author.displayName }}</p>
                    <div v-if="author.businessAccount"
                        class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                        <i class="fa-solid verifiedBadge fa-check"></i>
                    </div>
                    <div v-else-if="author.verifiedAccount"
                        class="flex ml-2 justify-center text-xs items-center bg-sky-600 border min-w-6 h-6 border-sky-300 rounded-full">
                        <i class="fa-solid verifiedBadge fa-check"></i>
                    </div>
                </RouterLink>
                <div class="flex flex-wrap">
                    <p class="ml-3 text-gray-400 cursor-default" @mouseover="showTooltip = true"
                        @mouseleave="showTooltip = false">
                        {{ postCreatedAt }}
                    <div class="absolute -mt-12" v-if="showTooltip">
                        {{ localDateTime }}
                    </div>
                    </p>
                    <p class="ml-3 text-gray-400" v-if="postContent.edited">edited</p>
                    <p class="ml-3 text-gray-400" v-if="postContent.ai">AI <i class="fa-solid fa-robot"></i></p>
                    <div class="flex px-2 ml-3 items-center bg-red-500 rounded-full text-sm cursor-pointer select-none gap-2"
                        v-if="postContent.nsfw" @click="toggleNSFW">
                        <p>NSFW</p>

                        <i class="fa-solid fa-eye" v-if="showPost"></i>
                        <i class="fa-solid fa-eye-slash" v-else></i>
                    </div>
                </div>
            </div>

            <Menu as="div" class="relative inline-block text-left z-2">
                <div>
                    <MenuButton
                        class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </MenuButton>
                </div>

                <transition enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                    <MenuItems
                        class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                        :style="{ backgroundColor: currentPalette.bgSecondary }">
                        <div class="px-1 py-1">
                            <MenuItem>
                            <div class="group flex w-full items-center rounded-md px-1 py-1 text-sm">
                                <div class="flex gap-2 w-full items-center">
                                    <div class="w-1/2 p-2 cursor-pointer rounded-lg py-3"
                                        :style="{ backgroundColor: currentPalette.bgSecondary }" @click="sharePost">
                                        <div class="mr-2 flex w-full justify-center items-center text-gray-300">
                                            <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                        </div>
                                    </div>
                                    <div v-if="!props.isCommunity"
                                        :style="{ backgroundColor: currentPalette.bgSecondary }"
                                        class="w-1/2 p-2 cursor-pointer rounded-lg py-3" @click="toggleSave">
                                        <div class="mr-2 flex w-full justify-center items-center text-gray-300">
                                            <i v-if="!savedPost" class="fa-regular fa-bookmark"></i>
                                            <i v-else class="fa-solid fa-bookmark"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" v-if="isAuthor">
                            <button :class="[
                                active ? 'bg-gray-600 text-white' : 'text-gray-200',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]" @click="openDeleteModal">
                                <i class="fa-solid fa-trash mr-2"></i>
                                Delete
                            </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }" v-if="isAuthor">
                            <button :class="[
                                active ? 'bg-gray-600 text-white' : 'text-gray-200',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]" @click="openEditModal">
                                <i class="fa-solid fa-edit mr-2"></i>
                                Edit
                            </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                            <button :class="[
                                active ? 'bg-gray-600 text-white' : 'text-gray-200',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]" @click="showReport = true">
                                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                                Report
                            </button>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </transition>
            </Menu>

        </div>
        <div v-if="isAdult || !postContent.nsfw" :class="{
            'blur-lg': !showPost && postContent.nsfw
        }">
            <p class="ml-2" v-html="postValue"></p>
            <div class="overflow-x-scroll scroll-snap-x">
                <div class="inline-flex gap-2 mt-2">
                    <div v-for="image in postContent.images" :key="image"
                        class="p-2 rounded-md inline-block scroll-snap-item"
                        :style="{ backgroundColor: currentPalette.bgSecondary }">
                        <img @click="openImage('https://s3.faser.app/postimages/' + author.id + '/' + postContent.postId + '/' + image + '.png')"
                            :src="'https://s3.faser.app/postimages/' + author.id + '/' + postContent.postId + '/' + image + '.png'"
                            class="max-w-80 max-h-80 rounded-lg cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex w-full justify-center items-center h-36 rounded-md mb-2"
            :style="{ backgroundColor: currentPalette.buttonDanger, color: currentPalette.textPrimary }">
            <div class="w-full flex justify-center flex-wrap">
                <div
                    class="border border-red-500 bg-red-900 p-4 rounded-full text-xl w-12 h-12 flex items-center justify-center">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="w-full text-center" v-if="loggedIn">
                    <p>This post is marked as NSFW. You have to be 18 years or older to view this post.</p>
                </div>
                <div class="w-full text-center" v-else>
                    <p>This post is marked as NSFW. You have to be logged in and 18 years or older to view this
                        post.
                    </p>
                </div>
            </div>
        </div>
        <iframe v-if="postContent.music" :src="'https://open.spotify.com/embed/track/' + postContent.music"
            class="md:w-96 w-full mb-2" width="100%" height="80rem" frameBorder="0" allowfullscreen=""
            allow="clipboard-write; encrypted-media;"></iframe>


        <a v-if="embed.url || embed.image || embed.title || embed.description" :href="embed.url" target="_blank"
            class="w-fit no-underline flex mb-2 items-center gap-2">
            <div class="md:w-48 w-full">
                <img v-if="embed.image" :src="embed.image" class="h-48 object-cover" :class="{
                    'rounded-lg' : !embed.title,
                    'rounded-t-lg' : embed.title
                }" />
                <div v-if="embed.title || embed.description" class="flex flex-col w-full p-2 bg-gray-800" :class="{
                    'rounded-lg' : !embed.image,
                    'rounded-b-lg' : embed.image
                }">
                    <p v-if="embed.title" class="font-bold">{{ embed.title }}</p>
                    <p v-if="embed.description">{{ embed.description }}</p>
                </div>
            </div>
        </a>


        <div class="flex w-full items-center justify-center">
            <div class="flex justify-center gap-2 w-1/3 cursor-pointer items-center text-gray-300" @click="toggleLike">

                <Transition name="like" @leave="leave" @enter="open">
                    <i v-if="isLiked" class="fa-solid text-xl absolute fa-heart text-red-500"></i>
                </Transition>
                <i v-if="!isLiked" class="fa-regular absolute text-xl fa-heart transition-colors duration-150"></i>
                <p class="ml-10">
                    {{ postLikes }}
                </p>
            </div>
            <div class="flex gap-2 w-1/3 justify-center cursor-pointer items-center text-gray-300">
                <RouterLink :to="'/post/' + postContent.postId"
                    class="flex no-underline gap-2 items-center justify-center">
                    <i class="fa-regular fa-comment text-xl"></i>
                    <p>
                        {{ postComments }}
                    </p>
                </RouterLink>
            </div>
            <div class="w-1/3 flex gap-2 justify-center items-center text-gray-300">
                <i class="fa-solid fa-chart-line"></i>
                <p>{{ impressions }}</p>
            </div>
        </div>
        <div class="flex w-full gap-2 mt-2" :style="{ color: currentPalette.textSecondary }">
            <input type="text" class="w-3/4 p-2 rounded-md focus:outline-hidden"
                :style="{ backgroundColor: currentPalette.buttonPrimary }" placeholder="Write a comment..."
                v-model="commentText" />
            <button v-if="!runningCommentRequest" class="w-1/4 p-2 rounded-md"
                :style="{ backgroundColor: currentPalette.buttonDanger }" @click="postComment">Comment</button>
            <button v-else class="w-1/4 bg-gray-600 p-2 rounded-md">
                <l-line-wobble size="80" stroke="5" bg-opacity="0.1" speed="1.75" color="black"></l-line-wobble>
            </button>
        </div>



        <transition name="fade" @leave="leave">
            <div v-if="showLoginModal" @click.self="showLoginModal = false"
                class="fixed w-screen h-screen top-0 left-0 z-[100] backdrop-blur-md flex items-center justify-center">
                <div
                    class="bg-gray-900 p-5 text-center min-w-[80svw] max-w-[80svw] h-[80svh] flex justify-center rounded-md m-3 md:w-auto flex-wrap items-stretch">
                    <div class="w-full h-fit flex justify-end">
                        <i class="fa-solid fa-xmark cursor-pointer p-3" @click="showLoginModal = false"></i>
                    </div>
                    <LoginComponent />
                </div>
            </div>
        </transition>

        <transition name="fade" @leave="leave">
            <div class="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-200 flex justify-center items-center"
                @click.self="showModal = false" v-if="showModal">
                <div class="bg-gray-900 p-5 text-center max-w-[80svw] rounded-md m-3 md:w-auto w-full" :class="{
                    'animation': showModal,
                }">
                    <div class="w-full flex justify-center">
                        <div
                            class="bg-red-950 border border-red-600 h-14 w-14 rounded-full flex justify-center items-center">
                            <i class="fa-solid fa-trash text-xl"></i>
                        </div>
                    </div>
                    <h2 class="text-center font-bold mt-2">Delete Post?</h2>
                    <p>Do you really want to delete this post?</p>
                    <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
                        <button @click="showModal = false" class="md:w-2/3 bg-gray-700 p-2 rounded-md">
                            Cancel
                        </button>
                        <button @click="deletePost" class="md:w-1/3 bg-red-500 p-2 rounded-md">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade" @leave="leave">
            <div class="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm z-200 flex justify-center items-center"
                @click.self="showEditModal = false" v-if="showEditModal">
                <!-- <div v-if="ownProfileData.advancedUser"> -->
                <div>
                    <div class="p-5 text-center rounded-md m-3 max-w-[80svw] md:w-auto w-full" :class="{
                        'animation': showEditModal,
                    }" :style="{ backgroundColor: currentPalette.bg }">
                        <div class="w-full flex justify-center">
                            <div
                                class="bg-red-950 border border-red-600 h-14 w-14 rounded-full flex justify-center items-center">
                                <i class="fa-solid fa-pen text-xl"></i>
                            </div>
                        </div>
                        <h2 class="text-center font-bold mt-2">Edit post</h2>
                        <p class="text-gray-400">If you edit the post, an edited text will be added to the post</p>
                        <textarea
                            class="w-full p-2 rounded-md h-40 text-white pt-0 mt-2 resize-none focus:outline-hidden"
                            :style="{ backgroundColor: currentPalette.bgSecondary }"
                            v-model="postContent.content"></textarea>
                        <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
                            <button @click="showEditModal = false" class="md:w-2/3 p-2 rounded-md"
                                :style="{ backgroundColor: currentPalette.buttonSecondary }">
                                Cancel
                            </button>
                            <button @click="editPost" class="md:w-1/3 p-2 rounded-md"
                                :style="{ backgroundColor: currentPalette.buttonDanger }">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                <!-- <div v-else>
                    <AdvancedComponent :showModal="showEditModal" @closeModal="showEditModal = false" />
                </div> -->
            </div>
        </transition>
        <transition name="fade" @leave="leave">
            <div class="fixed md:bg-transparent top-0 z-200 left-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center bg-black"
                @click.self="showImageModal = false" v-if="showImageModal">
                <div class="overflow-auto text-center md:rounded-md md:w-auto w-full" :class="{
                    'animation': showImageModal,
                    'transition-back duration-300': !isDragging
                }" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
                    :style="{ transform: `translateY(${translateY}px)` }">

                    <div class="overflow-x-scroll scroll-snap-x">
                        <div class="inline-flex md:gap-2 md:mt-2">
                            <div v-for="image in postContent.images" :key="image"
                                class="md:bg-transparent w-screen md:w-auto justify-center bg-black md:p-2 rounded-md flex items-center scroll-snap-item"
                                @click.self="showImageModal = false">
                                <img :src="'https://s3.faser.app/postimages/' + author.id + '/' + postContent.postId + '/' + image + '.png'"
                                    class="max-w-[100vw] max-h-screen md:rounded-lg md:max-w-[80svw] md:w-auto md:max-h-[80svh]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <Transition name="fade" @leave="leave" @enter="enter">
            <div v-if="showReport"
                class="fixed h-full z-200 w-full backdrop-blur-sm top-0 left-0 flex justify-center items-center">
                <div class="w-[60rem] max-h-[80svh] overflow-y-scroll mx-4 p-2 rounded-md"
                    :style="{ backgroundColor: currentPalette.bg }">
                    <div class="w-full flex items-center justify-center text-xl font-bold">
                        <h1 class="w-full text-center">Report Post</h1>
                        <i class="fa-solid fa-xmark mr-2 cursor-pointer" @click="showReport = false"></i>
                    </div>
                    <SupportFieldsComponent :predefinedSubject="'Post Report for ' + author.displayName"
                        :predefinedMessage="'I want to report this post because...\n\nPost ID: ' + postId" />
                    <p class="ml-2">Please provide the Post ID for the Person you want to report.</p>
                </div>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import axios from "axios";
import MarkdownIt from "markdown-it";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { useRouter, useRoute } from "vue-router";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import currentPalette from "~/vars/getColors";

const router = useRouter();
const route = useRoute();
const md = new MarkdownIt({
    html: false,
    linkify: false,
}).disable(["code", "table", "heading", "hr", "image"]);
const showImageModal = ref(false);
const threeDotElementOpen = ref(false)
const postContent = ref({})
const author = ref({})
const postValue = ref('')
const commentText = ref('')
const postCreatedAt = ref('')
const postVisible = ref(true);
const showLoginModal = ref(false)
const copied = ref(false);
const postType = ref('')
const parentPost = ref('')
const runningCommentRequest = ref(false);
const postLikes = ref(0);
const postComments = ref(0)
const isLiked = ref(false);
const hovered = ref(false);
const showModal = ref(false);
const showEditModal = ref(false);
const threeDotsMenu = ref(false);
const profile = ref({})
const impressions = ref(0)
const showPost = ref(false)
const isAdult = ref(false)
const showReport = ref(false)
const loggedIn = ref(Cookies.get("token") !== undefined)
const hideNSFW = ref(false)
const showTooltip = ref(false)
const localDateTime = ref("")
const savedPost = ref(false)
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const translateY = ref(0)
const embed = ref({
    url: "",
    title: "",
    description: "",
    image: "",
    type: "",
})
const runtimeConfig = useRuntimeConfig()


const props = defineProps({
    postId: String,
    ownProfile: Boolean,
    account: Object,
    ownProfileData: Object,
    admin: Boolean,
    border: Boolean,
    isCommunity: Boolean || false,
    communityId: String,
})

const isAuthor = ref(false)

if (localStorage.getItem("nsfw") === "true") {
    showPost.value = true
}
if (localStorage.getItem("hideNSFW") === "true") {
    hideNSFW.value = true
}

watch(() => postContent.value, (value) => {
    if (value.nsfw && hideNSFW.value) {
        postVisible.value = false
    }

    isAuthor.value = props.ownProfileData.id === value.authorId
})

let scrollpos = window.scrollY

watch(() => showImageModal.value, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})

watch(() => showEditModal, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})

const handleTouchStart = (event) => {
    isDragging.value = true;
    startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
    if (!isDragging.value) return;
    currentY.value = event.touches[0].clientY;
    if (currentY.value - startY.value > 0) {
        translateY.value = currentY.value - startY.value;
    }
};

const handleTouchEnd = () => {
    isDragging.value = false;

    if (translateY.value > 200) {
        showImageModal.value = false
    }
    translateY.value = 0;
};

watch(() => showModal.value, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})

function postComment() {
    runningCommentRequest.value = true

    axios.post(baseURL + "/api/social/createPost", {
        token: Cookies.get("token"),
        message: commentText.value,
        lang: "en",
        type: 'comment',
        parentPost: postId.value,
        images: 0,
        community: postContent.value.postId.includes("cmt"),
    })
        .then(() => {
            if (router.currentRoute.value.path.startsWith("/post/")) {
                router.go(0)
            } else {
                router.push("/post/" + postId.value)
            }

            runningCommentRequest.value = false
        })
        .catch((error) => {
            runningCommentRequest.value = false

            if (error.response.status === 429) {
                alert("You are being rate limited")
            }
        })
}

function toggleNSFW() {
    if (isAdult.value) {
        showPost.value = !showPost.value
    }
}

function toggleSave() {
    if (savedPost.value) {
        unsavePost()
    } else {
        savePost()
    }
}

function savePost() {
    axios.post(baseURL + "/api/social/savePost", {
        postId: postId.value,
        token: Cookies.get("token"),
    })
        .then(() => {
            savedPost.value = true
        })
}

function unsavePost() {
    axios.post(baseURL + "/api/social/unsavePost", {
        postId: postId.value,
        token: Cookies.get("token"),
    })
        .then(() => {
            savedPost.value = false
        })
}

watch(() => props.account, (account) => {
    const today = new Date()
    const birthdate = new Date(account.birthday)

    let age = today.getFullYear() - birthdate.getFullYear();
    let m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    if (age >= 18) {
        isAdult.value = true
    }
})

onMounted(() => {
    author.value.displayName = profile.displayName
    author.value.verifiedAccount = profile.verifiedAccount
    author.value.businessAccount = profile.businessAccount

    const today = new Date()
    const birthdate = new Date(props.account.birthday)

    let age = today.getFullYear() - birthdate.getFullYear();
    let m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    if (age >= 18) {
        isAdult.value = true
    }

    if (props.ownProfileData.savedPosts) {
        if (props.ownProfileData.savedPosts.includes(postId.value)) {
            savedPost.value = true
        }
    }
})

function closeMenu() {
    threeDotElementOpen.value = false

    threeDotsMenu.value = false
}

axios.get(baseURL + "/api/profile/getPostProfile", {
    headers: {
        postId: props.postId,
        community: props.isCommunity,
    }
})
    .then((response) => {
        author.value = response.data[0]
        author.value.username = response.data[1].username
        author.value.hasProfilePicture = true
    })

function toggleLike() {
    if (!loggedIn.value) {
        showLoginModal.value = true
        return
    }

    if (!isAdult.value && postContent.value.nsfw) {
        return
    }

    isLiked.value = !isLiked.value

    if (isLiked.value) {
        postLikes.value++
    } else {
        postLikes.value--
    }

    axios.post(baseURL + "/api/social/toggleLike", {
        postId: postId.value,
        token: Cookies.get("token"),
        community: props.isCommunity
    })
        .then(() => {
        })
        .catch((error) => {
            if (error.response.data.message === "Account not found") {
                router.push("/login")
            }

            if (error.response.status === 429) {
                alert("You are being rate limited")

                isLiked.value = !isLiked.value

                if (isLiked.value) {
                    postLikes.value++
                } else {
                    postLikes.value--
                }
            }
        })
}

const postId = ref(props.postId)

const imageSrc = ref('')

function deletePost() {
    if (!props.admin) {
        axios.post(baseURL + "/api/social/deletePost", {
            postid: postId.value,
            token: Cookies.get("token"),
            community: props.isCommunity,
            communityId: props.communityId
        })
            .then(() => {
                postVisible.value = false
                showModal.value = false
            })
    } else {
        axios.post(baseURL + "/api/admin/deletePost", {
            postId: postId.value,
            token: Cookies.get("token"),
            community: props.isCommunity
        })
            .then(() => {
                postVisible.value = false
                showModal.value = false
            })
    }
}

function editPost() {
    axios.post(baseURL + "/api/social/editPost", {
        postId: postId.value,
        token: Cookies.get("token"),
        message: postContent.value.content,
        community: props.isCommunity
    })
        .then(() => {
            showEditModal.value = false
            reloadStats()
        })
}

function openreport() {
    openReport.value = true
}

function openImage(imageSrcValue) {
    showImageModal.value = true
    imageSrc.value = imageSrcValue
    translateY.value = 0
}

function formatTimeDifference(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    postValue.value = md.render(postContent.value.content)

    const words = postContent.value.content.split(" ").length

    for (let i = 0; i < words; i++) {
        if (postContent.value.content.split(" ")[i].includes("https://")) {
            postValue.value = postValue.value.replace(postContent.value.content.split(" ")[i], `<a style="text-decoration: underline;" class="underline text-blue-500" href="${postContent.value.content.split(" ")[i]}" target="_blank">${postContent.value.content.split(" ")[i]}</a>`)

            const url = postContent.value.content.split(" ")[i]

            loadEmbed(url)
        }

        if (postContent.value.content.split(" ")[i].includes("@")) {
            postValue.value = postValue.value.replace(postContent.value.content.split(" ")[i], `<a style="text-decoration: underline;" href="https://faser.app/${postContent.value.content.split(" ")[i].replace("@", "")}">${postContent.value.content.split(" ")[i]}</a>`)
        }
    }

    const units = [
        { name: "y", seconds: 60 * 60 * 24 * 365 },
        { name: "mo", seconds: 60 * 60 * 24 * 30 },
        { name: "w", seconds: 60 * 60 * 24 * 7 },
        { name: "d", seconds: 60 * 60 * 24 },
        { name: "h", seconds: 60 * 60 },
        { name: "m", seconds: 60 },
        { name: "s", seconds: 1 }
    ];

    for (const unit of units) {
        const diff = Math.floor(diffInSeconds / unit.seconds);
        if (diff >= 1) {
            return `${diff}${unit.name}`;
        }
    }
    return "just now";
}

function loadEmbed(url) {
    axios.post(baseURL + "/api/social/embed", {
        url: url
    })
        .then((response) => {
            embed.value = response.data
        })
}

function openDeleteModal() {
    showModal.value = true
    closeMenu()
}

function openEditModal() {
    showEditModal.value = true
    closeMenu()
}

function sharePost() {
    navigator.share({
        url: "https://faser.app/post/" + postId.value
    })
}

function reloadStats() {
    axios.get(baseURL + "/api/social/fetchPost", {
        headers: {
            postId: postId.value,
            community: props.isCommunity,
            token: Cookies.get("token")
        }
    })
        .then((response) => {

            postContent.value = response.data[0]
            postCreatedAt.value = formatTimeDifference(postContent.value.creationDate)

            isLiked.value = postContent.value.likes.includes(props.ownProfileData.id)

            postLikes.value = response.data[0].likes.length

            impressions.value = response.data[0].impressions.length

            postLikes.value = postContent.value.likes.length

            postComments.value = postContent.value.comments.length

            localDateTime.value = DateTime.fromMillis(postContent.value.creationDate).toLocaleString(DateTime.MED)

            postType.value = response.data[0].postType
            parentPost.value = response.data[0].parentPost
        })
        .catch((err) => {
            console.error(err)

            console.log(props)
        })
}

onMounted(() => {

    reloadStats()
})
</script>
<style scoped>
@import url("~/assets/css/markdown.css");

.verifiedBadge {
    transform: translateY(1px);
}

.animation {
    animation: fadeIn 0.25s;
}

.overflow-x-scroll {
    scroll-snap-type: x mandatory;
}

.overflow-x-scroll::-webkit-scrollbar {
    display: none;
}

.scroll-snap-item {
    scroll-snap-align: start;
}

.fade-enter-active {
    animation: fadeIn 0.25s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        z-index: 10;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        z-index: 10;
        transform: translateY(0);
    }
}

.fade-leave-active {
    animation: faceOut 0.25s;
}

@keyframes faceOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(5px);
    }
}

.like-enter-active {
    animation: likeIn 0.25s ease;
}

@keyframes likeIn {
    0% {
        transform: scale(0.5);
    }

    85% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

.like-leave-active {
    animation: likeOut 0.25s;
}

@keyframes likeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

i {
    z-index: 0;
}

.transition-back {
    transition: all 500ms cubic-bezier(.46, 0, 0, 1.31);
}
</style>
