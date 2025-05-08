<template>
    <div
        class="min-h-[calc(100vh-4.5rem)] text-white"
        v-if="loaded"
        :style="{ backgroundColor: currentPalette.bg }"
    >
        <!-- Chat header -->
        <div
            class="w-full flex justify-between z-50 items-center fixed p-4 shadow-md"
            :style="{ backgroundColor: currentPalette.bgSecondary }"
        >
            <div class="flex justify-between items-center">
                <!-- User info -->
                <RouterLink
                    :to="'/' + profile[0].username"
                    class="flex items-center gap-2"
                >
                    <!-- Profile picture -->
                    <div
                        class="overflow-hidden"
                        :class="{
                            'rounded-full': !profile[0].businessAccount,
                            'rounded-md': profile[0].businessAccount,
                        }"
                    >
                        <img
                            v-if="haveProfile"
                            :src="
                                'https://s3.faser.app/profilepictures/' +
                                profile[0].id +
                                '/image.png' +
                                '?t=' +
                                new Date().getTime()
                            "
                            :class="{
                                'rounded-full': !profile[0].businessAccount,
                                'rounded-md': profile[0].businessAccount,
                            }"
                            class="h-12 w-12 object-cover"
                            @error="haveProfile = false"
                        />
                        <div
                            v-else
                            class="h-12 w-12 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
                            :class="{
                                'rounded-full': !profile[0].businessAccount,
                                'rounded-md': profile[0].businessAccount,
                            }"
                        >
                            <i class="fa-solid fa-user text-xl"></i>
                        </div>
                    </div>

                    <!-- User details -->
                    <div class="flex flex-col">
                        <div class="flex items-center">
                            <p class="font-medium">
                                {{ profile[0].displayName }}
                            </p>
                            <!-- Verification badge -->
                            <div
                                v-if="profile[0].businessAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-5 h-5 border-yellow-300 rounded-full"
                            >
                                <i class="fa-solid fa-check text-xs"></i>
                            </div>
                            <div
                                v-else-if="profile[0].verifiedAccount"
                                class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-5 h-5 border-sky-300 rounded-full"
                            >
                                <i class="fa-solid fa-check text-xs"></i>
                            </div>
                        </div>
                        <p class="text-sm text-gray-400">
                            @{{ profile[0].username }}
                        </p>
                    </div>
                </RouterLink>

                <!-- Action buttons -->
                <div class="flex items-center gap-4">
                    <!-- Additional action buttons can be added here -->
                </div>
            </div>
        </div>

        <!-- Messages container -->
        <div class="flex justify-center">
            <div
                class="max-w-[90rem] w-full px-4 py-2"
                :class="{
                    'mt-24 mb-24': !mobile,
                    'mt-20 mb-28': mobile,
                }"
            >
                <!-- Date separators and messages -->
                <div
                    v-for="(message, index) in messageHistory"
                    :key="message.time"
                >
                    <!-- Date separator -->
                    <div
                        v-if="isNewDay(message, messageHistory[index - 1])"
                        class="flex justify-center my-6 items-center gap-4"
                    >
                        <hr class="w-1/3 border-gray-700/50" />
                        <div
                            class="px-4 py-1 rounded-full bg-gray-800/50 text-gray-400 text-xs"
                        >
                            {{
                                DateTime.fromISO(
                                    message.time
                                ).toRelativeCalendar()
                            }}
                        </div>
                        <hr class="w-1/3 border-gray-700/50" />
                    </div>

                    <!-- Message bubble -->
                    <div
                        :class="{
                            'justify-start': message.sender === profile[0].id,
                            'justify-end': message.sender === ownProfile[0].id,
                        }"
                        class="flex mb-4"
                    >
                        <MessageContentComponent
                            :message="message"
                            :profile="profile"
                            :ownProfile="ownProfile"
                        />
                    </div>
                </div>

                <!-- Empty state -->
                <div
                    v-if="!messageHistory"
                    class="flex flex-col items-center justify-center h-full py-20"
                >
                    <div
                        class="bg-gray-800/50 rounded-full w-16 h-16 flex items-center justify-center mb-4"
                    >
                        <i class="fa-solid fa-comment text-2xl opacity-60"></i>
                    </div>
                    <p class="text-gray-300">No messages yet</p>
                    <p class="text-gray-500 text-sm mt-1">
                        Send a message to start the conversation
                    </p>
                </div>
            </div>
        </div>

        <!-- Message input area -->
        <div
            class="flex h-16 p-3 fixed justify-start w-full bottom-0 shadow-lg"
            :style="{ backgroundColor: currentPalette.bgSecondary }"
            :class="{ 'mb-20': mobile }"
        >
            <div class="w-full mx-auto flex gap-2">
                <button
                    @click="selectFile"
                    class="w-10 h-10 rounded-full flex justify-center items-center transition-colors cursor-pointer"
                >
                    <i class="fa-solid fa-paperclip"></i>
                </button>
                <input
                    type="text"
                    autocomplete="off"
                    class="flex-1 p-3 rounded-full bg-gray-800/70 text-white border border-gray-700/30 focus:outline-none focus:border-gray-600"
                    maxlength="1000"
                    placeholder="Type a message..."
                    v-model="inputContent"
                    v-on:keyup.enter="sendMessage"
                />
                <button
                    class="w-10 h-10 rounded-full flex justify-center items-center transition-colors cursor-pointer"
                    :style="{ backgroundColor: currentPalette.buttonPrimary }"
                    @click="sendMessage"
                >
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Cookies from 'js-cookie'
import currentPalette from '~/vars/getColors'

