<template>
  <div v-if="!mobile" class="bg-[#0206176c] h-[4.5rem] flex fixed backdrop-blur text-white w-full z-100">
    <RouterLink to="/">
      <div class="flex h-full w-full justify-center md:justify-start fixed pointer-events-none">
        <img src="/assets/img/icon/logo.png" alt="Logo"
          class="h-14 ml-2 my-2 rounded-full cursor-pointer border border-[#96969627] bg-[#1118276c] absolute pointer-events-auto" />
      </div>
    </RouterLink>
    <div @click="expanded = !expanded">
      <div class="flex h-full w-14 justify-center items-center cursor-pointer md:hidden">
        <i class="fa-solid fa-bars text-2xl"></i>
      </div>
    </div>
    <div class="flex h-full top-10 self-center justify-end flex-1 w-full mr-4">
      <div class="hidden opacity-0 self-center items-center sm:opacity-100 gap-5 mr-5 md:flex">
        <SearchUserComponent />
        <div v-for="link in links" :key="link.name" class="cursor-pointer">
          <RouterLink :to="link.href" class="text-white hover:scale">{{
            link.name
            }}</RouterLink>
        </div>
      </div>
      <div class="h-full flex items-center">
        <div class="flex items-center justify-center bg-gray-800 w-12 h-12 rounded-full cursor-pointer"
          @click="openUserMessages">
          <i class="fa-solid fa-bell text-xl"></i>
          <div v-if="messages.length > 0"
            class="absolute mt-8 ml-8 h-6 w-6 text-sm flex items-center justify-center bg-red-700 rounded-full">
            <div v-if="messages.length > 100">
              99+
            </div>
            <div v-else>
              {{ messages.length }}
            </div>
          </div>
        </div>
        <RouterLink to="/profile" class="ml-4">
          <div
            class="border w-12 h-12 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer">
            <i v-if="!haveProfilePicture" class="fa-solid fa-user rounded-full text-3xl"></i>
            <img v-else-if="haveProfilePicture && loaded" :src="'https://api.faser.app/api/profile/getProfilePhoto?username=' +
              username
              " class="rounded-full w-12 h-12 object-cover" />
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
  <div v-if="mobile" class="fixed z-100 bottom-0 h-20 pb-5 backdrop-blur-xl w-full">
    <div class="grid grid-cols-5 text-center items-center h-full text-white">
      <div>
        <RouterLink to="/">
          <div class="text-center">
            <div class="flex items-center h-8 justify-center">
              <i class="fa-solid fa-home"></i>
            </div>
            <p>Home</p>
          </div>
        </RouterLink>
      </div>
      <div @click="expandedSearch = !expandedSearch" class="text-center">
        <div class="flex items-center h-8 justify-center">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <p>Search</p>
      </div>
      <div class="flex justify-center">
        <PostCreatePostComponent text="+" mobile="true" />
      </div>
      <div @click="openUserMessages" class="text-center">
        <div class="flex items-center h-8 justify-center">
          <i class="fa-solid fa-bell"></i>
        </div>
        <div v-if="messages.length > 0"
          class="absolute -mt-5 ml-14 h-6 w-6 text-sm flex items-center justify-center bg-red-700 rounded-full">
          <div v-if="messages.length > 100">
            99+
          </div>
          <div v-else>
            {{ messages.length }}
          </div>
        </div>
        <p>Messages</p>
      </div>
      <div class="flex justify-center">
        <RouterLink to="/profile" class="flex justify-center flex-wrap">
          <div
            class="border w-8 h-8 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer">
            <i v-if="!haveProfilePicture" class="fa-solid fa-user rounded-full"></i>
            <img v-else-if="haveProfilePicture && loaded" :src="'https://api.faser.app/api/profile/getProfilePhoto?username=' +
              username
              " class="rounded-full w-8 h-8 object-cover" />
          </div>
          <p class="w-full">Profile</p>
        </RouterLink>
      </div>
    </div>
  </div>
  <div class="fixed z-20 backdrop-blur top-[4.5rem] bg-[#0206176c] w-full md:hidden z-100">
    <div class="backdrop-blur w-full">
      <div :class="{ 'expandable-content': true, expanded: expanded }">
        <SearchUserComponent />
        <div v-for="link in links" :key="link.name" class="w-full py-3 backdrop-blur">
          <RouterLink @click="expanded = false" :to="link.href" class="text-white w-full my-2 ml-3 backdrop-blur">
            {{ link.name }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade" @leave="leave" @enter="open">
    <div class="fixed w-screen h-screen backdrop-blur-lg z-50 flex items-center justify-center" v-if="expandedSearch">
      <div
        class="max-w-[90rem] md:w-[80svw] w-[95svw] text-white max-h-[70svh] overflow-auto bg-gray-800 p-2 rounded-xl">
        <div class="w-full flex items-center justify-between text-2xl font-bold">
          <div class="w-full text-center">
            <h1>Search</h1>
          </div>
          <i class="fa-solid fa-xmark mr-2 cursor-pointer text-xl" @click="expandedSearch = false"></i>
        </div>
        <SearchUserComponent />
      </div>
    </div>
  </Transition>

  <Transition name="fade" @leave="leave" @enter="open">
    <div class="fixed w-screen h-screen backdrop-blur-lg z-50 flex items-center justify-center" v-if="openMessages">
      <div
        class="max-w-[90rem] md:w-[80svw] w-[95svw] text-white max-h-[70svh] overflow-auto bg-gray-800 p-2 rounded-xl">
        <div class="w-full flex items-center justify-between text-2xl font-bold">
          <div class="w-full text-center">
            <h1>Messages</h1>
          </div>
          <i class="fa-solid fa-xmark mr-2 cursor-pointer text-xl" @click="openMessages = false"></i>
        </div>
        <div v-if="messages.length === 0" class="w-full text-gray-400 italic flex items-center justify-center h-28">
          <p>Great! You have no new messages</p>
        </div>
        <div v-else v-for="(message, index) in messages" :key="message">
          <div v-if="message.type === 'like' || message.type === 'comment'" class="flex pb-2 mb-2" :class="{
            'border-b border-gray-500': index < messages.length - 1
          }">
            <div class="h-full items-center">
              <div class="flex justify-center items-center w-8 h-8 bg-gray-700 rounded-full mr-2">
                <div v-if="message.type === 'like'" class="text-red-500">
                  <i class="fa-solid fa-heart"></i>
                </div>
                <div v-else class="text-green-400">
                  <i class="fa-solid fa-comment"></i>
                </div>
              </div>
            </div>
            <div>
              <div class="flex w-full items-center">

                <RouterLink @click="openMessages = false" :to="'/' + message.userProfile[0].username" class="flex">
                  <p class="flex">{{ message.userProfile[0].displayName }}</p>
                  <p class="text-gray-400">(@{{ message.userProfile[0].username }})</p>
                  <div v-if="message.userProfile[0].businessAccount"
                    class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                    <i class="fa-solid verifiedBadge fa-check"></i>
                  </div>
                  <div v-else-if="message.userProfile[0].verifiedAccount"
                    class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                    <i class="fa-solid verifiedBadge fa-check"></i>
                  </div>
                </RouterLink>

              </div>
              <RouterLink :to="'/post/' + message.postId" @click="openMessages = false">
                <div class="flex">
                  <p class="text-gray-400 mr-1" v-if="message.type === 'like'">Has liked your post: </p>
                  <p class="text-gray-400 mr-1" v-else>Commented on your post: </p>
                  <p>{{ message.postData[0] }}</p>
                </div>
              </RouterLink>
            </div>
          </div>
          <div v-else-if="message.type === 'follow'" class="flex pb-2 mb-2" :class="{
            'border-b border-gray-500': index < messages.length - 1
          }">
            <div class="h-full items-center">
              <div class="flex justify-center items-center w-8 h-8 bg-gray-700 rounded-full text-sky-300 mr-2">
                <i class="fa-solid fa-user-plus"></i>
              </div>
            </div>
            <div>
              <RouterLink @click="openMessages = false" :to="'/' + message.userProfile[0].username">
                <div class="flex w-full items-center">

                  <p class="flex">{{ message.userProfile[0].displayName }}</p>
                  <p class="text-gray-400">(@{{ message.userProfile[0].username }})</p>
                  <div v-if="message.userProfile[0].businessAccount"
                    class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                    <i class="fa-solid verifiedBadge fa-check"></i>
                  </div>
                  <div v-else-if="message.userProfile[0].verifiedAccount"
                    class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                    <i class="fa-solid verifiedBadge fa-check"></i>
                  </div>

                </div>
                <p class="text-gray-400">Has started following you</p>
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center" v-if="messages.length > 0">
          <button class="bg-red-500 p-2 rounded-xl" @click="clearMessages">
            Clear messages
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <div v-if="!mobile" class="h-20 bg-gray-950"></div>
  <div v-if="showBanner"
    class="w-full flex justify-center mb-2 p-5 text-white items-center bg-gradient-to-tr from-[#24c7ce] to-[#1ed794]">
    <div class="text-center">
      <p>You'll get a better experience using the web app of faser.</p>
      <h2 class="font-bold text-2xl mt-2">How to get the web app</h2>
      <p class="inline">To get the web app, tap on share <img class="inline" src="/assets/svg/ios-share.svg">, select
        "Add to Home
        Screen" and click add</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";

