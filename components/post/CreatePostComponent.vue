<template>
    <div :class="{
        'h-12 w-12': props.mobile === 'true',
    }" class="p-2 z-100 select-none cursor-pointer text-xl bottom-5 right-5 bg-gradient-to-tr hover:backdrop-brightness-0 from-[#24c7ce] to-[#1ed794] flex justify-center items-center rounded-full"
        @click="openModal">
        {{ props.text }}
    </div>

    <transition name="fade" @leave="leave">

        <div v-if="showModal"
            class="h-full z-100 pb-5 w-full fixed top-0 left-0 flex justify-center md:pt-36 items-end md:items-start"
            @click.self="closeModal" :class="{
                'fadeIn': showModal,
                'backdrop-blur-xl': !props.mobile !== undefined ? props.mobile : false
            }">
            <div class="w-full flex justify-center h-fit" :class="{
                'animation': showModal,
                'fadeOut': !showModal
            }">

                <div class="bg-gray-900 md:w-4/5 w-full md:mx-0 mx-2 p-3 rounded-xl">
                    <div class="flex">
                        <h1 class="w-full">Make Post</h1>
                        <div @click="closeModal" class="flex cursor-pointer justify-end text-xl mr-1">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <div class="bg-gray-800 mt-2 p-2 rounded-xl" :class="{
                        'border border-red-500': error
                    }">
                        <textarea class="w-full h-40 bg-gray-800 text-white pt-0 mt-2 resize-none focus:outline-none"
                            v-model="postContent" @input="error = ''"
                            placeholder="What are you thinking about?"></textarea>

                        <div v-if="selectedTrack">
                            <div class="flex absolute bg-gray-700 w-8 h-8 justify-center items-center p-2 rounded-xl cursor-pointer"
                                @click="selectedTrack = null">
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                            <iframe v-if="selectedTrack"
                                :src="'https://open.spotify.com/embed/track/' + selectedTrack.songId"
                                class="md:w-96 w-full mb-2" width="100%" height="80rem" frameBorder="0"
                                allowfullscreen="" allow="clipboard-write; encrypted-media;"></iframe>
                        </div>

                        <div class="flex gap-2">
                            <div class="flex cursor-pointer items-center w-12 h-12 justify-center bg-gray-700 rounded-xl"
                                @click="selectFile">
                                <i class="fa-solid fa-image text-2xl overflow-visible"></i>
                            </div>
                            <div @click="searchSong = !searchSong"
                                class="flex cursor-pointer items-center w-12 h-12 justify-center bg-gray-700 rounded-xl">
                                <i class="fa-solid fa-music text-2xl overflow-visible"></i>
                            </div>
                        </div>
                        <div class="flex gap-4 mt-2">
                            <template v-for="(image, index) in images">
                                <div class="flex bg-gray-700 p-2 rounded-xl">
                                    <div @click="images.splice(index, 1)"
                                        class="absolute cursor-pointer ml-[4rem] -mt-4 bg-gray-700 w-8 h-8 flex justify-center items-center rounded-full p-2">
                                        <i class="fa-solid fa-xmark"></i>
                                    </div>
                                    <img :src="getPreviewImage(image)" class="w-20 h-20 object-cover rounded-lg" />
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="mt-4" v-if="isAdult">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" v-model="nsfw">
                            <div
                                class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500">
                            </div>
                            <p class="ms-3 select-none text-sm font-medium dark:text-gray-300">NSFW <i
                                    class="fa-solid fa-triangle-exclamation"></i></p>
                        </label>
                    </div>
                    <p v-if="error" class="text-red-500 mt-1">{{ error }}</p>
                    <div class="flex md:flex-nowrap flex-wrap justify-end mt-2 gap-2">
                        <button @click="closeModal" class="bg-gray-700 p-2 md:w-2/3 w-full rounded-xl">Close</button>
                        <button @click="uploadPost" :disabled="postContent.length === 0 || loading"
                            class="bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] p-2 flex justify-center items-center md:w-1/3 w-full rounded-xl">

                            <p v-if="!loading">Post</p>
                            <div v-else>
                                <div class="container"></div>
                            </div>

                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <PostSelectSongComponent :show-modal="searchSong" @close="searchSong = false" class="z-[100]"
        @selectSong="selectSong" />
