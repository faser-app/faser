<template>
    <div>
        <div class="w-full">
            <div class="w-full bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-eye"></i>
                    <p>Always show NSFW Content</p>
                </div>
                <div>
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer" v-model="nsfw">
                        <div
                            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500">
                        </div>
                    </label>
                </div>
            </div>
            <div class="w-full mt-0.5 bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-eye-slash"></i>
                    <p>Hide NSFW</p>
                </div>
                <div>
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer" v-model="hideNSFW">
                        <div
                            class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500">
                        </div>
                    </label>
                </div>
            </div>
            <div class="w-full mt-0.5 bg-gray-800 p-2 gap-2 py-4 cursor-pointer">
                <p>Themes</p>
                <div class="flex flex-wrap items-center mt-2 justify-between">
                    <div v-for="color in colors" @click="changeTheme(color.name)" :key="color"
                        class="text-center gap-2 w-24">
                        <div class="w-24 flex justify-center">
                            <div :style="{ background: linearGradient('45deg', color) }" class="w-16 h-16 rounded-full">
                            </div>
                        </div>
                        {{ color.displayName }}
                    </div>
                </div>
                <p class="text-gray-400 text-sm mt-2">Themes are in beta, may change or be removed, and aren't fully
                    applied yet.</p>
            </div>
            <div v-if="mobile && !notificationsActivated && loggedIn"
                class="w-full mt-0.5 bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="subscribeToPushNotifications">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-bell"></i>
                    <p>Activate Notifications</p>
                </div>
            </div>
            <div v-if="mobile && notificationsActivated"
                class="w-full mt-0.5 bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-bell"></i>
                    <p>Notifications activated</p>
                </div>
            </div>
            <div v-if="mobile && notificationsActivated" @click="removeSubscription"
                class="w-full mt-0.5 bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-bell"></i>
                    <p>Disable Notifications</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import colors from "~/vars/colors";

const nsfw = ref(false)
const hideNSFW = ref(false)
const mobile = ref(false)
const notificationsActivated = ref(false)
const loggedIn = ref(false)

const runtimeConfig = useRuntimeConfig()

watch(() => nsfw.value, (value) => {
    localStorage.setItem("nsfw", value)
})

watch(() => hideNSFW.value, (value) => {
    localStorage.setItem("hideNSFW", value)
})

function changeTheme(theme) {
    Cookies.set("theme", theme)
    window.location.reload()
}

onMounted(() => {
    if (localStorage.getItem("nsfw") === "true") {
        nsfw.value = true
    }
    if (localStorage.getItem("hideNSFW") === "true") {
        hideNSFW.value = true
    }

    if (Cookies.get("token")) {
        loggedIn.value = true
    }

    if (window.navigator.standalone) {
        mobile.value = true
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
                        notificationsActivated.value = subscription !== null
                    })
            })
    }
})

async function subscribeToPushNotifications() {
    const publicVapidKey = 'BEPR3h9VaQvFvlh16jWSR_mODSV1hKkq2pIhRsFo5ak7GVJxrBNgndGRdbcRVSA55p8JafuN6U8h_Ct4fbZ0fdk';
    const registration = await navigator.serviceWorker.ready;

    const applicationServerKey = base64ToUint8Array(publicVapidKey);

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
    });

    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/saveSubscription", {
        subscription: subscription,
        tokens: JSON.parse(Cookies.get("tokenList"))
    })
        .then((response) => {
            notificationsActivated.value = true
        })
        .catch((error) => {
            console.error(error.response.data.message);
            alert("An error occurred. Please try again later.")
        });
}

async function removeSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    subscription.unsubscribe();
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