<template>
    <BaseModalComponent :isOpen="props.showModal" @close="$emit('close')" title="Change Song" icon="music"
        iconBgColor="green-950" iconBorderColor="green-600" :error="error" customClass="max-h-[80svh] overflow-scroll"
        animationDirection="bottom" :showDefaultFooter="false">
        <div class="flex justify-center text-center mt-2 text-gray-400">
            <div class="md:w-96 w-full flex gap-2">
                <input type="text" placeholder="Search for a song"
                    class="w-full p-2 rounded-md bg-gray-800 text-white mt-2" v-model="songSearch"
                    @input="error = ''" />
                <div class="w-1/3 p-2 rounded-md bg-gray-800 text-white mt-2 cursor-pointer" @click="searchSong">
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
                <iframe :src="'https://open.spotify.com/embed/track/' + songData.songId" class="md:w-96 w-full mx-5"
                    width="100%" height="80rem" frameBorder="0" allowfullscreen=""
                    allow="clipboard-write; encrypted-media;"></iframe>
            </div>
        </div>

        <div class="flex mt-2">
            <p>Music and Search from Spotify <i class="fa-brands fa-spotify"></i></p>
        </div>

        <template #footer>
            <div class="flex flex-col md:flex-row justify-center gap-2">
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
        </template>
    </BaseModalComponent>
</template>
<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import BaseModalComponent from "~/components/ui/BaseModalComponent.vue";

const props = defineProps({
    showModal: Boolean,
    profileSelector: Boolean,
})

defineEmits(['close']);

const router = useRouter();
const error = ref("");
const songSearch = ref("");
const loading = ref(false);
const songDataRaw = ref({});
const color = ref('');

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
            $emit('close');
            router.push("/profile");
        })
}

function removeSong() {
    axios.post(baseURL + "/api/spotify/removeTrack", {
        token: Cookies.get("token"),
    })
        .then((response) => {
            $emit('close');
            router.push("/profile");
        })
}
</script>
