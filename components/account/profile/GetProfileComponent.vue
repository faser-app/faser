<template>
  <div class="min-h-[calc(100vh-4.5rem)] text-white" :style="{ backgroundColor: currentPalette.bg }">
    <div class="md:flex w-full justify-center" v-if="loaded && success">
      <div class="md:block px-2 hidden md:w-1/5 gap-2 justify-center">
        <div class="flex w-full justify-center" v-if="communities.length > 0">
          <h2>Communities</h2>
        </div>
        <div v-for="community in communities" :key="community.name">
          <RouterLink :to="'/communities/' + community.id">
            <CommunityLinkComponent :community="community" />
          </RouterLink>
        </div>
        <div class="flex w-full justify-center">
          <p v-if="communities.length === 0 && !privateAccount">
            No Communites yet
          </p>
        </div>
        <p v-if="privateAccount">Private account</p>
      </div>
      <div class="md:w-4/5 max-w-[90rem] w-full mr-4">
        <div class="flex flex-wrap md:w-full ml-2 md:ml-1 rounded-md items-center mr-2 h-fit"
          :style="{ backgroundColor: currentPalette.bg, color: currentPalette.textPrimary }">
          <div class="flex justify-between w-full">
            <div class="flex items-center">
              <img v-if="hasProfilePicture && loaded"
                :src="'https://s3.faser.app/profilepictures/' + profileData.id + '/image.png?t=' + new Date().getTime()"
                @error="hasProfilePicture = false" alt="profile picture" class="h-24 w-24 m-5 object-cover" :class="{
              'rounded-full': !profileData.businessAccount,
              'rounded-md': profileData.businessAccount
            }" />
              <div v-else
                class="h-24 w-24 m-5 flex border justify-center items-center border-[#96969627] bg-[#1118276c]" :class="{
              'rounded-full': !profileData.businessAccount,
              'rounded-md': profileData.businessAccount
            }">
                <i class="fa-solid fa-user rounded-full text-4xl"></i>
              </div>
              <div class="grid">
                <div class="flex items-center">
                  <div>
                    <div class="flex max-w-[60vw] flex-wrap gap-2 text-sm mb-2" v-if="badges.length !== 0">
                      <div v-for="badge in badges" :key="badge.name" class="bg-black rounded-full">
                        <div class="flex items-center cursor-default border rounded-full px-2 p-1" :style="'background-color: ' +
                      badge.color +
                      '55; border: 1px solid ' +
                      badge.color +
                      ';'
                      ">
                          {{ badge.name }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div>
                        <div class="flex">
                          <p>{{ profileData.displayName }}</p>
                          <div v-if="profileData.businessAccount"
                            class="flex ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                            <i class="fa-solid verifiedBadge fa-check"></i>
                          </div>
                          <div v-else-if="profileData.verifiedAccount"
                            class="flex ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                            <i class="fa-solid verifiedBadge fa-check"></i>
                          </div>
                        </div>
                        <p class="text text-gray-400">
                          <span>@</span>{{ route.params.user.replace("@", "") }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isAbleToFollow" @click="toggleFollow"
                class="ml-5 cursor-pointer h-10 w-24 select-none rounded-md flex items-center justify-center bg-linear-to-tr from-[#24c7ce] to-[#1ed794] ">
                <p class="absolute">Followed</p>
                <div
                  class="z-2 flex items-center select-none justify-center transition-all duration-500 ease-out px-5 bg-gray-800 shadow-2xl rounded-md text-gray-100"
                  :class="{
                'h-10 w-24': !followed,
                'h-0 w-0 overflow-hidden': followed
              }">
                  <p>Follow</p>
                </div>
              </div>
            </div>
            <div class="mr-2 mt-3">
              <Menu as="div" class="relative z-3 md:hidden inline-block text-left">
                <div>
                  <MenuButton
                    class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white">
                    <i class="fa-solid fa-users"></i>
                  </MenuButton>
                </div>

                <transition enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <MenuItems
                    class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-black shadow-lg ring-1 ring-black/5 focus:outline-hidden">
                    <div class="px-1 py-1">
                      <MenuItem v-for="community in communities" v-slot="{ active }">
                      <RouterLink :to="'/communities/' + community.id" :class="[
                                active ? 'bg-gray-600 text-white' : 'text-gray-200',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]">
                        <i class="fa-solid fa-users mr-2"></i>
                        {{ community.displayName }}
                      </RouterLink>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
          <div class="min-w-full mb-3 sm:mb-0 sm:min-w-fit sm:ml-5 justify-center flex flex-wrap gap-4">
            <div class="text-center text-gray-400 rounded-md cursor-pointer select-none" @click="openFollower = true">
              <p>Follower</p>
              <p>{{ followers }}</p>
            </div>
            <div class="text-center text-gray-400 rounded-md cursor-pointer select-none" @click="openFollowing = true">
              <p>Following</p>
              <p>{{ following }}</p>
            </div>
            <div class="text-center text-gray-400 rounded-md select-none">
              <p>Posts</p>
              <p>{{ posts }}</p>
            </div>
          </div>
          <div v-if="music.songAuthor" class="w-full mt-2 flex gap-3 text-gray-300">
            <iframe :src="'https://open.spotify.com/embed/track/' + music.songId" class="md:w-96 w-full mx-5"
              width="100%" height="80rem" frameBorder="0" allowfullscreen=""
              allow="clipboard-write; encrypted-media;"></iframe>
          </div>
          <div class="w-full p-5">
            <div class="md:flex md:flex-nowrap gap-2 justify-center grid grid-cols-2">
              <div to="/account/settings" @click="openReport = true"
                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2 md:w-1/2"
                :style="{ backgroundColor: currentPalette.buttonPrimary, color: currentPalette.textSecondary }">
                <i class="fa-solid fa-shield"></i>
                Report Profile
              </div>
              <div to="/account/settings" @click="alertNotImplemented"
                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2 md:w-1/2"
                :style="{ backgroundColor: currentPalette.buttonPrimary, color: currentPalette.textSecondary }">
                <i class="fa-solid fa-ban"></i>
                Block User
              </div>
              <div @click="shareProfile"
                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2 md:w-1/2"
                :style="{ backgroundColor: currentPalette.buttonPrimary, color: currentPalette.textSecondary }">
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
                Share Profile
              </div>
              <RouterLink :to="'/messages/' + profileData.id"
                class="flex items-center gap-2 cursor-pointer justify-center rounded-md p-2 md:w-1/2"
                :style="{ backgroundColor: currentPalette.buttonPrimary, color: currentPalette.textSecondary }">
                <i class="fa-solid fa-message"></i>
                Message
              </RouterLink>
            </div>
          </div>
          <div class="w-full p-5 mb-2" :style="{ backgroundColor: currentPalette.bgSecondary }">
            <p v-if="profileData.bio" v-html="markdownHTML"></p>
            <p v-else class="italic text-gray-300">
              No bio. Just imagine something cool here.
            </p>
          </div>
          <p class="w-full pl-5 pb-3">Member since {{ sinceString }}</p>
        </div>
        <div class="flex flex-wrap mt-2 mb-2 md:w-full md:ml-1 rounded-md pl-1 md:pr-2 items-center md:mr-2 h-fit"
          :style="{ backgroundColor: currentPalette.bgSecondary }">
          <div class="p-2 mt-2 w-full md:pr-3 md:ml-2 rounded-md items-center h-fit"
            :style="'background-color: ' + currentPalette.bgSecondary">
            <div v-if="posts == 0" class="h-36 flex justify-center items-center">
              <p class="italic text-gray-400">No posts yet</p>
            </div>
            <div v-else v-for="(post, index) in loadedPosts" :key="post.id" class="w-full block">
              <PostGetPostComponent class="ph-no-capture" :postId="post" ownProfile="true" :profile="profileData"
                :ownProfile="ownProfile" :account="accountData" :ownProfileData="ownProfileData"
                :border="index !== loadedPosts.length - 1" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!success && loaded">
      <div class="flex min-h-svh w-full justify-center items-center">
        <div class="text-center">
          <p class="text-3xl text-gray-400">404 Not found</p>
          <p class="text-gray-400">This user is not available</p>
        </div>
      </div>
    </div>

    <Transition name="fade" @leave="leave" @enter="enter">
      <div v-if="openFollower"
        class="fixed h-full z-100 w-full backdrop-blur-sm top-0 left-0 flex justify-center items-center">
        <div class="w-[60rem] max-h-[80svh] overflow-y-scroll mx-4 p-2 rounded-md"
          :style="{ backgroundColor: currentPalette.bg }">
          <div class="w-full flex items-center justify-center text-xl font-bold">
            <h1 class="w-full text-center">Followers ({{ followers }})</h1>
            <i class="fa-solid fa-xmark mr-2 cursor-pointer" @click="openFollower = false"></i>
          </div>
          <div v-for="(user, index) in profileData.follower" v-if="profileData.follower.length > 0" :key="user">
            <div :class="{
              'border-b border-b-gray-500 pb-2': index !== profileData.follower.length - 1,
              'mt-2': index !== 0
            }">
              <AccountProfileGetFollowComponent :id="user" />
            </div>
          </div>
          <div v-else class="italic w-full p-8 flex justify-center items-center text-gray-400">
            <h1>This user is not followed by anyone</h1>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade" @leave="leave" @enter="enter">
      <div v-if="openFollowing"
        class="fixed h-full z-100 w-full backdrop-blur-sm top-0 left-0 flex justify-center items-center">
        <div class="w-[60rem] max-h-[80svh] overflow-y-scroll mx-4 p-2 rounded-md"
          :style="{ backgroundColor: currentPalette.bg }">
          <div class="w-full flex items-center justify-center text-xl font-bold">
            <h1 class="w-full text-center">Following ({{ following }})</h1>
            <i class="fa-solid fa-xmark mr-2 cursor-pointer" @click="openFollowing = false"></i>
          </div>
          <div v-for="(user, index) in profileData.following" v-if="profileData.following.length > 0" :key="user">
            <div :class="{
              'border-b border-b-gray-500 pb-2': index !== profileData.following.length - 1,
              'mt-2': index !== 0
            }">
              <AccountProfileGetFollowComponent :id="user" />
            </div>
          </div>
          <div v-else class="italic w-full p-8 flex justify-center items-center text-gray-400">
            <h1>This user is not following anyone</h1>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade" @leave="leave" @enter="enter">
      <div v-if="openReport"
        class="fixed h-full z-100 w-full backdrop-blur-sm top-0 left-0 flex justify-center items-center">
        <div class="w-[60rem] max-h-[80svh] overflow-y-scroll mx-4 p-2 rounded-md"
          :style="{ backgroundColor: currentPalette.bg }">
          <div class="w-full flex items-center justify-center text-xl font-bold">
            <h1 class="w-full text-center">Report Profile</h1>
            <i class="fa-solid fa-xmark mr-2 cursor-pointer" @click="openReport = false"></i>
          </div>
          <SupportFieldsComponent :predefinedSubject="'User Report for ' + profileData.displayName"
            :predefinedMessage="'I want to report this person because...\n\nUser ID: ' + profileData.id" />
          <p class="ml-2">Please provide the User ID for the Person you want to report.</p>
        </div>
      </div>
    </Transition>

    <transition name="fade" @leave="leave" @enter="enter">
      <div v-if="showLoginModal" @click.self="showLoginModal = false"
        class="fixed w-screen h-screen top-0 left-0 z-[100] backdrop-blur-md flex items-center justify-center">
        <div
          class="bg-gray-900 p-5 text-center min-w-[80svw] max-w-[80svw] max-h-[80svh] min-h-[80svh] flex justify-center rounded-md m-3 md:w-auto flex-wrap items-stretch">
          <div class="w-full h-fit flex justify-end">
            <i class="fa-solid fa-xmark cursor-pointer p-3" @click="showLoginModal = false"></i>
          </div>
          <LoginComponent />
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import MarkdownIt from "markdown-it";
import Cookies from "js-cookie";
import { useHead } from "#app";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import currentPalette from "~/vars/getColors";
import CommunityLinkComponent from "./CommunityLinkComponent.vue";

