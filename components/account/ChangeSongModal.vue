<template>
    <transition name="fade" @leave="leave">
        <div v-if="props.showModal" :class="{ animation: props.showModal, fadeOut: !props.showModal }"
            @click.self="$emit('close')"
            class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur-sm">
            <div class="bg-gray-900 max-h-[80svh] overflow-scroll p-5 rounded-md m-3 md:w-auto w-full" :class="{
                'border border-red-500': error,
            }">
                <div class="w-full flex justify-center">
                    <div
                        class="bg-green-950 border border-green-600 h-14 w-14 rounded-full flex justify-center items-center">
                        <i class="fa-solid fa-music text-xl"></i>
                    </div>
                </div>
                <h2 class="text-center font-bold mt-2">Change Song</h2>
                <div class="flex justify-center text-center mt-2 text-gray-400">
                    <div class="md:w-96 w-full flex gap-2">
                        <input type="text" placeholder="Search for a song"
                            class="w-full p-2 rounded-md bg-gray-800 text-white mt-2" v-model="songSearch"
                            @input="error = ''" />
                        <div class="w-1/3 p-2 rounded-md bg-gray-800 text-white mt-2 cursor-pointer "
                            @click="searchSong">
                            Search
                        </div>
                    </div>

                </div>
                <div v-for="songData in songDataRaw.data" :key="songData.songName">
                    <div class="flex items-center cursor-pointer p-3 m-2 ml-6 rounded-md gap-3"
                        @click="selectedTrack = songData" :style="'background-color: ' + color">
                        <div class="flex items-center mr-6">
                            <i class="fa-regular fa-circle" v-if="selectedTrack !== songData"></i>
                            <i class="fa-solid fa-circle" v-else></i>
                        </div>
                        <i class="fa-solid fa-music"></i>
                        <div class="flex items-center gap-1">
                            <p>{{ songData.songName }} - </p>
                            <div v-for="(author, index) in songData.songAuthor" :key="author.name">
                                <p v-if="index === 0">{{ author.name }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex justify-center">
                        <iframe :src="'https://open.spotify.com/embed/track/' + songData.songId"
                            class="md:w-96 w-full mx-5" width="100%" height="80rem" frameBorder="0" allowfullscreen=""
                            allow="clipboard-write; encrypted-media;"></iframe>
                    </div>
                </div>
                <div class="flex mt-2">
                    <p>Music and Search from Spotify <i class="fa-brands fa-spotify"></i></p>
                </div>
                <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
                    <button @click="$emit('close')" class="md:w-2/3 bg-gray-700 p-2 rounded-md">
                        Cancel
                    </button>
                    <button @click="changeSong"
                        class="md:w-1/3 bg-green-500 disabled:bg-green-800 disabled:text-gray-300 text-white p-2 rounded-md"
                        v-if="!loading" :disabled="!selectedTrack">
                        Submit
                    </button>
                    <button @click="changeSong"
                        class="md:w-1/3 bg-green-500 p-2 rounded-md flex items-center justify-center" v-else>
                        <l-zoomies size="80" stroke="5" bg-opacity="0.1" speed="1.4" color="white"></l-zoomies>
                    </button>
                </div>
                <button v-if="props.profileSelector" @click="removeSong" class="w-full mt-2 text-gray-400">
                    Remove song
                </button>
            </div>
        </div>
    </transition>
</template>
<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const props = defineProps({
    showModal: Boolean,
    profileSelector: Boolean,
})

let scrollpos = window.scrollY;

const runtimeConfig = useRuntimeConfig()


watch(() => props.showModal, (value) => {
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

const router = useRouter();
const error = ref("");
const songSearch = ref("");
const loading = ref(false);
const songDataRaw = ref({});

const selectedTrack = ref(null)

function searchSong() {
    axios.post(baseURL + "/api/spotify/searchTrack", {
        query: songSearch.value,
    }).then((response) => {
        console.log(response.data);
        songDataRaw.value = response.data;
    }).catch((error) => {
        console.log(error.response.data);
    })
}

function changeSong() {
    axios.post(baseURL + "/api/spotify/saveTrack", {
        token: Cookies.get("token"),
        songId: selectedTrack.value.songId,
        albumId: selectedTrack.value.albumId,
    })
        .then((response) => {

            props.showModal = false;

            router.push("/profile");
        })
}

function removeSong() {
    axios.post(baseURL + "/api/spotify/removeTrack", {
        token: Cookies.get("token"),
    })
        .then((response) => {
            props.showModal = false;

            router.push("/profile");
        })
}

</script>

<style scoped>
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
</style>
