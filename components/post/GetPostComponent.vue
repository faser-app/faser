<template>
    <div v-if="postVisible" class="w-full bg-gray-700 p-2 mb-2 rounded-xl">
        <div class="flex items-center">
            <div class="flex items-center w-full">
                <a :href="author.username" target="_blank" class="flex items-center">
                    <img :src="'https://api.faser.app/api/profile/getProfilePhoto?username=' + author.username"
                        alt="profile picture" class="rounded-full h-14 w-14 m-2" />
                    <p>{{ author.displayName }}</p>
                    <div v-if="author.verifiedAccount"
                        class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                        <i class="fa-solid verifiedBadge fa-check"></i>
                    </div>
                </a>
                <p class="ml-3 text-gray-400">{{ postCreatedAt }}</p>
            </div>

            <div v-if="isAuthor === 'true'" class="flex ml-auto">
                <div @click="showModal = true"
                    class="flex cursor-pointer items-center w-12 h-12 justify-center bg-gray-600 text-red-500 rounded-xl">
                    <i class="fa-solid fa-trash overflow-visible"></i>
                </div>
            </div>

        </div>
        <p class="ml-2" v-html="postValue"></p>

        <div class="flex gap-2 mt-2">
            <div v-for="image in postContent.images" :key="image" class="flex bg-gray-700 p-2 rounded-xl">
                <img @click="openImage('https://api.faser.app/api/social/getPostImage?postId=' + postContent.postId + '&imageId=' + image)"
                    :src="'https://api.faser.app/api/social/getPostImage?postId=' + postContent.postId + '&imageId=' + image"
                    class="w-48 h-48 object-cover rounded-lg" />
            </div>
        </div>

        <transition name="fade" @leave="leave">
            <div class="fixed top-0 left-0 w-screen h-screen backdrop-blur z-50 flex justify-center md:items-center items-end"
                v-if="showModal">
                <div class="bg-gray-900 p-5 text-center rounded-xl m-3 md:w-auto w-full" :class="{
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
                        <button @click="showModal = false" class="md:w-2/3 bg-gray-700 p-2 rounded-xl">
                            No
                        </button>
                        <button @click="deletePost" class="md:w-1/3 bg-red-500 p-2 rounded-xl">
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script setup>
import axios from "axios";
import MarkdownIt from "markdown-it";
import Cookies from "js-cookie";

const md = new MarkdownIt();

const showImageModal = ref(false);

const postVisible = ref(true);

const showModal = ref(false);

const props = defineProps({
    postId: String,
    ownProfile: Boolean
})

const postId = ref(props.postId)

const imageSrc = ref('')

function deletePost() {
    axios.post("https://api.faser.app/api/social/deletePost", {
        postid: postId.value,
        token: Cookies.get("token")
    })
        .then(() => {
            postVisible.value = false
        })
}

const isAuthor = ref(props.ownProfile)

function openImage(imageSrcValue) {
    showImageModal.value = true
    imageSrc.value = imageSrcValue
    console.log(imageSrc)
}

const postContent = ref({})
const author = ref({})

const postValue = ref('')

const postCreatedAt = ref('')

function formatTimeDifference(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    postValue.value = md.render(postContent.value.content)

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

onMounted(() => {
    axios.get("https://api.faser.app/api/social/fetchPost", {
        headers: {
            postId: postId.value
        }
    })
        .then((response) => {
            postContent.value = response.data[0]
            postCreatedAt.value = formatTimeDifference(postContent.value.creationDate)


            axios.get("https://api.faser.app/api/account/getProfile", {
                headers: {
                    userId: postContent.value.authorId
                }
            })
                .then((response) => {
                    author.value = response.data[0]
                })
        })
})
</script>
<style scoped>
.verifiedBadge {
    transform: translateY(1px);
}

.animation {
    animation: fadeIn 0.25s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-leave-active {
    animation: faceOut 0.25s;
}

@keyframes faceOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.bio h1 {
    font-size: 2em;
}

.bio h2 {
    font-size: 1.5em;
}

.bio h3 {
    font-size: 1.17em;
}

.bio h4 {
    font-size: 1em;
}

.bio h5 {
    font-size: 0.83em;
}

.bio h6 {
    font-size: 0.67em;
}

.bio p {
    font-size: 1em;
}

.bio a {
    text-decoration: underline;
}

.bio ul {
    list-style-type: disc;
}

.bio ol {
    list-style-type: decimal;
}

.bio li {
    font-size: 1em;
}

.bio blockquote {
    font-size: 1em;
}

.bio code {
    font-size: 1em;
}

.bio pre {
    font-size: 1em;
}

.bio strong {
    font-weight: bold;
}

.bio em {
    font-style: italic;
}

.bio u {
    text-decoration: underline;
}

.bio del {
    text-decoration: line-through;
}

.bio s {
    text-decoration: line-through;
}

.bio ins {
    text-decoration: underline;
}

.bio mark {
    background-color: yellow;
}

.bio sub {
    vertical-align: sub;
}

.bio sup {
    vertical-align: super;
}

.bio small {
    font-size: 0.83em;
}

.bio b {
    font-weight: bold;
}

.bio i {
    font-style: italic;
}

.bio u {
    text-decoration: underline;
}

.bio center {
    text-align: center;
}

.bio table {
    border-collapse: collapse;
    width: 100%;
}

.bio th {
    border: 1px solid #ddd;
    padding: 8px;
}

.bio td {
    border: 1px solid #ddd;
    padding: 8px;
}

.bio tr:nth-child(even) {
    background-color: #f2f2f2;
}
</style>