useHead({
  meta: [
    {
      name: "theme-color",
      content: "#030712"
    }
  ]
})

const router = useRouter()
const md = new MarkdownIt({
  html: false,
  linkify: false,
}).disable(["code", "table", "heading", "hr", "image"])

const runtimeConfig = useRuntimeConfig()

const url = baseURL + "/api/account/getProfile";
const profileData = ref({});
const sinceString = ref("");
const badges = ref([]);
const success = ref(false);
const loaded = ref(false);
const postsValue = ref([]);
const posts = ref(0)
const followers = ref(0)
const following = ref(0)
const openFollower = ref(false)
const showLoginModal = ref(false)
const loggedIn = ref(Cookies.get("token") ? true : false)
const openFollowing = ref(false)
const privateAccount = ref(false);
const isAbleToFollow = ref(true)
const followed = ref(false)
const hasProfilePicture = ref(true);
const imageLoaded = ref(false);
const markdownHTML = ref("");
const ownId = ref(0)
const ownProfile = ref({});
const ownProfileData = ref({});
const communities = ref([]);
const route = useRoute();
const username = route.params.user.replace("@", "");
const openReport = ref(false)
const music = ref([])
const accountData = ref({})
const loadedPosts = ref([])
const postIndex = ref(0)
const loading = ref(false)
const lastRequest = ref(0)

