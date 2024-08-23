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
      <div class="grid mt-5 gap-2">
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
            <p>ID</p>
            <p>{{ profileData.id }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p>Beta Access</p>
            <p>{{ profileData.betaAccess }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p>Verified</p>
            <p>{{ profileData.verifiedAccount }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p>email</p>
            <p>{{ accountData.email }}</p>
          </div>
        </div>
        <div class="bg-gray-900 mt-2 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p>Terminated</p>
            <p>{{ accountData.terminated }}</p>
          </div>
        </div>
        <div class="bg-gray-900 p-5 rounded-xl">
          <div class="grid grid-cols-2">
            <p>Last login</p>
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

function logout() {
  Cookies.remove("token");
  router.push("/login");
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
