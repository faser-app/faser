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
                ref="smallImage"
                @click="openImage = true"
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

        <!-- Fullscreen image overlay with transition -->
        <Transition name="fade">
            <div
                v-if="openImage"
                class="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000]"
                @click="openImage = false"
            >
                <Transition name="zoom">
                    <div class="relative" ref="largeImage" @click.stop>
                        <img
                            :src="message.message"
                            class="rounded-lg max-w-[90vw] max-h-[90vh] object-contain shadow-xl"
                        />
                        <button
                            class="absolute top-2 right-2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                            @click="openImage = false"
                        >
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import axios from 'axios'
import Cookies from 'js-cookie'
import currentPalette from '~/vars/getColors'

const runtimeConfig = useRuntimeConfig()
const hover = ref(false)
const openImage = ref(false)
const smallImage = ref(null)
const largeImage = ref(null)

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

// Handle ESC key to close the image
onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e) {
    if (e.key === 'Escape' && openImage.value) {
        openImage.value = false
    }
}

// Watch for image open/close to handle body scroll
watch(
    () => openImage.value,
    (value) => {
        // You could add additional logic here if needed
        // For example, prevent body scrolling when image is open
        if (value) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
)

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

/* Fade transition for the overlay */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Zoom transition for the image */
.zoom-enter-active,
.zoom-leave-active {
    transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