function shareProfile() {
  navigator.share({
    title: "Check out this profile on Faser",
    url: "https://faser.app/" + route.params.user,
  });
}

function alertNotImplemented() {
  alert("This feature is not implemented yet");
}

async function main() {
  axios.get(baseURL + "/api/account/getOwnProfile", {
    headers: {
      token: Cookies.get("token"),
    },
  })
    .then(async (ownResponse) => {
      if (ownResponse && ownResponse.data) {
        ownProfileData.value = ownResponse.data[0];
        ownId.value = ownResponse.data[0].id;
        accountData.value = ownResponse.data[1];
      } else {
        console.error("Die API hat keine gültigen Daten zurückgegeben.");
      }

      getProfile()
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen des eigenen Profils:", error);
      getProfile()
    });

}

async function getProfile() {
  const response = await axios
    .get(url, {
      headers: {
        username: username,
        lang: navigator.language || navigator.userLanguage,
      },
    }).catch((error) => {
      if (error.response.status === 404) {
        loaded.value = true;
        success.value = false;
      } else {
        router.push("/login")
      }
    });

  if (response.status === 200) {
    loaded.value = true;
    success.value = true;
  }

  if (response.data[0].id === ownProfileData.value.id) {
    isAbleToFollow.value = false;
  }

  if (response.data[0].follower.includes(ownId.value)) {
    followed.value = true;
  }

  profileData.value = response.data[0];

  badges.value = response.data[0].badges;

  markdownHTML.value = md.render(response.data[0].bio);

  posts.value = response.data[0].posts.length;
  followers.value = response.data[0].follower.length;
  following.value = response.data[0].following.length;

  for (let i = 0; i < response.data[0].communities.length; i++) {
    axios.post(baseURL + "/api/community/getCommunity", {
      communityId: response.data[0].communities[i].id
    })
      .then((response) => {
        communities.value.push(response.data.community)
      })
  }

  music.value = response.data[0].music

  postsValue.value = response.data[0].posts.reverse();

  privateAccount.value = response.data[0].privateAccount;

  loadPosts(25)

  const accountCreated = new Date(response.data[1].memberSince);
  const accountCreatedString = accountCreated.toLocaleDateString();
  sinceString.value = accountCreatedString;
}


