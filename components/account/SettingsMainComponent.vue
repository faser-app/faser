<template>
    <div class="h-screen md:flex gap-2" :style="{ backgroundColor: currentPalette.bg }">
        <div class="flex  flex-col w-full md:w-1/3 overflow-scroll max-h-screen">
            <div class="p-2 mb-0.5 flex gap-2 items-center cursor-pointer" @click="active = 'account'"
                :class="{ 'bg-gray-800': active === 'account', 'bg-gray-900': active !== 'account' }">
                <div class="text-xl bg-gray-700 p-1 rounded-lg w-10 h-10 flex items-center justify-center">
                    <i class="fa-solid fa-gears"></i>
                </div>
                <p>Account Settings</p>
            </div>
            <div class="p-2 mb-0.5 flex gap-2 items-center cursor-pointer" @click="active = 'profile'"
                :class="{ 'bg-gray-800': active === 'profile', 'bg-gray-900': active !== 'profile' }">
                <div class="text-xl bg-gray-700 p-1 rounded-lg w-10 h-10 flex items-center justify-center">
                    <i class="fa-solid fa-user-gear"></i>
                </div>
                <p>Profile Settings</p>
            </div>
            <div class="p-2 mb-0.5 flex gap-2 items-center cursor-pointer" @click="active = 'app'"
                :class="{ 'bg-gray-800': active === 'app', 'bg-gray-900': active !== 'app' }">
                <div class="text-xl bg-gray-700 p-1 rounded-lg w-10 h-10 flex items-center justify-center">
                    <i class="fa-solid fa-sliders"></i>
                </div>
                <p>App Settings</p>
            </div>
            <div class="text-red-500 p-2 mb-0.5 flex gap-2 items-center cursor-pointer" @click="active = 'dangerous'"
                :class="{ 'bg-gray-800': active === 'dangerous', 'bg-gray-900': active !== 'dangerous' }">
                <div class="text-xl bg-gray-700 p-1 rounded-lg w-10 h-10 flex items-center justify-center">
                    <i class="fa-solid fa-circle-exclamation"></i>
                </div>
                <p>Dangerous Zone</p>
            </div>
        </div>
        <div class="flex flex-col w-full md:w-2/3 overflow-scroll max-h-screen mt-4 md:mt-0">
            <AccountSettingsAccountComponent v-if="active === 'account'" />
            <AccountSettingsProfileComponent v-if="active === 'profile'" />
            <AccountSettingsDangerousComponent v-if="active === 'dangerous'" />
            <AccountSettingsAppComponent v-if="active === 'app'" />
        </div>
    </div>
</template>

<script setup>
import Cookies from "js-cookie";
import currentPalette from "~/vars/getColors";

const active = ref("account")

onMounted(() => {
    if (Cookies.get("token") === undefined) {
        window.location.href = "/login";
    }
})
</script>