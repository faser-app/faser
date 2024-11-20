<template>
  <div>
    <input id="search"
      class="h-full border-0 shadow-none w-full outline-none bg-gray-700 p-3 rounded-xl text-white" :class="{
        'md:w-auto': !props.page
      }"
      v-model="query" @input="searchUsers" placeholder="Search for user" @focus="focus = true" />
  </div>
  <div v-if="query.length > 0 && focus"
    class="top-16 mt-2 rounded-xl border border-gray-500 shadow-lg shadow-gray-900 text-white right-96 bg-gray-700 p-2 overflow-hidden" :class="{
      'md:absolute md:w-64': !props.page
    }">
    <div v-if="users.length !== 0" v-for="user in users" :key="user.username" class="p-2" :class="{
      'border-b border-gray-500': users.indexOf(user) !== users.length - 1,
    }">
      <div class="flex items-center cursor-pointer">
        <div class="flex items-center" @click="openUser('/' + user.username)">
          <img :src="'https://api.faser.app/api/profile/getProfilePhoto?username=' +
            user.username
            " v-if="user.hasProfilePicture" alt="profile picture" class="h-8 w-8 m-2"
            :class="{ 'rounded-full': !user.businessAccount, 'rounded-lg': user.businessAccount }"
            @error="user.hasProfilePicture = false" />
          <div v-else
            class="rounded-full h-8 w-8 m-2 flex border justify-center items-center border-[#96969627] bg-[#1118276c]">
            <i class="fa-solid fa-user rounded-full"></i>
          </div>
          <div class="flex">
            <div class="grid">
              <p class="truncate">{{ user.displayName }}</p>
              <div class="text-gray-400 text-sm">
                <span class="text-gray-400">@{{ user.username }}</span>
              </div>
            </div>
            <div v-if="user.businessAccount" class="ml-1">
              <div
                class="flex mt-1 justify-center text-xs items-center bg-yellow-600 border w-5 h-5 border-yellow-300 rounded-full">
                <i class="fa-solid text-[10px] verifiedBadge fa-check"></i>
              </div>
            </div>
            <div v-else-if="user.verifiedAccount" class="ml-1">
              <div
                class="flex mt-1 justify-center text-xs items-center bg-sky-600 border w-5 h-5 border-sky-300 rounded-full">
                <i class="fa-solid text-[10px] verifiedBadge fa-check"></i>
              </div>
            </div>
            <div v-if="user.privateAccount" class="ml-2">
              <i class="fa-solid text-gray-300 fa-lock"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No users found</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const query = ref("");
const users = ref([]);
const loaded = ref(false);
const focus = ref(false);

const url = "https://api.faser.app/api/profile/searchProfiles";

const props = defineProps([
  'page'
])

function openUser(username) {
  query.value = ""
  focus.value = false;
  router.push(username);
}

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

        users.value = sortByLetterPriority(userData, query.value.toLowerCase());
        loaded.value = true;
      });
  }
}

function sortByLetterPriority(arr, letter) {
  return arr.sort((a, b) => {
    const aStartsWith = a.username.toLowerCase().startsWith(letter);
    const bStartsWith = b.username.toLowerCase().startsWith(letter);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    return a.username.localeCompare(b.username);
  });
}
</script>

<style scoped></style>
