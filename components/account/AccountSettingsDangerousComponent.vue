<template>
    <div>
        <div class="w-full">
            <div class="w-full bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="deleteAccountModal = true">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-trash"></i>
                    <p>Delete Account</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
            <div class="w-full bg-gray-800 mt-0.5 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="logout">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <p>Logout</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
        </div>
    </div>

    <AccountDeleteAccountModal :showModal="deleteAccountModal" @close="deleteAccountModal = false" />
    <ChangePasswordModal />
</template>

<script setup>
import Cookies from "js-cookie";

const deleteAccountModal = ref(false);

function logout() {
    Cookies.remove("token");
    window.location.href = "/";
}

</script>