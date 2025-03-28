<template>
    <div class="min-h-[calc(100vh-4.5rem)] text-white settings-container"
        :style="{ backgroundColor: currentPalette.bg }">
        <div class="md:flex w-full justify-center">
            <div class="md:w-4/5 max-w-[90rem] w-full px-4 py-4 md:flex gap-6">
                <!-- Settings Navigation Sidebar -->
                <div class="sidebar-section md:w-1/3 rounded-xl overflow-hidden shadow-lg mb-6"
                    :style="{ backgroundColor: currentPalette.bgSecondary }">
                    <h2 class="text-xl font-semibold p-4 border-b border-gray-700/50">Settings</h2>
                    <div class="settings-nav">
                        <div class="nav-item p-3 flex gap-3 items-center cursor-pointer transition-colors duration-200"
                            @click="active = 'account'" :class="{ 'bg-gray-700/30': active === 'account' }"
                            :style="{ borderLeft: active === 'account' ? '3px solid ' + currentPalette.accent : '' }">
                            <div class="icon-container rounded-lg w-10 h-10 flex items-center justify-center"
                                :style="{ backgroundColor: currentPalette.bg }">
                                <i class="fa-solid fa-gears"></i>
                            </div>
                            <p class="font-medium">Account Settings</p>
                        </div>
                        <div class="nav-item p-3 flex gap-3 items-center cursor-pointer transition-colors duration-200"
                            @click="active = 'profile'" :class="{ 'bg-gray-700/30': active === 'profile' }"
                            :style="{ borderLeft: active === 'profile' ? '3px solid ' + currentPalette.accent : '' }">
                            <div class="icon-container rounded-lg w-10 h-10 flex items-center justify-center"
                                :style="{ backgroundColor: currentPalette.bg }">
                                <i class="fa-solid fa-user-gear"></i>
                            </div>
                            <p class="font-medium">Profile Settings</p>
                        </div>
                        <div class="nav-item p-3 flex gap-3 items-center cursor-pointer transition-colors duration-200"
                            @click="active = 'app'" :class="{ 'bg-gray-700/30': active === 'app' }"
                            :style="{ borderLeft: active === 'app' ? '3px solid ' + currentPalette.accent : '' }">
                            <div class="icon-container rounded-lg w-10 h-10 flex items-center justify-center"
                                :style="{ backgroundColor: currentPalette.bg }">
                                <i class="fa-solid fa-sliders"></i>
                            </div>
                            <p class="font-medium">App Settings</p>
                        </div>
                        <div class="nav-item p-3 flex gap-3 items-center cursor-pointer transition-colors duration-200 text-red-500"
                            @click="active = 'dangerous'" :class="{ 'bg-gray-700/30': active === 'dangerous' }"
                            :style="{ borderLeft: active === 'dangerous' ? '3px solid red' : '' }">
                            <div class="icon-container rounded-lg w-10 h-10 flex items-center justify-center"
                                :style="{ backgroundColor: currentPalette.bg }">
                                <i class="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <p class="font-medium">Dangerous Zone</p>
                        </div>
                    </div>
                </div>

                <!-- Settings Content Area -->
                <div class="md:w-2/3 settings-content">
                    <div class="rounded-xl overflow-hidden shadow-lg"
                        :style="{ backgroundColor: currentPalette.bgSecondary }">
                        <h2 class="text-xl font-semibold p-4 border-b border-gray-700/50">
                            {{ active === 'account' ? 'Account Settings' :
                            active === 'profile' ? 'Profile Settings' :
                            active === 'app' ? 'App Settings' : 'Dangerous Zone' }}
                        </h2>
                        <div class="p-4">
                            <AccountSettingsAccountComponent v-if="active === 'account'" />
                            <AccountSettingsProfileComponent v-if="active === 'profile'" />
                            <AccountSettingsDangerousComponent v-if="active === 'dangerous'" />
                            <AccountSettingsAppComponent v-if="active === 'app'" />
                        </div>
                    </div>
                </div>
            </div>
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

<style scoped>
.settings-container {
    position: relative;
}

.nav-item {
    transition: all 0.2s ease;
}

.nav-item:hover:not(.active) {
    background-color: rgba(75, 85, 99, 0.1);
}

.icon-container {
    transition: all 0.2s ease;
}

.nav-item:hover .icon-container {
    transform: translateY(-2px);
}
</style>