const expanded = ref(false);
const username = ref("");

const loaded = ref(false);
const haveProfilePicture = ref(false);

const messages = ref([])

const showBanner = ref(false)
const mobile = ref(false)

const expandedSearch = ref(false)

const openMessages = ref(false)

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Advanced",
    href: "/"
  }
];

onMounted(() => {
  const url = "https://api.faser.app/api/account/getOwnProfile";

  axios
    .get(url, {
      headers: {
        token: Cookies.get("token"),
      },
    })
    .then((response) => {
      username.value = response.data[1].username;
      axios.get("https://api.faser.app/api/profile/getProfilePhoto", {
        params: {
          username: response.data[1].username,
        },
      })
        .then((response) => {
          loaded.value = true;
          haveProfilePicture.value = true;
        })
        .catch((err) => {
          loaded.value = true;
          haveProfilePicture.value = false;
        });
    });

  getUserMessages()
});

function getUserMessages() {
  axios.post("https://api.faser.app/api/profile/getUserMessages", {
    token: Cookies.get("token")
  })
    .then((response) => {
      messages.value = response.data.messages
    });
}

function openUserMessages() {
  openMessages.value = !openMessages.value

  if (openMessages.value) {
    getUserMessages()
  }
}

function clearMessages() {
  axios.post("https://api.faser.app/api/profile/clearUserMessages", {
    token: Cookies.get("token")
  })
    .then((response) => {
      openMessages.value = false
      setTimeout(() => {
        messages.value = []
      }, 500)
    });
}

if (!window.navigator.standalone && window.navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
  showBanner.value = true
}

if (window.navigator.standalone && window.navigator.userAgent.match(/(iPhone|iPod|iPad|Macintosh)/i)) {
  mobile.value = true
}
</script>

<style scoped>
.expandable-content {
  transition: max-height 0.5s ease;
  overflow: hidden;
  height: 0;
}

.expandable-content.expanded {
  height: 100svh;
}

.z-100 {
  z-index: 100;
}

.fade-enter-active {
  animation: fadeIn 0.25s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    z-index: 10;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    z-index: 10;
    transform: translateY(0);
  }
}

.fade-leave-active {
  animation: faceOut 0.25s;
}

@keyframes faceOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(5px);
  }
}

.like-enter-active {
  animation: likeIn 0.25s ease;
}
</style>
