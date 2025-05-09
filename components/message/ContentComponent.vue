<template>
    <!-- Delete message button -->
    <div
        class="absolute -mt-6 mx-2 bg-gray-800 p-2 w-8 h-8 flex items-center justify-center rounded-full text-red-500 cursor-pointer shadow-lg"
        v-if="hover && message.sender === ownProfile[0].id"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="deleteMessage"
    >
        <i class="fa-solid fa-trash text-sm"></i>
    </div>

    <!-- Message bubble -->
    <div
        class="p-3 rounded-2xl max-w-[80%] shadow-sm"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        :style="
            message.sender === ownProfile[0].id
                ? { backgroundColor: currentPalette.buttonPrimary }
                : { backgroundColor: currentPalette.bgSecondary }
        "
    >
        <!-- Message content -->
        <p
            v-if="message.type !== 'file'"
            class="break-words ph-no-capture text-sm"
            v-html="convertedToUrl(message.message)"
        ></p>

        <div v-if="message.type === 'file'">
            <!-- Image files -->
            <img
                v-if="
                    message.message.endsWith('.png') ||
                    message.message.endsWith('.jpg') ||
                    message.message.endsWith('.jpeg') ||
                    message.message.endsWith('.webp') ||
                    message.message.endsWith('.gif')
                "
                :src="message.message"
                class="rounded-lg max-h-80"
            />

            <!-- Video files -->
            <video
                v-else-if="
                    message.message.endsWith('.mp4') ||
                    message.message.endsWith('.webm') ||
                    message.message.endsWith('.mov') ||
                    message.message.endsWith('.avi')
                "
                controls
                class="rounded-lg max-w-full max-h-80"
            >
                <source :src="message.message" />
                Your browser does not support the video tag.
            </video>

            <!-- Audio files -->
            <audio
                v-else-if="
                    message.message.endsWith('.mp3') ||
                    message.message.endsWith('.wav') ||
                    message.message.endsWith('.ogg') ||
                    message.message.endsWith('.m4a')
                "
                controls
                class="w-64"
            >
                <source :src="message.message" />
                Your browser does not support the audio tag.
            </audio>

            <!-- Unknown file type -->
            <div
                v-else
                class="flex items-center p-2 bg-gray-800/30 rounded-lg cursor-pointer"
                @click="downloadFile(message.message)"
            >
                <i class="fa-solid fa-file mr-2"></i>
                <span class="text-sm">{{
                    message.message.split('/').pop()
                }}</span>
            </div>
        </div>

        <!-- Message timestamp -->
        <div
            class="w-full flex mt-1"
            :class="{
                'justify-start': message.sender === profile[0].id,
                'justify-end': message.sender === ownProfile[0].id,
            }"
        >
            <p class="text-xs opacity-70">{{ formatTime(message.time) }}</p>
        </div>
    </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import axios from 'axios'
import Cookies from 'js-cookie'
import currentPalette from '~/vars/getColors'

const runtimeConfig = useRuntimeConfig()
const hover = ref(false)

function deleteMessage() {
    axios
        .post(baseURL + '/api/messages/deleteDM', {
            token: Cookies.get('token'),
            messageId: props.message.id,
            otherAccount: props.profile[0].id,
        })
        .then(() => {})
}

function downloadFile(url) {
    window.location.href = url
}

function formatTime(time) {
    return DateTime.fromISO(time).toLocaleString(DateTime.TIME_SIMPLE)
}

const urlRegix =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

function convertedToUrl(message) {
    var words = message.split(' ')
    for (var i = 0; i < words.length; i++) {
        if (urlRegix.test(words[i])) {
            words[i] =
                '<a href="' +
                words[i] +
                '" target="_blank" class="underline">' +
                words[i] +
                '</a>'
        }
    }
    return words.join(' ')
}

const props = defineProps({
    message: Object,
    profile: Object,
    ownProfile: Object,
})
</script>

<style scoped>
a {
    color: #7dd3fc;
    transition: color 0.2s;
}

a:hover {
    color: #38bdf8;
    text-decoration: underline;
}
</style>
