<template>
  <div class="min-h-screen bg-gray-950 text-white px-2">
    <div>
      <div>
        <h1 v-if="Date.now() < accountData.accountCreated + 1000 * 60 * 10"
          class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold">
          Welcome to faser, {{ profileData.displayName }}
        </h1>
        <h1 v-else
          class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold">
          Welcome back, {{ profileData.displayName }}
        </h1>
      </div>
      <div v-if="!accountData.emailConfirmed"
        class="w-full bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] p-5 rounded-xl mt-3">
        <p>You havent verified your email yet.</p>
        <RouterLink to="/verify" class="underline">Verify</RouterLink>
      </div>

      <div class="md:flex mt-4">
        <div
          class="flex w-full items-center text-sm p-2 py-4 border border-gray-800 rounded-xl cursor-pointer bg-gray-900 text-gray-50 focus:outline-none">
          <i class="fa-solid fa-image text-2xl mr-2"></i>
          <input class="block" id="file_input" type="file" accept="image/*" @change="changePicture" />
        </div>
        <button @click="upload" :disabled="buttonDisabled"
          class="md:ml-2 px-4 w-full md:w-auto md:mt-0 mt-2 disabled:text-gray-500 disabled:cursor-default block p-2 text-sm border border-gray-800 rounded-xl cursor-pointer bg-gray-900 text-gray-50 focus:outline-none">
          Upload profile picture
        </button>
      </div>
      <div v-if="fileTooBig" class="flex bg-[#220000] border border-red-700 rounded-xl w-full justify-center p-2 mt-2">
        <p>File is too big</p>
      </div>
      <div class="grid grid-cols-2 w-full">
        <span class="text-gray-500 text-sm ml-0.5">Max. 2MB</span>
        <button @click="removeImage" class="place-self-end text-gray-400">
          Remove image
        </button>
      </div>
      <div>
        <div class="flex flex-wrap gap-2 w-full justify-center">
          <div class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl">
            <div class="flex flex-wrap justify-center">
              <h1 class="text-xl font-bold">Edit Bio</h1>
              <div class="w-full"></div>
              <textarea id="bio" class="w-full p-2 rounded-xl bg-gray-800 text-white" :class="{
                'border border-red-500': bioError,
              }" rows="5" cols="50" @input="bioError = ''"></textarea>
              <div class="text-center">
                <button class="p-2 bg-gray-700 mt-1 rounded-xl" @click="saveBio">
                  Save
                </button>
                <p v-if="bioError" class="text-red-500 mt-2">{{ bioError }}</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl">
            <div class="flex flex-wrap justify-center">
              <div class="text-center">
                <h1 class="text-xl font-bold">Profile Song</h1>
                <div v-if="haveMusic" class="w-full flex gap-3 text-gray-300" @click="musicModal = true">
                  <div class="flex items-center cursor-pointer p-3 m-2 ml-6 rounded-xl gap-3"
                    :style="'background-color: ' + color">
                    <i class="fa-solid fa-music"></i>
                    <div class="flex items-center">
                      <img :src="profileData.music.songImage" alt="song cover"
                        class="h-10 w-10 items-center mt-1 rounded-full mr-1" />
                      <p>{{ profileData.music.songName }} - </p>
                      <div v-for="(author, index) in profileData.music.songAuthor" :key="author.name">
                        <p v-if="index === 0">{{ author.name }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <button @click="musicModal = true" class="mt-3 bg-gray-600 p-3 rounded-xl border-gray-400 border">Set
                    profile Song</button>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl">
            <div class="flex flex-wrap justify-center">
              <div class="text-center">
                <h1 class="text-xl font-bold">Change display name</h1>
                <div class="w-full"></div>
                <button class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl" @click="changeDisplayName">
                  Change Display Name
                </button>
              </div>
            </div>
          </div>
          <div class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl">
            <div class="flex flex-wrap justify-center">
              <div class="text-center">
                <h1 class="text-xl font-bold">Change username</h1>
                <div class="w-full"></div>
                <p>You can only change your username every 30 days.</p>
                <button class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl" @click="changeUsername">
                  Change Username
                </button>
              </div>
            </div>
          </div>
          <div class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl">
            <div class="flex flex-wrap justify-center">
              <h1 class="text-xl font-bold">Change Password</h1>
              <div class="w-full"></div>
              <button class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl" @click="changePassword">
                Change Password
              </button>
            </div>
          </div>
          <div class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl">
            <div class="flex flex-wrap justify-center">
              <h1 class="text-xl font-bold">Delete Account</h1>
              <div class="w-full"></div>
              <button class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl" @click="deleteAccountModal = true">
                Delete Account
              </button>
            </div>
          </div>
          <div class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl">
            <div class="flex flex-wrap justify-center">
              <h1 class="text-xl font-bold">Birth Date</h1>
              <div class="w-full"></div>

              <div class="w-full flex justify-center">
                <p v-if="accountData.birthday" class="mt-4">Your birthday is: {{ formatBirthday(accountData.birthday) }}
                </p>
              </div>

              <button v-if="!accountData.birthday" class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl"
                @click="birthModal = true">
                Add Birth Date
              </button>
              <button v-else class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl" @click="birthModal = true">
                Change Birth Date
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button class="bg-[#220000] mb-1 border border-red-700 rounded-xl p-3 mt-2" @click="logout">
          Logout
        </button>
      </div>
    </div>
    <AccountSubmitModalComponent />
    <AccountChangePasswordModal />
    <AccountChangeUsernameModal />
    <AccountChangeDisplayNameModal />
    <DeleteAccountModal :showModal="deleteAccountModal" @close="deleteAccountModal = false" />
    <AccountChangeSongModal :showModal="musicModal" @close="musicModal = false" />
    <AccountChangeBirthdayModal :showModal="birthModal" @close="birthModal = false" @success="changeBirthday" />
  </div>
</template>
<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";
import { DateTime } from "luxon";
import { changeModal } from "~/scripts/account/deletePhoto";
import { changePasswordModal } from "~/scripts/account/changePassword";
import { changeUsernameModal } from "~/scripts/account/changeUsername";
import { changeDisplayNameModal } from "~/scripts/account/changeDisplayName";
import DeleteAccountModal from "./DeleteAccountModal.vue";
import { FastAverageColor } from 'fast-average-color';

const router = useRouter();
const accountData = ref({});
const profileData = ref({});
const lastLogin = ref("");
const loaded = ref(false);
const deleteAccountModal = ref(false)
const buttonDisabled = ref(true);
const fileTooBig = ref(false);
const file = ref(null);
const color = ref("")
const musicModal = ref(false);
const haveMusic = ref(false);
const birthModal = ref(false);

function logout() {
  Cookies.remove("token");
  router.push("/login");
}

function removeImage() {
  changeModal(true);
}

function changePassword() {
  changePasswordModal(true);
}

function changeUsername() {
  changeUsernameModal(true);
}

function changeDisplayName() {
  changeDisplayNameModal(true);
}

function changePicture(event) {
  if (event.target.files[0].size / 1024 / 1024 >= 2) {
    fileTooBig.value = true;
    buttonDisabled.value = true;
    return;
  } else {
    fileTooBig.value = false;
    buttonDisabled.value = false;
    file.value = event.target.files[0];
  }
}

const bioError = ref("");

function saveBio() {
  const bio = document.getElementById("bio").value;

  axios
    .post("https://api.faser.app/api/profile/changeBio", {
      token: Cookies.get("token"),
      bio: bio,
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      router.push("/profile");
    })
    .catch((error) => {
      bioError.value = error.response.data.message;
    });
}

function changeBirthday(data) {
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

function formatBirthday() {
  return DateTime.fromISO(accountData.value.birthday).toLocaleString(DateTime.DATE_FULL);
}

onMounted(() => {
  const url = "https://api.faser.app/api/account/getOwnProfile";

  axios
    .get(url, {
      headers: {
        token: Cookies.get("token"),
      },
    })
    .then((response) => {
      accountData.value = response.data[1];
      profileData.value = response.data[0];

      loaded.value = true;

      document.querySelector("textarea").value = profileData.value.bio;

      const fac = new FastAverageColor();
      fac.getColorAsync(profileData.value.music.songImage, { algorithm: 'sqrt' }).then(avgColor => {
        console.log(color.rgb)
        color.value = avgColor.rgb
      });

      if (profileData.value.music.songName) {
        haveMusic.value = true;
      }

      lastLogin.value = DateTime.fromMillis(
        accountData.value.lastLogin
      ).toLocaleString(DateTime.DATETIME_FULL);
    })
    .catch((error) => {
      if (error.response.data.status === "error") {
        router.push("/login");
      }
    });
});
</script>
