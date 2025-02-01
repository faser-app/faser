<template>
    <div class="min-h-screen">
        <h1 class="ml-2 text-2xl font-bold">Direct Messages</h1>
        <div v-for="participant in participants" :key="participant.id"
            class="flex gap-2 items-center p-2 cursor-pointer">
            <RouterLink :to="'/messages/' + participant[0].id" class="flex items-center">
                <div
                    class="border w-12 h-12 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer">
                    <img v-if="haveProfilePicture"
                        :src="'https://s3.faser.app/profilepictures/' + participant[0].id + '/image.png' + '?t=' + new Date().getTime()"
                        class="rounded-full w-12 h-12 object-cover" />
                    <i v-else class="fa-solid fa-user rounded-full text-2xl"></i>
                </div>
                <p class="ml-2">{{ participant[0].displayName }}</p>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import axios from "axios"
import Cookies from "js-cookie"

const participants = ref([])
const haveProfilePicture = ref(true)
const runtimeConfig = useRuntimeConfig()


axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/social/getDirectMessages", {
    token: Cookies.get("token")
}).then((response) => {
    console.log(response.data.participants)

    for (let i = 0; i < response.data.participants.length; i++) {
        axios.get("https://" + runtimeConfig.public.apiUrlServer + "/api/account/getProfile", {
            headers: {
                userid: response.data.participants[i],
            }
        }).then((profileResponse) => {
            participants.value.push(profileResponse.data.sort((a, b) => a.id - b.id))
        })
    }
})
</script>