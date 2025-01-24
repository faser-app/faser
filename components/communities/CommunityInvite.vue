<template>
    <div class="min-h-screen">
        <div v-if="community" class="mb-2 min-h-screen w-screen flex items-center justify-center">
            <div class="bg-gray-800 md:flex p-5 rounded-xl w-[80svw] max-w-[90rem]">
                <div class="md:w-1/2 text-center items-center h-full flex flex-col justify-center">
                    <h1 class="text-2xl font-bold">{{ community.displayName }}</h1>
                    <p class="text-gray-400">You have been invited to join the {{ community.name }} community!</p>
                    <div class="mt-2 bg-gray-700 rounded-lg p-2 w-full">
                        {{ community.description }}
                    </div>

                    <div class="flex w-full justify-center gap-4 mt-5">
                        <div class="flex flex-col items-center">
                            <p class="text-gray-400">Members</p>
                            <p class="text-white font-bold">{{ community.members }}</p>
                        </div>
                        <div class="flex flex-col items-center">
                            <p class="text-gray-400">Moderators</p>
                            <p class="text-white font-bold">{{ moderators }}</p>
                        </div>
                        <div class="flex flex-col items-center">
                            <p class="text-gray-400">Creation Date</p>
                            <p class="text-white font-bold">{{ localeCreationDate }}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <p class="text-gray-400">Tags</p>
                        <div v-for="(tag, index) in community.tags" :key="tag"
                            class="bg-gray-700 rounded-md p-2 inline-block"
                            :class="{ 'mr-2': index !== community.tags.length - 1 }">
                            {{ tag }}
                        </div>
                    </div>
                    <div class="mt-3">
                        <p class="text-gray-400">Rules</p>
                        <div>
                            {{ community.rules }}
                        </div>
                    </div>
                    <div class="mt-3">
                        <p class="text-gray-400" v-if="community.nsfw || community.private">General info</p>
                        <div class="flex gap-2">
                            <div v-if="community.nsfw" class="bg-red-500 p-2 rounded-lg">
                                <p class="text-white">NSFW</p>
                            </div>
                            <div v-if="community.private" class="bg-blue-500 p-2 rounded-lg">
                                <p class="text-white">Private</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="md:w-1/2 text-center flex flex-col items-end justify-center">
                    <img src="https://faser.app/icon/logo.png" alt="Faser Logo" class="w-fzull">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold py-2 px-4 rounded"
                        @click="joinCommunity" :disabled="disableJoinButton">{{ joinButtonText }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios"
import { DateTime } from "luxon"
import Cookies from "js-cookie"
import { useRouter } from "vue-router"

const props = defineProps({
    inviteCode: String
})

const community = ref({})
const localeCreationDate = ref(null)
const moderators = ref(0)
const disableJoinButton = ref(false)
const joinButtonText = ref("Join Community")
const router = useRouter()

onMounted(() => {
    axios.post("https://api.faser.app/api/community/getCommunityByInvite", {
        inviteCode: props.inviteCode
    })
        .then((response) => {
            community.value = response.data.community

            if (!Cookies.get("token")) {
                disableJoinButton.value = true
                joinButtonText.value = "Not logged in"
            }

            moderators.value = response.data.community.moderators.length
            localeCreationDate.value = DateTime.fromSeconds(community.value.created / 1000).toLocaleString()
        })
})

function joinCommunity() {
    axios.post("https://api.faser.app/api/community/joinCommunityByInvite", {
        inviteCode: props.inviteCode,
        token: Cookies.get("token")
    })
        .then((response) => {
            router.push("/communities/" + community.value.id)
        })
        .catch((error) => {
            console.log(error.response)
            if (error.response.data.message) {
                disableJoinButton.value = true
                joinButtonText.value = error.response.data.message
            }
        })
}
</script>