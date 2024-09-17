<template>
  <div class="min-h-screen md:flex pl-2 bg-gray-950 text-white">
    <div class="md:w-1/4 w-full justify-center pr-2 pt-2 min-h-full">
      <div class="md:hidden w-full block">
        <PostCreatePostComponent />
      </div>
    </div>
    <div class="md:w-3/4 w-full max-w-[100rem] pt-5 pr-2">
      <div v-if="loggedIn && posts.length > 0">
        <div v-for="post in posts" key="post">
          <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
            :account="accountData" :ownProfileData="ownProfileData" />
        </div>
      </div>
      <div v-else-if="noPosts">
        <div class="w-full min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text">No posts
              available</h1>
            <p>There are no posts to be shown. Follow more people to see posts.</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="w-full min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text">
              Not logged
              in</h1>
            <p>You have to be logged in to view posts.</p>
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

const lastTimestamp = ref(Date.now())

onMounted(() => {
  loadPosts()
})

const loading = ref(false)
const noPosts = ref(true)

const noMorePosts = ref(false)

const lastRequest = ref(0)


document.addEventListener("scroll", (event) => {
  if (document.body.offsetHeight - 2000 < window.scrollY && !loading.value) {
    if (lastRequest.value + 1000 < Date.now()) {
      lastRequest.value = Date.now()

      loading.value = true

      loadPosts()
    }
  }
})

function loadPosts() {
  if (Cookies.get("token")) {
    if (!noMorePosts.value) {
      loading.value = true
      axios.post("https://api.faser.app/api/posts/loadPosts", {
        token: Cookies.get("token"),
        loadPosts: 25,
        lastTimestamp: lastTimestamp.value
      })
        .then((response) => {

          loggedIn.value = true
          loading.value = false

          if (response.data.message === "no posts available") {
            noMorePosts.value = true
            noPosts.value = true
            return
          }

          for (let i = 0; i < response.data.posts.length; i++) {
            if (!posts.value.includes(response.data.posts[i])) {
              posts.value.push(response.data.posts[i])
            }
          }
        })
        .catch((error) => {
          noPosts.value = true
          loading.value = false

          console.error(error.response.data.message);
        });
    }
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