</template>

<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

const router = useRouter();
const showModal = ref(false);
const postContent = ref('');
const images = ref([]);
const error = ref('')
const mobile = ref(false)
const loading = ref(false)
const searchSong = ref(false)
const selectedTrack = ref(null)
const nsfw = ref(false)
const isAdult = ref(false)

function getPreviewImage(file) {
    return URL.createObjectURL(file);
}

function selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = (e) => {
        const file = e.target.files[0];
        images.value.push(file);
    };
}

let scrollpos = window.scrollY;

function openModal() {
    showModal.value = true

    scrollpos = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = "-" + scrollpos + "px";
    document.body.classList.add("overflow-hidden")
}

function closeModal() {
    showModal.value = false

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.classList.remove("overflow-hidden")
    window.scrollTo(0, scrollpos);
}

const props = defineProps({
    text: String,
    mobile: String,
    ownProfile: Object
})

onMounted(() => {
    const today = new Date()
    const birthDate = new Date(props.ownProfile.birthday)

    const age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        isAdult.value = age - 1 >= 18
    } else {
        isAdult.value = age >= 18
    }
})

function selectSong(song) {
    selectedTrack.value = song
    searchSong.value = false
}

function uploadPost() {
    loading.value = true

    axios.post("https://api.faser.app/api/social/createPost", {
        token: Cookies.get("token"),
        message: postContent.value,
        lang: "en",
        type: 'post',
        music: selectedTrack.value ? selectedTrack.value.songId : null,
        images: images.value.length,
        nsfw: nsfw.value
    })
        .then(response => {
            
            if (images.value.length === 0) {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.classList.remove("overflow-hidden")
                window.scrollTo(0, scrollpos);
                
                router.push("/profile")

                loading.value = false
            }

            if (images.value.length > 0) {
                for (let i = 0; i < images.value.length; i++) {
                    const formData = new FormData();
                    formData.append('file', images.value[i]);

                    axios.post("https://api.faser.app/api/social/uploadImage", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'token': Cookies.get('token'),
                            'postId': response.data.postId,
                            lang: 'en',
                            imageId: (i + 1)
                        }
                    })
                        .then(response => {
                            if (i === images.value.length - 1) {
                                document.body.style.position = '';
                                document.body.style.top = '';
                                document.body.classList.remove("overflow-hidden")
                                window.scrollTo(0, scrollpos);

                                router.push("/profile")

                                loading.value = false
                            }
                        })
                }
            }
        })
        .catch(err => {
            error.value = err.response.data.message
            loading.value = false
        })
}
</script>

<style scoped>
.animation {
    animation: fadeIn 0.3s;
}

.z-100 {
    z-index: 100;
}

.fadeIn {
    animation: fadeInOpacity 0.3s cubic-bezier(.6, 0, .4, 1);
}

.fade-leave-active {
    animation: fadeOut 0.3s;
}

@keyframes fadeIn {
    from {
        transform: translateY(100svh);
    }

    to {
        transform: translateY(0);
    }
}

@keyframes fadeInOpacity {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.container {
    --uib-size: 80px;
    --uib-color: black;
    --uib-speed: 1.4s;
    --uib-stroke: 5px;
    --uib-bg-opacity: .1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--uib-stroke);
    width: var(--uib-size);
    border-radius: calc(var(--uib-stroke) / 2);
    overflow: hidden;
    transform: translate3d(0, 0, 0);
}

.container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--uib-color);
    opacity: var(--uib-bg-opacity);
    transition: background-color 0.3s ease;
}

.container::after {
    content: '';
    height: 100%;
    width: 100%;
    border-radius: calc(var(--uib-stroke) / 2);
    animation: zoom var(--uib-speed) ease-in-out infinite;
    transform: translateX(-100%);
    background-color: var(--uib-color);
    transition: background-color 0.3s ease;
}

@keyframes zoom {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}
</style>