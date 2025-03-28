<template>
    <div>
        <div class="w-full space-y-3">
            <!-- NSFW Content Setting -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-eye text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Always show NSFW Content</p>
                            <p class="text-gray-400 text-sm">Show sensitive content without blurring</p>
                        </div>
                    </div>
                    <div>
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" v-model="nsfw">
                            <div
                                class="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500">
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Hide NSFW Setting -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-eye-slash text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Hide NSFW</p>
                            <p class="text-gray-400 text-sm">Don't show any NSFW content</p>
                        </div>
                    </div>
                    <div>
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer" v-model="hideNSFW">
                            <div
                                class="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500">
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Themes -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="p-4">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-palette text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Themes</p>
                            <p class="text-gray-400 text-sm">Change the app appearance</p>
                        </div>
                    </div>

                    <div class="theme-grid grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div v-for="color in colors" @click="changeTheme(color.name)" :key="color"
                            class="theme-option flex flex-col items-center cursor-pointer p-3 rounded-lg hover:bg-gray-700/20 transition-colors">
                            <div class="theme-circle mb-2" :style="{ background: linearGradient('45deg', color) }">
                            </div>
                            <p>{{ color.displayName }}</p>
                        </div>
                    </div>

                    <p class="text-gray-400 text-xs mt-4 italic">
                        Themes are in beta, may change or be removed, and aren't fully applied yet.
                    </p>
                </div>
            </div>

            <!-- Notifications -->
            <div v-if="mobile && !notificationsActivated && loggedIn" class="setting-item rounded-lg overflow-hidden"
                :style="{ backgroundColor: currentPalette.bg }" @click="subscribeToPushNotifications">
                <div
                    class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-bell text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Activate Notifications</p>
                            <p class="text-gray-400 text-sm">Receive push notifications</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>

            <div v-if="mobile && notificationsActivated" class="setting-item rounded-lg overflow-hidden"
                :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="icon-container rounded-full w-10 h-10 flex items-center justify-center bg-green-600">
                            <i class="fa-solid fa-check text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Notifications activated</p>
                            <p class="text-gray-400 text-sm">You will receive push notifications</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="mobile && notificationsActivated" class="setting-item rounded-lg overflow-hidden"
                :style="{ backgroundColor: currentPalette.bg }" @click="removeSubscription">
                <div
                    class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-bell-slash text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Disable Notifications</p>
                            <p class="text-gray-400 text-sm">Stop receiving push notifications</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import colors from "~/vars/colors";
import currentPalette from "~/vars/getColors";

const nsfw = ref(false);
const hideNSFW = ref(false);
const mobile = ref(false);
const notificationsActivated = ref(false);
const loggedIn = ref(false);
const runtimeConfig = useRuntimeConfig();

watch(() => nsfw.value, (value) => {
    localStorage.setItem("nsfw", value);
});

watch(() => hideNSFW.value, (value) => {
    localStorage.setItem("hideNSFW", value);
});

function changeTheme(theme) {
    Cookies.set("theme", theme, { expires: 365 });
    window.location.reload();
}

onMounted(() => {
    if (localStorage.getItem("nsfw") === "true") {
        nsfw.value = true;
    }
    if (localStorage.getItem("hideNSFW") === "true") {
        hideNSFW.value = true;
    }
    if (Cookies.get("token")) {
        loggedIn.value = true;
    }
    if (window.navigator.standalone) {
        mobile.value = true;
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registriert:', registration);
            })
            .catch(console.error);
    }
    if ('PushManager' in window) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.pushManager.getSubscription()
                    .then((subscription) => {
                        notificationsActivated.value = subscription !== null;
                    });
            });
    }
});

async function subscribeToPushNotifications() {
    const publicVapidKey = 'BEPR3h9VaQvFvlh16jWSR_mODSV1hKkq2pIhRsFo5ak7GVJxrBNgndGRdbcRVSA55p8JafuN6U8h_Ct4fbZ0fdk';
    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = base64ToUint8Array(publicVapidKey);
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
    });
    axios.post(baseURL + "/api/community/saveSubscription", {
        subscription: subscription,
        tokens: JSON.parse(Cookies.get("tokenList"))
    })
        .then((response) => {
            notificationsActivated.value = true;
        })
        .catch((error) => {
            console.error(error.response.data.message);
            alert("An error occurred. Please try again later.");
        });
}

async function removeSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    subscription.unsubscribe();
    notificationsActivated.value = false;
}

function base64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const linearGradient = (angle, theme) => {
    const { name, displayName, textPrimary, textSecondary, ...colorValues } = theme;
    return `linear-gradient(${angle}, ${Object.values(colorValues).join(", ")})`;
};
</script>

<style scoped>
.setting-item {
    transition: all 0.2s ease;
    border: 1px solid rgba(75, 85, 99, 0.2);
}

.setting-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.icon-container {
    transition: all 0.2s ease;
}

.setting-item:hover .icon-container {
    transform: scale(1.05);
}

.theme-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.theme-option:hover .theme-circle {
    transform: scale(1.1);
}
</style>