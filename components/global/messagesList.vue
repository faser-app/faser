<template>
    <div
        class="min-h-[calc(100vh-4.5rem)] px-4 py-6"
        :style="{
            backgroundColor: currentPalette.bg,
            color: currentPalette.textPrimary,
        }"
    >
        <h1 class="text-2xl font-bold mb-6">Direct Messages</h1>

        <!-- Empty state if no conversations -->
        <div
            v-if="participants.length === 0"
            class="flex flex-col items-center justify-center py-10"
        >
            <div
                class="bg-gray-800/50 rounded-full w-16 h-16 flex items-center justify-center mb-4"
            >
                <i class="fa-solid fa-message text-2xl opacity-60"></i>
            </div>
            <p class="text-gray-400 text-center">No conversations yet</p>
            <p class="text-gray-500 text-sm text-center mt-1">
                Messages sent to you will appear here
            </p>
        </div>

        <!-- Conversation list -->
        <div class="space-y-2">
            <div
                v-for="participant in participants"
                :key="participant[0].id"
                class="rounded-xl transition-all hover:bg-opacity-80"
                :style="{ backgroundColor: currentPalette.bgSecondary }"
            >
                <RouterLink
                    :to="'/messages/' + participant[0].id"
                    class="flex items-center p-4 w-full"
                >
                    <!-- Profile picture -->
                    <div class="relative">
                        <div
                            class="border w-12 h-12 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer overflow-hidden"
                        >
                            <img
                                v-if="haveProfilePicture"
                                :src="
                                    'https://s3.faser.app/profilepictures/' +
                                    participant[0].id +
                                    '/image.png' +
                                    '?t=' +
                                    new Date().getTime()
                                "
                                class="w-12 h-12 object-cover"
                                @error="haveProfilePicture = false"
                            />
                            <i v-else class="fa-solid fa-user text-2xl"></i>
                        </div>
                        <div
                            v-if="isOnline(participant[0].id)"
                            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"
                        ></div>
                    </div>

                    <!-- User info -->
                    <div class="ml-3 flex-1 overflow-hidden">
                        <div class="flex items-center">
                            <p class="font-medium truncate">
                                {{ participant[0].displayName }}
                            </p>
                            <!-- Verification badge if user is verified -->
                            <div
                                v-if="participant[0].businessAccount"
                                class="ml-2 flex justify-center items-center bg-yellow-600 border border-yellow-300 rounded-full w-5 h-5"
                            >
                                <i class="fa-solid fa-check text-xs"></i>
                            </div>
                            <div
                                v-else-if="participant[0].verifiedAccount"
                                class="ml-2 flex justify-center items-center bg-sky-600 border border-sky-300 rounded-full w-5 h-5"
                            >
                                <i class="fa-solid fa-check text-xs"></i>
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <p class="text-gray-400 text-sm truncate">
                                @{{ participant[0].username }}
                            </p>
                            <p
                                class="text-gray-500 text-xs"
                                v-if="getLastMessageTime(participant[0].id)"
                            >
                                {{ getLastMessageTime(participant[0].id) }}
                            </p>
                        </div>
                    </div>

                    <!-- Right arrow -->
                    <div class="text-gray-400 ml-2">
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import currentPalette from '~/vars/getColors'
import { DateTime } from 'luxon'

const participants = ref([])
const haveProfilePicture = ref(true)
const lastMessages = ref({})
const runtimeConfig = useRuntimeConfig()

// Function to format relative time (5m, 2h, etc)
function formatRelativeTime(date) {
    if (!date) return ''
    const now = DateTime.now()
    const messageTime = DateTime.fromISO(date)
    const diff = now.diff(messageTime, ['days', 'hours', 'minutes', 'seconds'])

    if (diff.days > 0) {
        return messageTime.toFormat('dd LLL')
    } else if (diff.hours > 0) {
        return `${Math.floor(diff.hours)}h`
    } else if (diff.minutes > 0) {
        return `${Math.floor(diff.minutes)}m`
    } else {
        return 'now'
    }
}

// Get the last message time for a user
function getLastMessageTime(userId) {
    if (lastMessages.value[userId]) {
        return formatRelativeTime(lastMessages.value[userId])
    }
    return ''
}

// Check if a user is online (placeholder)
function isOnline(userId) {
    // This is a placeholder. In a real app, you would implement
    // proper online status tracking.
    return false
}

// Load direct messages
onMounted(async () => {
    try {
        const response = await axios.post(
            baseURL + '/api/social/getDirectMessages',
            {
                token: Cookies.get('token'),
            }
        )

        const participantsIds = response.data.participants || []

        // Fetch last messages for each conversation
        const messagePromises = participantsIds.map((userId) =>
            axios
                .post(baseURL + '/api/messages/getDMs', {
                    token: Cookies.get('token'),
                    otherAccount: userId,
                    limit: 1, // Just get the latest message to show timestamp
                })
                .then((messageRes) => {
                    if (
                        messageRes.data.messages &&
                        messageRes.data.messages.length > 0
                    ) {
                        lastMessages.value[userId] =
                            messageRes.data.messages[0].time
                    }
                })
                .catch(() => {})
        )

        // Get participant profiles
        const profilePromises = participantsIds.map((userId) =>
            axios
                .get(baseURL + '/api/account/getProfile', {
                    headers: {
                        userid: userId,
                    },
                })
                .then((profileResponse) => {
                    participants.value.push(
                        profileResponse.data.sort((a, b) => a.id - b.id)
                    )
                })
                .catch(() => {})
        )

        await Promise.all([...messagePromises, ...profilePromises])

        // Sort conversations by last message time (most recent first)
        participants.value.sort((a, b) => {
            const timeA =
                lastMessages.value[a[0]?.id] || '1970-01-01T00:00:00.000Z'
            const timeB =
                lastMessages.value[b[0]?.id] || '1970-01-01T00:00:00.000Z'
            return DateTime.fromISO(timeB) - DateTime.fromISO(timeA)
        })
    } catch (error) {
        console.error('Error loading messages:', error)
    }
})
</script>

<style scoped>
.router-link-active {
    background-color: rgba(255, 255, 255, 0.05);
}

/* Hover effect */
.rounded-xl {
    transition:
        transform 0.15s ease,
        background-color 0.15s ease;
}

.rounded-xl:hover {
    transform: translateY(-1px);
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
