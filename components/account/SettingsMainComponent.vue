<template>
    <div class="h-screen md:flex gap-2">
        <div class="flex  flex-col w-full md:w-1/3 overflow-scroll max-h-screen">
            <div class="p-2 mb-0.5 flex gap-2 items-center cursor-pointer" @click="active = 'account'"
                :class="{ 'bg-gray-800': active === 'account', 'bg-gray-900': active !== 'account' }">
                <i
                    class="fa-solid fa-gears text-xl bg-gray-700 p-1 rounded-lg w-10 h-10 flex items-center justify-center"></i>
                <p>Account Settings</p>
            </div>
            <div class="p-2 mb-0.5 flex gap-2 items-center cursor-pointer" @click="active = 'profile'"
                :class="{ 'bg-gray-800': active === 'profile', 'bg-gray-900': active !== 'profile' }">
                <i
                    class="fa-solid fa-user-gear text-xl bg-gray-700 p-1 rounded-lg w-10 h-10 flex items-center justify-center"></i>
                <p>Profile Settings</p>
            </div>
            <div class="text-red-500 p-2 mb-0.5 flex gap-2 items-center cursor-pointer" @click="active = 'dangerous'"
                :class="{ 'bg-gray-800': active === 'dangerous', 'bg-gray-900': active !== 'dangerous' }">
                <i
                    class="fa-solid fa-circle-exclamation text-xl bg-gray-700 p-1 rounded-lg w-10 h-10 flex items-center justify-center"></i>
                <p>Dangerous Zone</p>
            </div>
        </div>
        <div class="flex flex-col w-full md:w-2/3 overflow-scroll max-h-screen">
            <AccountSettingsAccountComponent v-if="active === 'account'" />
            <AccountSettingsProfileComponent v-if="active === 'profile'" />
            <AccountSettingsDangerousComponent v-if="active === 'dangerous'" />
        </div>
    </div>
</template>

<script setup>
import Cookies from "js-cookie";

const active = ref("account")

onMounted(() => {
    if(Cookies.get("token") === undefined) {
        window.location.href = "/login";
    }
})
</script>