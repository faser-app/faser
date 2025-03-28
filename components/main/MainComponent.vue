<template>
  <div v-if="error"
    class="w-full md:w-[80%] md:ml-[10svw] py-6 rounded-md bg-red-900 border border-red-500 text-white text-center">
    {{ error }}
  </div>
  <div class="min-h-[calc(100vh-4.5rem)] md:flex px-2 text-white" :style="{ backgroundColor: currentPalette.bg }">
    <div class="w-full rounded-md md:px-4"
    :style="{ backgroundColor: currentPalette.bgSecondary }">
      <div v-if="loggedIn" class="mb-4">
        <!-- Twitter-style compact create post component that expands when focused -->
        <PostCompactCreatePostComponent :ownProfile="ownAccountData" @post-created="refreshPosts" />
      </div>

      <div v-if="loggedIn && posts.length > 0">
        <div v-for="(post, index) in posts" key="post">
          <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
            :account="ownAccountData" :ownProfileData="ownProfileData" :border="index !== posts.length - 1" />
        </div>
      </div>
      <div v-else-if="loggedIn && !loaded">
        <div v-for="i in 10">
          <PostFakePostComponent />
        </div>
      </div>
      <div v-else-if="loggedIn && noPosts && loaded">
        <div class="w-full min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-transparent bg-linear-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text">
              No posts available</h1>
            <p class="mb-4">You have to follow some people to see posts on your home page</p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="w-full min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-transparent bg-linear-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text">
              Not logged
              in</h1>
            <p class="mb-4">You have to be logged in to view and make posts.</p>
            <RouterLink to="/login" class="py-3 px-5 rounded-md bg-gray-800">Login</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="blob bg-linear-to-tr z-1 pointer-events-none from-[#24c7ce] to-[#1ed794]"></div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Cookies from "js-cookie"
import { useRoute } from 'vue-router';
import currentPalette from '~/vars/getColors';

const posts = ref([]);
const loggedIn = ref(true)
const lastTimestamp = ref(Date.now())
const error = ref("")
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const loaded = ref(false)


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
  if (document.body.offsetHeight - 8000 < window.scrollY && !loading.value) {
    if (lastRequest.value + 1000 < Date.now()) {
      lastRequest.value = Date.now()
      loading.value = true
      loadPosts()
    }
  }
})

function refreshPosts() {
  // Reset state and reload posts
  posts.value = [];
  lastTimestamp.value = Date.now();
  noMorePosts.value = false;
  noPosts.value = true;
  loadPosts();
}

function loadPosts() {
  if (Cookies.get("token")) {
    if (!noMorePosts.value) {
      loading.value = true
      axios.post(baseURL + "/api/posts/loadPosts", {
        token: Cookies.get("token"),
        loadPosts: 25,
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

          loaded.value = true
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

axios.get(baseURL + "/api/account/getOwnProfile", {
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
