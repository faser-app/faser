<template>
  <div v-if="error"
    class="w-full md:w-[80%] md:ml-[10svw] py-6 rounded-xl bg-red-900 border border-red-500 text-white text-center">
    {{ error }}
  </div>
  <div class="min-h-screen md:flex px-2 bg-black text-white">
    <div class="md:w-1/4 w-full justify-center pt-2 min-h-full">
      <div class="md:hidden w-full block" v-if="loggedIn">
        <PostCreatePostComponent text="Post" mobile="false" :ownProfile="ownAccountData" />
      </div>
    </div>
    <div class="md:w-3/4 w-full max-w-[90rem] bg-gray-900 rounded-xl mt-4 p-2 px-4">
      <div v-if="loggedIn && posts.length > 0">
        <div v-for="(post, index) in posts" key="post">
          <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
            :account="ownAccountData" :ownProfileData="ownProfileData" :border="index !== posts.length - 1" />
        </div>
      </div>
      <div v-else-if="loggedIn && noPosts">
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
            <p class="mb-4">You have to be logged in to view and make posts.</p>
            <RouterLink to="/login" class="py-3 px-5 rounded-xl bg-gray-800">Login</RouterLink>
          </div>
        </div>
      </div>
    </div>
    <div class="md:w-1/4 w-full flex justify-center pr-2 mt-2 min-h-full">
      <div class="w-32 md:block hidden" v-if="loggedIn">
        <PostCreatePostComponent text="Post" mobile="false" :ownProfile="ownAccountData" />
      </div>
    </div>
  </div>
  <div class="blob bg-gradient-to-tr z-1 pointer-events-none from-[#24c7ce] to-[#1ed794]"></div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Cookies from "js-cookie"
import { useRoute } from 'vue-router';

const posts = ref([]);
const loggedIn = ref(false)
const lastTimestamp = ref(Date.now())
const error = ref("")
const route = useRoute()

onMounted(() => {
  loadPosts()
})

const loading = ref(false)
const noPosts = ref(true)
const noMorePosts = ref(false)
const lastRequest = ref(0)

onMounted(() => {
  if (route.query.error) {
    error.value = route.query.error
  }
})

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
        loadPosts: 3,
        lastTimestamp: lastTimestamp.value,
      })
        .then((response) => {
          loading.value = false

          lastTimestamp.value = response.data.lastTimestamp

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
  }
}

const ownProfileData = ref({})
const ownAccountData = ref({})

axios.get("https://api.faser.app/api/account/getOwnProfile", {
  headers: {
    token: Cookies.get("token"),
  },
}).then((ownResponse) => {
  ownProfileData.value = ownResponse.data[0];
  ownAccountData.value = ownResponse.data[1];
  loggedIn.value = true
}).catch((error) => {
  loggedIn.value = false
});
</script>
