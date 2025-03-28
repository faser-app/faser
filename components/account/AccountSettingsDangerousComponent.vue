<template>
    <div>
        <div class="w-full space-y-3">
            <!-- Delete Account -->
            <div class="setting-item rounded-lg overflow-hidden border border-red-500/30"
                :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4 cursor-pointer hover:bg-red-500/10 transition-colors"
                    @click="deleteAccountModal = true">
                    <div class="flex items-center gap-3">
                        <div
                            class="icon-container rounded-full w-10 h-10 flex items-center justify-center bg-red-600/80">
                            <i class="fa-solid fa-trash text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium text-red-400">Delete Account</p>
                            <p class="text-gray-400 text-sm">Permanently delete your account and all data</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-red-400"></i>
                    </div>
                </div>
            </div>

            <!-- Warning Notice -->
            <div class="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                <div class="flex items-start gap-3">
                    <div class="mt-1">
                        <i class="fa-solid fa-triangle-exclamation text-red-500"></i>
                    </div>
                    <div>
                        <p class="text-red-400 font-medium">Warning</p>
                        <p class="text-gray-300 text-sm mt-1">Actions in this section are permanent and cannot be
                            undone. Please proceed with caution.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AccountDeleteAccountModal :showModal="deleteAccountModal" @close="deleteAccountModal = false" />
</template>

<script setup>
import Cookies from "js-cookie";
import currentPalette from "~/vars/getColors";
const deleteAccountModal = ref(false);
</script>

<style scoped>
.setting-item {
    transition: all 0.2s ease;
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
</style>