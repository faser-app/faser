<template>
    <div>
        <div class="w-full space-y-3">
            <!-- Profile Picture Section -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="p-4">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-image text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Profile Picture</p>
                            <p class="text-gray-400 text-sm">Upload a new profile image</p>
                        </div>
                    </div>

                    <div class="mt-3">
                        <label class="block mb-2">
                            <input
                                class="block w-full text-sm text-gray-400 rounded-md cursor-pointer bg-gray-700 border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700"
                                id="file_input" type="file" accept="image/*" @change="changePicture" />
                        </label>

                        <div class="flex gap-2">
                            <button @click="upload" :disabled="buttonDisabled"
                                class="px-4 py-2 rounded-md text-center w-full transition-colors duration-200" :style="{ 
                                    backgroundColor: buttonDisabled ? currentPalette.bgSecondary : currentPalette.buttonPrimary,
                                    color: buttonDisabled ? 'gray' : currentPalette.textSecondary,
                                    opacity: buttonDisabled ? 0.7 : 1
                                }">
                                Upload profile picture
                            </button>

                            <button @click="removeImage"
                                class="px-4 py-2 rounded-md text-center border border-gray-600 text-gray-400 hover:bg-gray-700 transition-colors duration-200">
                                Remove image
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Change Display Name -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    @click="changeDisplayName">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-id-card text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Display Name</p>
                            <p class="text-gray-400 text-sm">Change how your name appears</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Change Bio -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    @click="bioModal = true">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-file-lines text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Bio</p>
                            <p class="text-gray-400 text-sm">Edit your profile description</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Change Song -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    @click="musicModal = true">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-music text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Profile Song</p>
                            <p class="text-gray-400 text-sm">Choose a song for your profile</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>

            <!-- Change Birth -->
            <div class="setting-item rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    @click="birthModal = true">
                    <div class="flex items-center gap-3">
                        <div class="icon-container rounded-full w-10 h-10 flex items-center justify-center"
                            :style="{ backgroundColor: currentPalette.buttonPrimary }">
                            <i class="fa-solid fa-cake-candles text-lg"></i>
                        </div>
                        <div>
                            <p class="font-medium">Birthday</p>
                            <p class="text-gray-400 text-sm">Update your birth date</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-solid fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ChangeDisplayNameModal />
    <AccountChangeBirthdayModal :showModal="birthModal" @close="birthModal = false" @success="changeBirthday" />
    <AccountChangeBioModal :showModal="bioModal" @close="bioModal = false" @success="updateBio" />
    <AccountChangeSongModal :showModal="musicModal" :profile-selector="true" @close="musicModal = false"
        @success="updateSong" />
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { changeDisplayNameModal } from "~/scripts/account/changeDisplayName";
import ChangeDisplayNameModal from "./ChangeDisplayNameModal.vue";
import currentPalette from "~/vars/getColors";

let birthModal = ref(false);
const bioModal = ref(false);
const musicModal = ref(false);
let buttonDisabled = ref(false);
let file = ref(null);
let fileTooBig = ref(false);
const runtimeConfig = useRuntimeConfig();
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

function updateBio(data) {
    // Update bio logic
}

function upload() {
    const formData = new FormData();
    formData.append("file", file.value);
    buttonDisabled.value = true;
    axios
        .post(baseURL + "/api/profile/changeProfilePhoto", formData, {
            headers: {
                token: Cookies.get("token"),
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            router.push("/profile");
        });
}

function removeImage() {
    axios.post(baseURL + "/api/profile/removeProfilePhoto", {
        token: Cookies.get("token")
    })
        .then((response) => {
            router.push("/profile");
        });
}
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
</style>