<template>
    <div class="max-w-[90rem] md:w-[80svw] w-[95svw] text-white max-h-[70svh] overflow-auto bg-gray-800 p-2 rounded-md">
        <div class="w-full flex items-center justify-between text-2xl font-bold">
            <div class="w-full text-center">
                <h1>Messages</h1>
            </div>
            <i v-if="!standalone" class="fa-solid fa-xmark mr-2 cursor-pointer text-xl" @click="closeUserMessages"></i>
        </div>
        <div v-if="messages.length === 0" class="w-full text-gray-400 italic flex items-center justify-center h-28">
            <p>Great! You have no new messages</p>
        </div>
        <div v-else v-for="(message, index) in messages" :key="message">
            <div v-if="message.type === 'like' || message.type === 'comment'" class="flex pb-2 mb-2" :class="{
                'border-b border-gray-500': index < messages.length - 1
            }">
                <div class="h-full items-center">
                    <div class="flex justify-center items-center w-8 h-8 bg-gray-700 rounded-full mr-2">
                        <div v-if="message.type === 'like'" class="text-red-500">
                            <i class="fa-solid fa-heart"></i>
                        </div>
                        <div v-else class="text-green-400">
                            <i class="fa-solid fa-comment"></i>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex w-full items-center">

                        <RouterLink @click="closeUserMessages" :to="'/' + message.userProfile[0].username" class="flex">
                            <p class="flex">{{ message.userProfile[0].displayName }}</p>
                            <p class="text-gray-400">(@{{ message.userProfile[0].username }})</p>
                            <div v-if="message.userProfile[0].businessAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>
                            <div v-else-if="message.userProfile[0].verifiedAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>
                        </RouterLink>

                    </div>
                    <RouterLink :to="'/post/' + message.postId" @click="closeUserMessages">
                        <div class="flex">
                            <p class="text-gray-400 mr-1" v-if="message.type === 'like'">Has liked your post: </p>
                            <p class="text-gray-400 mr-1" v-else>Commented on your post: </p>
                            <p>{{ message.postData[0] }}</p>
                        </div>
                    </RouterLink>
                </div>
            </div>
            <div v-else-if="message.type === 'follow'" class="flex pb-2 mb-2" :class="{
                'border-b border-gray-500': index < messages.length - 1
            }">
                <div class="h-full items-center">
                    <div class="flex justify-center items-center w-8 h-8 bg-gray-700 rounded-full text-sky-300 mr-2">
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                </div>
                <div>
                    <RouterLink @click="closeUserMessages" :to="'/' + message.userProfile[0].username">
                        <div class="flex w-full items-center">

                            <p class="flex">{{ message.userProfile[0].displayName }}</p>
                            <p class="text-gray-400">(@{{ message.userProfile[0].username }})</p>
                            <div v-if="message.userProfile[0].businessAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>
                            <div v-else-if="message.userProfile[0].verifiedAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>

                        </div>
                        <p class="text-gray-400">Has started following you</p>
                    </RouterLink>
                </div>
            </div>
            <div v-else-if="message.type === 'message'" class="flex pb-2 mb-2" :class="{
                'border-b border-gray-500': index < messages.length - 1
            }">
                <div class="h-full items-center">
                    <div class="flex justify-center items-center w-8 h-8 bg-gray-700 rounded-full text-sky-300 mr-2">
                        <i class="fa-solid fa-message"></i>
                    </div>
                </div>
                <div>
                    <RouterLink @click="closeUserMessages" :to="'/messages/' + message.userProfile[0].id">
                        <div class="flex w-full items-center">

                            <p class="flex">{{ message.userProfile[0].displayName }}</p>
                            <p class="text-gray-400">(@{{ message.userProfile[0].username }})</p>
                            <div v-if="message.userProfile[0].businessAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>
                            <div v-else-if="message.userProfile[0].verifiedAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                                <i class="fa-solid verifiedBadge fa-check"></i>
                            </div>

                        </div>
                        <p class="text-gray-400">Has sent you "{{ message.message }}"</p>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="w-full flex justify-center" v-if="messages.length > 0">
            <button class="bg-red-500 p-2 rounded-md" @click="clearMessages">
                Clear messages
            </button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { defineProps, defineEmits } from 'vue';
const runtimeConfig = useRuntimeConfig()


const emit = defineEmits([
    'closeMessages',
    'clearMessages'
])

const props = defineProps([
    'standalone',
    'messages'
])

function clearMessages() {
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/profile/clearUserMessages", {
        token: Cookies.get("token")
    })
        .then((response) => {
            emit('closeMessages')
            emit('clearMessages')
        });
}

// let scrollpos = window.scrollY;

function closeUserMessages() {
    if (!props.standalone) {
        emit('closeMessages')

        // document.body.style.position = '';
        // document.body.style.top = '';
        // document.body.classList.remove("overflow-hidden")
        // document.body.classList.remove("max-w-screen")
        // window.scrollTo(0, scrollpos);
    }
}
</script>