<template>
    <div class="bg-gray-950 min-h-screen text-white" v-if="loaded">
        <div class="w-full flex justify-between pl-2 bg-gray-900 items-center fixed top-[4.5rem] p-2">
            <div class="flex items-center gap-2">
                <img :src="'https://api.faser.app/api/profile/getProfilePhoto?username=' + profile[0].username"
                    class="h-12 w-12 rounded-full">
                <p>{{ profile[0].displayName }}</p>
            </div>
            <div class="flex items-center mr-4 bg-gray-800 w-10 h-10 justify-center rounded-full">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
        </div>

        <div class="flex w-screen justify-center">
            <div class="mb-16 mt-16 max-w-[90rem] w-screen">
                <div v-for="message in messageHistory" :key="message.time" class="flex" :class="{
                    'justify-start': message.sender === profile[0].id,
                    'justify-end': message.sender === ownProfile[0].id,
                }">
                    <div class="bg-gray-900 p-2 rounded-xl m-2 max-w-[80svw]">
                        <p class="break-words">{{ message.message }}</p>
                        <div class="w-full flex" :class="{
                            'justify-start': message.sender === profile[0].id,
                            'justify-end': message.sender === ownProfile[0].id,
                        }">
                            <p class="text-xs text-gray-400">{{
                                DateTime.fromISO(message.time).toLocaleString(DateTime.DATETIME_MED) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex h-16 items-center bg-gray-900 p-2 fixed bottom-0 w-screen">
            <input type="text" class="w-full p-2 rounded-xl bg-gray-800 text-white" maxlength="1000"
                placeholder="Message" v-model="inputContent" v-on:keyup.enter="sendMessage" />
            <div class="bg-gray-800 w-10 h-10 rounded-full flex justify-center items-center ml-2 cursor-pointer"
                @click="sendMessage">
                <i class="fa-solid fa-paper-plane"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { DateTime } from "luxon";
import { useRoute } from "vue-router";
import axios from "axios";
import Cookies from "js-cookie";

const inputContent = ref("")
const route = useRoute()
const messageHistory = ref([])
const profile = ref({})
const loaded = ref(false)
const ownProfile = ref({})
const dms = ref([])

async function sendMessage() {
    if (inputContent.value.trim() === "") return

    await axios.post("https://api.faser.app/api/messages/sendDM", {
        token: Cookies.get("token"),
        otherAccount: profile.value[0].id,
        message: inputContent.value
    })

    messageHistory.value.push({
        message: inputContent.value,
        sender: ownProfile.value[0].id,
        time: DateTime.now().toISO()
    })

    inputContent.value = ""

    setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
    }, 100)
}

onMounted(async () => {
    window.scrollTo({ left: 0, top: document.body.scrollHeight });

    const profileResponse = await axios.get("https://api.faser.app/api/account/getProfile", {
        headers: {
            userId: route.path.split("/")[2]
        }
    })

    profile.value = profileResponse.data

    const ownProfileResponse = await axios.get("https://api.faser.app/api/account/getOwnProfile", {
        headers: {
            token: Cookies.get("token")
        }
    })

    ownProfile.value = ownProfileResponse.data

    const dmsResponse = await axios.post("https://api.faser.app/api/messages/getDMs", {
        token: Cookies.get("token"),
        otherAccount: profileResponse.data[0].id,
    })

    messageHistory.value = dmsResponse.data.messages

    console.log(dmsResponse.data.messages)

    loaded.value = true
})
</script>