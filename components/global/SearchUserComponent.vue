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
    class="md:absolute top-16 rounded-xl text-white right-32 bg-gray-700 md:w-64 p-2"
  >
    <div v-for="user in users" :key="user.username" class="p-2">
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
          <p>{{ user.username }}</p>
        </RouterLink>
      </div>
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
