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

      <div class="flex mt-4">
        <div class="flex w-full items-center text-sm p-2 py-4 border border-gray-800 rounded-xl cursor-pointer bg-gray-900 text-gray-50 focus:outline-none">
          <i class="fa-solid fa-image text-2xl mr-2"></i>
          <input
            class="block "
            id="file_input"
            type="file"
            accept="image/*"
            @change="changePicture"
          />
        </div>
        <button
          @click="upload"
          :disabled="buttonDisabled"
          class="ml-2 px-4 disabled:text-gray-500 disabled:cursor-default block p-2 text-sm border border-gray-800 rounded-xl cursor-pointer bg-gray-900 text-gray-50 focus:outline-none"
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
        <button
          @click="removeImage"
          v-if="profileData.avatarURL"
          class="place-self-end text-gray-400"
        >
          Remove image
        </button>
      </div>

      <div class="grid mt-2 gap-2">
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p>Display Name</p>
            <p>{{ profileData.displayName }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p>Account Name</p>
            <p>{{ accountData.username }}</p>
          </div>
        </div>
        <div class="bg-gray-900 mt-2 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p><i class="fa-solid fa-id-card"></i> ID</p>
            <p>{{ profileData.id }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p><i class="fa-solid fa-user-check"></i> Beta Access</p>
            <p>{{ profileData.betaAccess }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p><i class="fa-solid fa-check"></i> Verified</p>
            <p>{{ profileData.verifiedAccount }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p><i class="fa-solid fa-address-card"></i> email</p>
            <p>{{ accountData.email }}</p>
          </div>
        </div>
        <div class="bg-gray-900 mt-2 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p><i class="fa-solid fa-user-xmark"></i> Terminated</p>
            <p>{{ accountData.terminated }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p><i class="fa-solid fa-calendar-days"></i> Last login</p>
            <p>{{ lastLogin }}</p>
          </div>
        </div>
      </div>
      <div>
        <button
          class="bg-[#220000] border border-red-700 rounded-xl p-3 mt-2"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";
import { DateTime } from "luxon";

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
  axios
    .post("https://api.faser.app/api/profile/changeProfilePhoto", {
      token: Cookies.get("token"),
      photo: "",
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      router.push("/");
    });
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

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

function upload() {
  toBase64(file.value).then((data) => {
    axios
      .post("https://api.faser.app/api/profile/changeProfilePhoto", {
        token: Cookies.get("token"),
        photo: data,
        lang: navigator.language || navigator.userLanguage,
      })
      .then((response) => {
        router.push("/");
      });
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
