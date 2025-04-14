<template>
    <div>
        <div class="w-full space-y-3">
            <!-- Change Username -->
            <div
                class="setting-item rounded-lg overflow-hidden"
                :style="{ backgroundColor: currentPalette.bg }"
            >
                <div
                    class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    @click="changeUsername"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{
                                backgroundColor: currentPalette.buttonPrimary,
                            }"
                        >
                            <i class="fa-solid fa-id-card text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Change Username</p>
                            <p class="text-gray-400 text-sm">
                                Update your @username
                            </p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Change Password -->
            <div
                class="setting-item rounded-lg overflow-hidden"
                :style="{ backgroundColor: currentPalette.bg }"
            >
                <div
                    class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    @click="changePassword"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{
                                backgroundColor: currentPalette.buttonPrimary,
                            }"
                        >
                            <i class="fa-solid fa-key text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Change Password</p>
                            <p class="text-gray-400 text-sm">
                                Update your account password
                            </p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Download Data -->
            <div
                class="setting-item rounded-lg overflow-hidden"
                :style="{ backgroundColor: currentPalette.bg }"
            >
                <div
                    class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    @click="downloadData"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{
                                backgroundColor: currentPalette.buttonPrimary,
                            }"
                        >
                            <i class="fa-solid fa-download text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Download Data</p>
                            <p class="text-gray-400 text-sm">
                                Download your Data saved on Faser
                            </p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ChangeUsernameModal />
    <DownloadDataModal
        :show-modal="showDownloadModal"
        @close="showDownloadModal = false"
    />
    <ChangePasswordModal />
</template>

<script setup>
import { changeUsernameModal } from '~/scripts/account/changeUsername'
import { changePasswordModal } from '~/scripts/account/changePassword'
import ChangeUsernameModal from './ChangeUsernameModal.vue'
import ChangePasswordModal from './ChangePasswordModal.vue'
import DownloadDataModal from './DownloadDataModal.vue'
import currentPalette from '~/vars/getColors'

const showDownloadModal = ref(false)

function changeUsername() {
    changeUsernameModal(true)
}
function changePassword() {
    changePasswordModal(true)
}

function downloadData() {
    showDownloadModal.value = true
}
</script>

<style scoped>
.setting-item {
    transition: all 0.2s ease;
    border: 1px solid rgba(75, 85, 99, 0.2);
}

.setting-item:hover {
    transform: translateY(-1px);
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.icon-container {
    transition: all 0.2s ease;
}

.setting-item:hover .icon-container {
    transform: scale(1.05);
}
</style>
