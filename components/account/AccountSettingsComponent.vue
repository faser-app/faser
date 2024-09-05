<template>
  <div class="min-h-screen bg-gray-950 text-white px-2">
    <div
      :class="{
        opacityAnimation: true,
        opacityAnimationRun: loaded,
      }"
    >
      <div>
        <h1
          v-if="Date.now() < accountData.accountCreated + 1000 * 60 * 10"
          class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold"
        >
          Welcome to faser, {{ profileData.displayName }}
        </h1>
        <h1
          v-else
          class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold"
        >
          Welcome back, {{ profileData.displayName }}
        </h1>
      </div>
      <div
        v-if="!accountData.emailConfirmed"
        class="w-full bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] p-5 rounded-xl mt-3"
      >
        <p>You havent verified your email yet.</p>
        <RouterLink to="/verify" class="underline">Verify</RouterLink>
      </div>

      <div class="md:flex mt-4">
        <div
          class="flex w-full items-center text-sm p-2 py-4 border border-gray-800 rounded-xl cursor-pointer bg-gray-900 text-gray-50 focus:outline-none"
        >
          <i class="fa-solid fa-image text-2xl mr-2"></i>
          <input
            class="block"
            id="file_input"
            type="file"
            accept="image/*"
            @change="changePicture"
          />
        </div>
        <button
          @click="upload"
          :disabled="buttonDisabled"
          class="md:ml-2 px-4 w-full md:w-auto md:mt-0 mt-2 disabled:text-gray-500 disabled:cursor-default block p-2 text-sm border border-gray-800 rounded-xl cursor-pointer bg-gray-900 text-gray-50 focus:outline-none"
        >
          Upload profile picture
        </button>
      </div>
      <div
        v-if="fileTooBig"
        class="flex bg-[#220000] border border-red-700 rounded-xl w-full justify-center p-2 mt-2"
      >
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
          <div
            class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl"
          >
            <div class="flex flex-wrap justify-center">
              <h1 class="text-xl font-bold">Edit Bio</h1>
              <div class="w-full"></div>
              <textarea
                id="bio"
                class="w-full p-2 rounded-xl bg-gray-800 text-white"
                :class="{
                  'border border-red-500': bioError,
                }"
                rows="5"
                cols="50"
                @input="bioError = ''"
              ></textarea>
              <div class="text-center">
                <button
                  class="p-2 bg-gray-700 mt-1 rounded-xl"
                  @click="saveBio"
                >
                  Save
                </button>
                <p v-if="bioError" class="text-red-500 mt-2">{{ bioError }}</p>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl"
          >
            <div class="flex flex-wrap justify-center">
              <div class="text-center">
                <h1 class="text-xl font-bold">Change display name</h1>
                <div class="w-full"></div>
                <button
                  class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl"
                  @click="changeDisplayName"
                >
                  Change Display Name
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl"
          >
            <div class="flex flex-wrap justify-center">
              <div class="text-center">
                <h1 class="text-xl font-bold">Change username</h1>
                <div class="w-full"></div>
                <p>You can only change your username every 30 days.</p>
                <button
                  class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl"
                  @click="changeUsername"
                >
                  Change Username
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-900 md:w-[calc(50%-0.25rem)] w-full flex justify-center items-center p-5 rounded-xl"
          >
            <div class="flex flex-wrap justify-center">
              <h1 class="text-xl font-bold">Change Password</h1>
              <div class="w-full"></div>
              <button
                class="mt-4 bg-[#220000] p-2 border-red-700 border rounded-xl"
                @click="changePassword"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          class="bg-[#220000] mb-1 border border-red-700 rounded-xl p-3 mt-2"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
    <AccountSubmitModalComponent />
    <AccountChangePasswordModal />
    <AccountChangeUsernameModal />
    <AccountChangeDisplayNameModal />
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

const router = useRouter();

const accountData = ref({});
const profileData = ref({});

const lastLogin = ref("");

const loaded = ref(false);

const buttonDisabled = ref(true);
const fileTooBig = ref(false);

const file = ref(null);

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

<style scoped>
.opacityAnimation {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.opacityAnimationRun {
  opacity: 1;
  transform: translateY(0);
}
</style>
