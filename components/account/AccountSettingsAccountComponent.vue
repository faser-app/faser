<template>
    <div>
        <div class="w-full">
            <div class="w-full bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="changeUsername">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-id-card"></i>
                    <p>Change Username</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
            <div class="w-full bg-gray-800 mt-0.5 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="changePassword">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-key"></i>
                    <p>Change Password</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
        </div>
    </div>

    <ChangeUsernameModal />
    <ChangePasswordModal />
</template>

<script setup>
import { changeUsernameModal } from "~/scripts/account/changeUsername";
import { changePasswordModal } from "~/scripts/account/changePassword";

import ChangeUsernameModal from "./ChangeUsernameModal.vue";
import ChangePasswordModal from "./ChangePasswordModal.vue";

function changeUsername() {
    changeUsernameModal(true);
}

function changePassword() {
    changePasswordModal(true);
}

</script>