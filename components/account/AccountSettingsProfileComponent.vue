<template>
    <div>
        <div class="w-full">
            <div class="w-full bg-gray-800 flex flex-col">
                <div class="w-full px-2">
                    <div
                        class="flex w-full items-center text-sm p-2 py-4 rounded-xl cursor-pointer text-gray-50 focus:outline-none">
                        <i class="fa-solid fa-image text-2xl mr-2"></i>
                        <input class="block" id="file_input" type="file" accept="image/*" @change="changePicture" />
                    </div>
                    <button @click="upload" :disabled="buttonDisabled"
                        class="px-4 w-full mt-0 disabled:text-gray-500 disabled:cursor-default block p-2 text-sm border border-gray-800 rounded-xl cursor-pointer bg-gray-900 text-gray-50 focus:outline-none">
                        Upload profile picture
                    </button>
                </div>
                <div class="flex justify-end w-full">
                    <button @click="removeImage" class="place-self-end text-gray-400">
                        Remove image
                    </button>
                </div>
            </div>
            <div class="w-full mt-0.5 bg-gray-800 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="changeDisplayName">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-id-card"></i>
                    <p>Change Display Name</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
            <div class="w-full bg-gray-800 mt-0.5 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="bioModal = true">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-file-lines"></i>
                    <p>Change Bio</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
            <div class="w-full bg-gray-800 mt-0.5 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="musicModal = true">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-music"></i>
                    <p>Change Song</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
            <div class="w-full bg-gray-800 mt-0.5 flex justify-between items-center p-2 gap-2 py-4 cursor-pointer"
                @click="birthModal = true">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-key"></i>
                    <p>Change Birth</p>
                </div>
                <div>
                    <i class="fa-solid fa-chevron-up rotate-90 mr-2"></i>
                </div>
            </div>
            
        </div>
    </div>

    <ChangeDisplayNameModal />
    <AccountChangeBirthdayModal :showModal="birthModal" @close="birthModal = false" @success="changeBirthday" />
    <AccountChangeBioModal :showModal="bioModal" @close="bioModal = false" @success="updateBio" />
    <AccountChangeSongModal :showModal="musicModal" @close="musicModal = false" @success="updateSong" />
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

import { changeDisplayNameModal } from "~/scripts/account/changeDisplayName";
import ChangeDisplayNameModal from "./ChangeDisplayNameModal.vue";

let birthModal = ref(false);
const bioModal = ref(false)
const musicModal = ref(false)
let buttonDisabled = ref(false);
let file = ref(null);
let fileTooBig = ref(false);

const router = useRouter();

function changeDisplayName() {
    changeDisplayNameModal(true);
}

function changePicture(event) {
    fileTooBig.value = false;
    buttonDisabled.value = false;
    file.value = event.target.files[0];
}

function changeBirthday(data) {
    birthModal.value = false;

    accountData.value.birthday = data.birthday;
}

function updateSong(data) {
    birthModal.value = false;

    accountData.value.birthday = data.birthday;
}

function upload() {
    const formData = new FormData();
    formData.append("file", file.value);

    buttonDisabled.value = true;

    axios
        .post("https://api.faser.app/api/profile/changeProfilePhoto", formData, {
            headers: {
                token: Cookies.get("token"),
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            router.push("/profile");
        });
}

</script>