<template>
  <div class="bg-gray-950 min-h-screen text-white">
    <div class="md:flex w-full">
      <div class="md:flex hidden flex-wrap md:w-60 gap-2 justify-center">
        <div v-for="community in communities" :key="community.name">
          <div
            class="w-full flex mr-8 h-fit truncate items-center rounded-xl bg-gray-800"
          >
            <img
              src="https://via.placeholder.com/150"
              alt="profile picture"
              class="rounded-full h-8 w-8 m-2"
            />
            {{ community.name }}
          </div>
        </div>
        <p v-if="communities.length === 0">No Communites yet</p>
      </div>
      <div class="w-full mr-4">
        <div
          class="flex flex-wrap bg-gray-800 md:w-full ml-2 md:ml-1 rounded-xl items-center mr-2 h-fit"
        >
          <img
            :src="profileData.avatarURL"
            alt="profile picture"
            class="rounded-full h-24 w-24 m-5"
          />
          <div class="grid">
            <div class="flex items-center">
              <div>
                <div class="flex gap-2 text-sm mb-2" v-if="badges.length !== 0">
                  <div v-for="badge in badges" :key="badge.name">
                    <div
                      class="flex items-center cursor-default border rounded-full px-2 p-1"
                      :class="
                        'bg-' + badge.color + '-950 border-' + badge.color + '-600'
                      "
                    >
                      {{ badge.name }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <p class="text-xl">
                    <span class="text-gray-400 mr-0.5">@</span
                    >{{ accountData.username }}
                  </p>
                  <div
                    v-if="profileData.verifiedAccount"
                    class="flex justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full"
                  >
                    <i class="fa-solid verifiedBadge fa-check"></i>
                  </div>
                </div>
              </div>
              <RouterLink
                to="/account/settings"
                class="absolute md:visible invisible right-5 bg-gray-700 p-3 rounded-xl"
              >
                Account settings
              </RouterLink>
              <RouterLink
                to="/account/settings"
                class="absolute visible md:invisible right-5 bg-gray-700 p-3 rounded-xl"
              >
                <i class="fa-solid fa-pen"></i>
              </RouterLink>
            </div>
          </div>
          <p class="w-full pl-5 pb-3">Member since {{ sinceString }}</p>
        </div>
        <div
          class="flex flex-wrap mt-2 bg-gray-800 md:w-full ml-2 md:ml-1 rounded-xl items-center mr-2 h-fit"
        >
          <div class="w-full flex justify-center">
            <p class="text-xl mt-2">Posts</p>

          </div>
          <div class="h-36 flex w-full justify-center items-center">
            <p class="italic text-gray-400">No posts yet</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        v-if="communities.length !== 0"
        class="flex md:hidden w-full justify-center text-xl mt-2"
      >
        <p>Communities</p>
      </div>
      <div class="flex md:hidden mt-2 flex-wrap md:w-60 gap-2 justify-center">
        <div v-for="community in communities" :key="community.name">
          <div
            class="w-full flex mr-8 h-fit truncate items-center rounded-xl bg-gray-800"
          >
            <img
              src="https://via.placeholder.com/150"
              alt="profile picture"
              class="rounded-full h-8 w-8 m-2"
            />
            {{ community.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();

const url = "https://api.faser.app/api/account/getOwnProfile";

const accountData = ref({});
const profileData = ref({});

const sinceString = ref("");

const badges = ref([]);

const communities = ref([
  
]);

axios
  .get(url, {
    headers: {
      token: Cookies.get("token"),
    },
  })
  .then((response) => {
    accountData.value = response.data[1];
    profileData.value = response.data[0];

    const accountCreated = new Date(accountData.value.accountCreated);
    const accountCreatedString = accountCreated.toLocaleDateString();
    sinceString.value = accountCreatedString;

    badges.value = response.data[0].badges;
  })
  .catch((error) => {
    if (error.response.data.status === "error") {
      router.push("/login");
    }
  });
</script>

<style>
.verifiedBadge {
  transform: translateY(1px);
}
</style>