const inputContent = ref('')
const route = useRoute()
const router = useRouter()
const messageHistory = ref([])
const profile = ref({})
const loaded = ref(false)
const ownProfile = ref({})
const mobile = ref(false)
const haveProfile = ref(true)
const runtimeConfig = useRuntimeConfig()
const typingIndicator = ref(false)
const typingTimeout = ref(null)

/**
 * Send a message to the chat
 */
async function sendMessage() {
    if (inputContent.value.trim() === '') return

    try {
        // Optimistically add the message to the UI
        messageHistory.value.push({
            message: inputContent.value,
            sender: ownProfile.value[0].id,
            time: DateTime.now().toISO(),
        })
    } catch (error) {}

    try {
        // Send message to the API
        await axios.post(baseURL + '/api/messages/sendDM', {
            token: Cookies.get('token'),
            otherAccount: profile.value[0].id,
            message: inputContent.value,
        })

        // Clear the input field after sending
        inputContent.value = ''

        // Scroll to the bottom of the chat
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top: document.body.scrollHeight,
                behavior: 'smooth',
            })
        }, 100)
    } catch (error) {
        console.error('Failed to send message:', error)
        // Handle any error cases - remove the optimistic message
        messageHistory.value.pop()
    }
}

function selectFile() {
    const input = document.createElement('input')
    input.type = 'file'
    input.click()

    input.onchange = (e) => {
        const file = e.target.files[0]

        if (!file) return

        if (file.size / 1024 / 1024 >= 50) {
            alert('File Size too big. Max size is 50MB.')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        axios
            .post(baseURL + '/api/messages/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: Cookies.get('token'),
                    recipient: profile.value[0].id,
                    lang: 'en',
                },
            })
            .then(() => {
                if (i === images.value.length - 1) {
                    router.go(0)
                    loading.value = false
                    resetForm()
                }
            })
            .catch((err) => {
                error.value =
                    err.response?.data?.message || 'Error uploading image'
                loading.value = false
            })
    }
}

/**
 * Check if the message is from a new day compared to the previous message
 */
function isNewDay(currentMessage, previousMessage) {
    const currentDate = DateTime.fromISO(currentMessage.time).toFormat(
        'yyyy-MM-dd'
    )
    const previousDate = previousMessage
        ? DateTime.fromISO(previousMessage.time).toFormat('yyyy-MM-dd')
        : null

    return currentDate !== previousDate
}

// Set up polling interval to fetch new messages
let messagePollingInterval = null

