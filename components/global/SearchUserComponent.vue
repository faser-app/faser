<template>
  <div>
    <input
      class="h-full md:w-auto w-full bg-gray-700 p-3 rounded-xl text-white"
      v-model="query"
      @input="searchUsers"
      placeholder="Search for user"
      @focus="focus = true"
    />
  </div>
  <div
    v-if="query.length > 0 && focus"
    class="md:absolute top-16 rounded-xl border border-gray-500 shadow-lg shadow-gray-900 text-white right-32 bg-gray-700 md:w-64 p-2"
  >
    <div
      v-if="users.length !== 0"
      v-for="user in users"
      :key="user.username"
      class="p-2"
      :class="{ 'border-b border-gray-500': users.indexOf(user) !== users.length - 1 }"
    >
      <div class="flex items-center">
        <RouterLink :to="'/' + user.username" class="flex items-center">
          <img
            :src="
              'https://api.faser.app/api/profile/getProfilePhoto?username=' +
              user.username
            "
            v-if="user.hasProfilePicture"
            alt="profile picture"
            class="rounded-full h-8 w-8 m-2"
            @error="user.hasProfilePicture = false"
          />
          <div
            v-else
            class="rounded-full h-8 w-8 m-2 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
          >
            <i class="fa-solid fa-user rounded-full"></i>
          </div>
          <div class="flex">
            <div class="grid">
              <p>{{ user.displayName }}</p>
              <div class="text-gray-400 text-sm">
                <span class="text-gray-400">@{{ user.username }}</span>
              </div>
            </div>
            <div v-if="user.verifiedAccount" class="ml-2">
              <div
                class="flex mt-1 justify-center text-xs items-center bg-sky-600 border w-5 h-5 border-sky-300 rounded-full"
              >
                <i class="fa-solid text-[10px] verifiedBadge fa-check"></i>
              </div>
            </div>
            <div v-if="user.privateAccount" class="ml-2">
              <i class="fa-solid text-gray-300 fa-lock"></i>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
    <div v-else>
      <p>No users found</p>
    </div>
  </div>
</template>
<script setup>
import axios from "axios";

const query = ref("");

const users = ref([]);

const loaded = ref(false);

const focus = ref(false);

const url = "https://api.faser.app/api/profile/searchProfiles";

function searchUsers() {
  loaded.value = false;
  if (query.value.length > 0) {
    axios
      .post(url, {
        query: query.value,
        lang: navigator.language || navigator.userLanguage,
      })
      .then((response) => {
        let userData = response.data;

        for (let i = 0; i < userData.length; i++) {
          if (userData[i].hasProfilePicture === 0) {
            userData[i].hasProfilePicture = false;
          } else {
            userData[i].hasProfilePicture = true;
          }
        }

        users.value = userData;
        loaded.value = true;
      });
  }
}
</script>

<style scoped>
</style>
