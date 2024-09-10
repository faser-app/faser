<template>
  <div class="min-h-screen flex pl-2 bg-gray-950 text-white">
    <div class="w-3/4 pt-5">
      <div>
        <div v-for="post in posts">
          <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
            :account="accountData" :ownProfileData="ownProfileData" />
        </div>
      </div>
    </div>
    <div class="w-1/4 flex justify-center pr-2 mt-2 min-h-full">
      <div class="w-32">
        <PostCreatePostComponent />
      </div>
    </div>
  </div>
  <div class="blob bg-gradient-to-tr z-1 pointer-events-none from-[#24c7ce] to-[#1ed794]"></div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Cookies from "js-cookie"

const posts = ref([]);

axios.post("https://api.faser.app/api/posts/getPosts")
  .then((response) => {
    posts.value = response.data;
  })
  .catch((error) => {
    console.error(error);
  });

const ownProfileData = ref({})

axios.get("https://api.faser.app/api/account/getOwnProfile", {
  headers: {
    token: Cookies.get("token"),
  },
}).then((ownResponse) => {
  ownProfileData.value = ownResponse.data[0];
})
</script>
