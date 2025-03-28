<template>
    <div class="min-h-[calc(100vh-4.5rem)] text-white" v-if="loaded">
        <div class="w-full flex justify-between z-50 pl-2 items-center fixed p-2"
            :style="{ backgroundColor: currentPalette.bgSecondary }" :class="{
            'top-[4.5rem]': !mobile,
            'top-0': mobile
        }">
            <RouterLink :to="'/' + profile[0].username" class="flex items-center gap-2">
                <img v-if="haveProfile"
                    :src="'https://s3.faser.app/profilepictures/' + profile[0].id + '/image.png' + '?t=' + new Date().getTime()"
                    :class="{
                        'rounded-full': !profile[0].businessAccount,
                        'rounded-md': profile[0].businessAccount
                    }" class="h-12 w-12 rounded-full" @error="haveProfile = false">
                <div v-else class="h-12 w-12 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
                    :class="{
                        'rounded-full': !profile[0].businessAccount,
                        'rounded-md': profile[0].businessAccount
                    }">
                    <i class="fa-solid fa-user rounded-full text-xl"></i>
                </div>
                <div class="flex items-center gap-2">
                    <div>
                        <div class="flex">
                            <p>{{ profile[0].displayName }}</p>
                            <div v-if="profile[0].businessAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>
                            <div v-else-if="profile[0].verifiedAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </RouterLink>


            <!-- <div class="flex items-center mr-4 bg-gray-800 w-10 h-10 justify-center rounded-full">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div> -->
        </div>

        <div class="flex w-screen justify-center">
            <div class="mt-16 max-w-[90rem] w-screen" :class="{
                'mb-16': !mobile,
                'mb-36': mobile
            }">
                <div v-for="(message, index) in messageHistory" :key="message.time">
                    <div v-if="isNewDay(message, messageHistory[index - 1])"
                        class="flex justify-center my-4 items-center gap-4">
                        <hr class="w-1/4 border-gray-700">
                        <p class="text-gray-400">
                            {{ DateTime.fromISO(message.time).toRelativeCalendar() }}
                        </p>
                        <hr class="w-1/4 border-gray-700">
                    </div>
                    <div :class="{
                        'justify-start': message.sender === profile[0].id,
                        'justify-end': message.sender === ownProfile[0].id,
                    }" class="flex">
                        <MessageContentComponent :message="message" :profile="profile" :ownProfile="ownProfile" />
                    </div>
                </div>

            </div>
        </div>


        <div class="flex h-16 items-center bg-gray-900 p-2 fixed bottom-0 w-screen" :class="{
            'bottom-20': mobile
        }">
            <input type="text" class="w-full p-2 rounded-md bg-gray-800 text-white" maxlength="1000"
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
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Cookies from "js-cookie";
import currentPalette from "~/vars/getColors";

const inputContent = ref("")
const route = useRoute()
const router = useRouter()
const messageHistory = ref([])
const profile = ref({})
const loaded = ref(false)
const ownProfile = ref({})
const mobile = ref(false)
const haveProfile = ref(true)
const runtimeConfig = useRuntimeConfig()


async function sendMessage() {
    if (inputContent.value.trim() === "") return

    try {
        messageHistory.value.push({
            message: inputContent.value,
            sender: ownProfile.value[0].id,
            time: DateTime.now().toISO()
        })
    } catch (error) { }

    await axios.post(baseURL + "/api/messages/sendDM", {
        token: Cookies.get("token"),
        otherAccount: profile.value[0].id,
        message: inputContent.value
    })

    inputContent.value = ""

    setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight });
    }, 100)
}

const interval = setInterval(async () => {

    if (route.path.split("/")[2] === String(profile.value[0].id)) {
        const dmsResponse = await axios.post(baseURL + "/api/messages/getDMs", {
            token: Cookies.get("token"),
            otherAccount: profile.value[0].id,
        })

        messageHistory.value = dmsResponse.data.messages
    } else {
        clearInterval(interval)
    }
}, 3000)

onMounted(async () => {

    const profileResponse = await axios.get(baseURL + "/api/account/getProfile", {
        headers: {
            userId: route.path.split("/")[2]
        }
    })

    profile.value = profileResponse.data

    const ownProfileResponse = await axios.get(baseURL + "/api/account/getOwnProfile", {
        headers: {
            token: Cookies.get("token")
        }
    }).catch(() => {
        router.push("/login")
    })

    ownProfile.value = ownProfileResponse.data

    const dmsResponse = await axios.post(baseURL + "/api/messages/getDMs", {
        token: Cookies.get("token"),
        otherAccount: profileResponse.data[0].id,
    })

    messageHistory.value = dmsResponse.data.messages

    if (profileResponse.data[0].id === ownProfileResponse.data[0].id) {
        router.push("/")
    }

    setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight });
    }, 250)
    loaded.value = true
})

if (window.navigator.standalone && window.navigator.userAgent.match(/(iPhone|iPod|iPad|Macintosh)/i)) {
    mobile.value = true
}

function isNewDay(currentMessage, previousMessage) {
    const currentDate = DateTime.fromISO(currentMessage.time).toFormat("yyyy-MM-dd");
    const previousDate = previousMessage
        ? DateTime.fromISO(previousMessage.time).toFormat("yyyy-MM-dd")
        : null;

    return currentDate !== previousDate;
}

</script>