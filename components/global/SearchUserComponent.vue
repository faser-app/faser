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
    class="md:absolute top-16 rounded-xl text-white right-60 bg-gray-700 md:w-32 p-2"
  >
    <div v-if="loaded" v-for="user in users" :key="user.username" class="p-2">
      <div class="flex items-center">
        <RouterLink :to="'/' + user.username" class="flex items-center">
          <img
            v-if="user.avatarURL"
            :src="user.avatarURL"
            alt="profile picture"
            class="rounded-full h-8 w-8 m-2"
          />
          <div
            v-else
            class="rounded-full h-8 w-8 m-2 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
          >
            <i v-if="!user.avatarURL" class="fa-solid fa-user rounded-full"></i>
          </div>
          <p>{{ user.username }}</p>
        </RouterLink>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
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
        users.value = response.data;
        loaded.value = true;
      });
  }
}
</script>