function startMessagePolling() {
    messagePollingInterval = setInterval(async () => {
        if (route.path.split('/')[2] === String(profile.value[0]?.id)) {
            try {
                const dmsResponse = await axios.post(
                    baseURL + '/api/messages/getDMs',
                    {
                        token: Cookies.get('token'),
                        otherAccount: profile.value[0].id,
                    }
                )

                // If there are new messages, update the message history
                if (
                    dmsResponse.data.messages &&
                    (messageHistory.value.length !==
                        dmsResponse.data.messages.length ||
                        JSON.stringify(messageHistory.value) !==
                            JSON.stringify(dmsResponse.data.messages))
                ) {
                    messageHistory.value = dmsResponse.data.messages

                    // Scroll to bottom if there are new messages
                    setTimeout(() => {
                        window.scrollTo({
                            left: 0,
                            top: document.body.scrollHeight,
                            behavior: 'smooth',
                        })
                    }, 100)
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error)
            }
        } else {
            // Clear interval if we navigate away
            stopMessagePolling()
        }
    }, 3000) // Poll every 3 seconds
}

function stopMessagePolling() {
    if (messagePollingInterval) {
        clearInterval(messagePollingInterval)
        messagePollingInterval = null
    }
}

// Clean up on component unmount
onBeforeUnmount(() => {
    stopMessagePolling()
})

// Load user data and messages
onMounted(async () => {
    try {
        // Get the profile of the chat partner
        const profileResponse = await axios.get(
            baseURL + '/api/account/getProfile',
            {
                headers: {
                    userId: route.path.split('/')[2],
                },
            }
        )
        profile.value = profileResponse.data

        // Get the current user's profile
        const ownProfileResponse = await axios.get(
            baseURL + '/api/account/getOwnProfile',
            {
                headers: {
                    token: Cookies.get('token'),
                },
            }
        )
        ownProfile.value = ownProfileResponse.data

        // Handle case where user tried to message themselves
        if (profileResponse.data[0].id === ownProfileResponse.data[0].id) {
            router.push('/messages')
            return
        }

        // Get the conversation history
        const dmsResponse = await axios.post(baseURL + '/api/messages/getDMs', {
            token: Cookies.get('token'),
            otherAccount: profileResponse.data[0].id,
        })
        messageHistory.value = dmsResponse.data.messages

        // Start polling for new messages
        startMessagePolling()

        // Scroll to bottom when loaded
        setTimeout(() => {
            window.scrollTo({ left: 0, top: document.body.scrollHeight })
            loaded.value = true
        }, 250)
    } catch (error) {
        console.error('Failed to load chat data:', error)
        // Redirect to login if unauthorized
        if (error.response?.status === 401) {
            router.push('/login')
        }
    }
})

// Detect if on mobile iOS
onMounted(() => {
    if (window.innerWidth < 765) {
        mobile.value = true
    }

    // Add input event listeners for typing indicator
    const messageInput = document.getElementById('message-input')
    if (messageInput) {
        messageInput.addEventListener('input', handleTyping)
    }
})

// Handle typing indicator functionality
function handleTyping() {
    // Clear existing timeout
    if (typingTimeout.value) {
        clearTimeout(typingTimeout.value)
    }

    // Set a timeout to show typing status for 2 seconds
    typingTimeout.value = setTimeout(() => {
        typingIndicator.value = false
    }, 2000)

    // Set typing indicator to true
    typingIndicator.value = true

    // Could send typing indicator to server here
    // axios.post(baseURL + "/api/messages/typing", {
    //     token: Cookies.get("token"),
    //     otherAccount: profile.value[0].id,
    //     isTyping: true
    // })
}
</script>

<style scoped>
/* Chat container styles */
.chat-container {
    position: relative;
    display: flex;
    flex-direction: column;
}

/* Message input animations */
@keyframes focusAnimation {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
}

input:focus {
    animation: focusAnimation 1s ease-in-out;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Back button hover effect */
.back-button {
    transition: transform 0.2s ease;
}

.back-button:hover {
    transform: translateX(-3px);
}

/* Send button effect */
button {
    transition:
        transform 0.2s ease,
        filter 0.2s ease;
}

button:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

button:active {
    transform: scale(0.95);
}

/* Message loading animation */
@keyframes message-loading {
    0%,
    100% {
        opacity: 0.3;
    }
    50% {
        opacity: 0.7;
    }
}

.message-loading {
    animation: message-loading 1.5s infinite ease-in-out;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
    );
    background-size: 200% 100%;
}
</style>