document.addEventListener("scroll", (event) => {
  if (document.body.offsetHeight - 8000 < window.scrollY) {
    if (lastRequest.value + 1000 < Date.now()) {
      lastRequest.value = Date.now()

      loadPosts(25)
    }
  }
})

main();

function loadPosts(postsToLoad) {
  for (let i = 0; i < postsToLoad; i++) {
    if (postIndex.value < postsValue.value.length) {
      loadedPosts.value.push(postsValue.value[postIndex.value])
      postIndex.value++
    }
  }
}

function toggleFollow() {
  if (!loggedIn.value) {
    showLoginModal.value = true
    return
  }
  
  let url = ""

  if (followed.value) {
    url = baseURL + "/api/social/unfollowUser"
    followers.value--
  } else {
    url = baseURL + "/api/social/followUser"
    followers.value++
  }

  axios.post(url, {
    token: Cookies.get("token"),
    username: route.params.user.replace("@", "")
  })
    .then()
    .catch((error) => {
      if (error.response.data.message === "You cannot follow yourself") {
        alert(error.response.data.message)

        if (followed.value) {
          url = baseURL + "/api/social/unfollowUser"
          followers.value--
        } else {
          url = baseURL + "/api/social/followUser"
          followers.value++
        }

        followed.value = !followed.value
      } else if (error.response.status === 429) {
        alert(error.response.data)

        if (followed.value) {
          url = baseURL + "/api/social/unfollowUser"
          followers.value--
        } else {
          url = baseURL + "/api/social/followUser"
          followers.value++
        }

        followed.value = !followed.value
      } else if (error.response.data.message === "You are already following this user") {
        if (url.includes("unfollow")) {
          followers.value++
        } else {
          followers.value--
        }
      } else {
        router.push("/login")
      }
    })

  followed.value = !followed.value
}
</script>

<style scoped>
@import url("~/assets/css/markdown.css");

.verifiedBadge {
  transform: translateY(1px);
}

.fade-enter-active {
  animation: fadeIn 0.25s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(10px)
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px)
  }
}

.fade-leave-active {
  animation: fadeOut 0.25s;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px)
  }

  to {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(10px)
  }
}

.z-100 {
  z-index: 100;
}
</style>
