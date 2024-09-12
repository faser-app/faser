<template>
  <div class="min-h-screen md:flex pl-2 bg-gray-950 text-white">
    <div class="md:w-1/4 w-full justify-center pr-2 pt-2 min-h-full">
      <div class="md:hidden w-full block">
        <PostCreatePostComponent />
      </div>
    </div>
    <div class="md:w-3/4 w-full max-w-[100rem] pt-5 pr-2">
      <div v-if="loggedIn">
        <div v-for="post in posts" key="post">
          <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
            :account="accountData" :ownProfileData="ownProfileData" />
        </div>
      </div>
      <div v-else>
        <div class="w-full min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text">Not logged
              in</h1>
            <p>You have to log in to view posts.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="md:w-1/4 w-full flex justify-center pr-2 mt-2 min-h-full">
      <div class="w-32 md:block hidden">
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


const loggedIn = ref(false)

onMounted(() => {
  loadPosts()
})

let loading = ref(false)

document.addEventListener("scroll", (event) => {
  if (document.body.offsetHeight - 2000 < window.scrollY && !loading.value) {
    loading.value = true

    loadPosts()
  }
})

function loadPosts() {
  if (Cookies.get("token")) {
    axios.post("https://api.faser.app/api/posts/loadPosts", {
      token: Cookies.get("token"),
      loadPosts: 25
    })
      .then((response) => {
        posts.value.push()

        for (let i = 0; i < response.data.posts.length; i++) {
          posts.value.push(response.data.posts[i])
        }

        loading.value = false

        loggedIn.value = true

        console.log(posts.value)
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    loggedIn.value = false
  }
}

const ownProfileData = ref({})

axios.get("https://api.faser.app/api/account/getOwnProfile", {
  headers: {
    token: Cookies.get("token"),
  },
}).then((ownResponse) => {
  ownProfileData.value = ownResponse.data[0];
})
</script>
