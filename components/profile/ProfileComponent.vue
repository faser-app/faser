<template>
  <div class="bg-black min-h-screen text-white">
    <div class="md:flex w-full justify-center">
      <div class="md:w-1/5 gap-2 md:block px-2 hidden">
        <div v-if="communities.length > 0" class="flex w-full justify-center">
          <h2>Communities</h2>
        </div>
        <div v-for="(community, index) in communities" :key="community.name" class="ph-no-capture">
          <RouterLink :to="'/communities/' + community.id">
            <div class="w-full mb-2 flex mr-8 h-fit truncate items-center pr-3 justify-between rounded-xl bg-gray-800">
              <div class="flex items-center ph-no-capture">
                <i class="fa-solid fa-users p-2 text-lg"></i>
                {{ community.displayName }}
              </div>
              <i v-if="community.private" class="fa-solid fa-lock"></i>
            </div>
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
        <div class="flex flex-wrap bg-gray-900 md:w-full ml-2 md:ml-1 rounded-xl items-center mr-2 h-fit">
          <div class="flex justify-between w-full">
            <div class="flex ph-no-capture items-center">
              <img v-if="hasProfilePicture && loaded"
                :src="'https://s3.faser.app/profilepictures/' + profileData.id + '/image.png?t=' + new Date().getTime()"
                @error="hasProfilePicture = false" alt="profile picture" class="h-24 w-24 m-5 object-cover" :class="{
              'rounded-full': !profileData.businessAccount,
              'rounded-xl': profileData.businessAccount
            }" />
              <div v-else
                class="h-24 w-24 m-5 flex border justify-center items-center border-[#96969627] bg-[#1118276c]" :class="{
              'rounded-full': !profileData.businessAccount,
              'rounded-xl': profileData.businessAccount
            }">
                <i class="fa-solid fa-user rounded-full text-4xl"></i>
              </div>
              <div class="grid">
                <div class="flex items-center">
                  <div>
                    <div class="flex ph-no-capture max-w-[60vw] flex-wrap gap-2 text-sm mb-2"
                      v-if="badges.length !== 0">
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
                        <div class="flex ph-no-capture">
                          <p>{{ profileData.displayName }}</p>
                          <div v-if="profileData.businessAccount"
                            class="flex ph-no-capture ml-2 justify-center text-xs items-center bg-yellow-600 border w-6 h-6 border-yellow-300 rounded-full">
                            <i class="fa-solid verifiedBadge fa-check"></i>
                          </div>
                          <div v-else-if="profileData.verifiedAccount"
                            class="flex ph-no-capture ml-2 justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full">
                            <i class="fa-solid verifiedBadge fa-check"></i>
                          </div>
                        </div>
                        <p class="text text-gray-400 ph-no-capture">
                          <span>@</span>{{ accountData.username }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isAbleToFollow" @click="toggleFollow"
                class="ml-5 cursor-pointer h-10 w-24 select-none rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] ">
                <p class="absolute">Followed</p>
                <div
                  class="z-20 flex items-center select-none justify-center transition-all duration-500 ease-out px-5 bg-gray-800 shadow-2xl rounded-xl text-gray-100"
                  :class="{
                'h-10 w-24': !followed,
                'h-0 w-0 overflow-hidden': followed
              }">
                  <p>Follow</p>
                </div>
              </div>
            </div>
            <div class="mr-2 mt-3">
              <Menu as="div" class="relative md:hidden inline-block text-left">
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
                    class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-black shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div class="px-1 py-1 ph-no-capture">
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
            <div class="text-center text-gray-400 rounded-xl cursor-pointer select-none" @click="openFollower = true">
              <p>Follower</p>
              <p class="ph-no-capture">{{ followers }}</p>
            </div>
            <div class="text-center text-gray-400 rounded-xl cursor-pointer select-none" @click="openFollowing = true">
              <p>Following</p>
              <p class="ph-no-capture">{{ following }}</p>
            </div>
            <div class="text-center text-gray-400 rounded-xl select-none">
              <p>Posts</p>
              <p class="ph-no-capture">{{ posts }}</p>
            </div>
          </div>
          <div v-if="music.songAuthor" class="w-full mt-2 ph-no-capture flex gap-3 text-gray-300">
            <iframe :src="'https://open.spotify.com/embed/track/' + music.songId" class="md:w-96 w-full mx-5"
              width="100%" height="80rem" frameBorder="0" allowfullscreen=""
              allow="clipboard-write; encrypted-media;"></iframe>
          </div>
          <div class="w-full p-5">
            <div class="md:flex gap-2 grid grid-cols-2">
              <RouterLink to="/account/settings"
                class="flex items-center gap-2 justify-center rounded-xl p-2 md:w-1/2 bg-gray-800">
                <i class="fa-solid fa-gear"></i>
                Account Settings
              </RouterLink>
              <div @click="shareProfile"
                class="flex items-center gap-2 cursor-pointer justify-center rounded-xl p-2 md:w-1/2 bg-gray-800">
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
                Share Profile
              </div>
            </div>
          </div>
          <div class="w-full p-5 bg-gray-800 mb-2 bio ph-no-capture">
            <p v-if="profileData.bio" v-html="markdownHTML"></p>
            <p v-else class="italic text-gray-300">
              No bio. Just imagine something cool here.
            </p>
          </div>
          <p class="w-full pl-5 pb-3 ph-no-capture">Member since {{ sinceString }}</p>
        </div>
        <div
          class="flex flex-wrap mt-2 md:bg-gray-900 bg-black mb-2 md:w-full md:ml-1 rounded-xl pl-1 md:pr-2 items-center md:mr-2 h-fit">
          <div class="p-2 mt-2 md:bg-gray-900 bg-black w-full md:pr-3 md:ml-2 rounded-xl items-center h-fit">
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

    <Transition name="fade" @leave="leave" @enter="enter">
      <div v-if="openFollower"
        class="fixed z-[100] h-full w-full backdrop-blur top-0 left-0 flex justify-center items-center">
        <div class="bg-gray-800 w-[60rem] max-h-[80rem] overflow-y-scroll mx-4 p-2 rounded-xl">
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
        class="fixed z-[100] h-full w-full backdrop-blur top-0 left-0 flex justify-center items-center">
        <div class="bg-gray-800 w-[60rem] max-h-[80svh] overflow-y-scroll mx-4 p-2 rounded-xl">
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

  </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import MarkdownIt from "markdown-it";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const md = new MarkdownIt({
  html: false,
  linkify: false,
}).disable(["code", "table", "heading", "hr", "image"])
const router = useRouter()
const runtimeConfig = useRuntimeConfig()

const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile";
const accountData = ref({});
const profileData = ref({});
const ownProfileData = ref({});
const posts = ref(0)
const followers = ref(0)
const following = ref(0)
const postsValue = ref([])
const sinceString = ref("");
const openFollower = ref(false)
const openFollowing = ref(false)
const hasProfilePicture = ref(true);
const loaded = ref(false);
const markdownHTML = ref("");
const badges = ref([]);
const communities = ref([]);
const music = ref([])
const loadedPosts = ref([])
const postIndex = ref(0)
const loading = ref(false)
const lastRequest = ref(0)

axios
  .get(url, {
    headers: {
      token: Cookies.get("token"),
    },
  })
  .then((response) => {
    accountData.value = response.data[1];
    profileData.value = response.data[0];

    const accountCreated = new Date(accountData.value.accountCreated);
    const accountCreatedString = accountCreated.toLocaleDateString();
    sinceString.value = accountCreatedString;

    markdownHTML.value = md.render(response.data[0].bio);

    music.value = response.data[0].music;

    badges.value = response.data[0].badges;

    ownProfileData.value = response.data[0];

    for (let i = 0; i < response.data[0].communities.length; i++) {
      axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/getCommunity", {
        communityId: response.data[0].communities[i].id
      })
        .then((response) => {
          communities.value.push(response.data.community)
        })
    }

    posts.value = response.data[0].posts.length;
    followers.value = response.data[0].follower.length;
    following.value = response.data[0].following.length;

    postsValue.value = response.data[0].posts.reverse();

    loadPosts(3)

    loaded.value = true

    // axios
    //   .get(
    //     "https://" + runtimeConfig.public.apiUrlServer + "/api/profile/getProfilePhoto?username=" +
    //     accountData.value.username
    //   )
    //   .then((response) => {
    //     hasProfilePicture.value = true;
    //     loaded.value = true;
    //   })
    //   .catch((error) => {
    //     hasProfilePicture.value = false;
    //     loaded.value = true;
    //   });
  })
  .catch((error) => {
    if (error.response.data.status === "error") {
      router.push("/login");
    }
  });


document.addEventListener("scroll", (event) => {
  if (document.body.offsetHeight - 2000 < window.scrollY) {
    if (lastRequest.value + 1000 < Date.now()) {
      lastRequest.value = Date.now()

      loadPosts(3)
    }
  }
})

function loadPosts(postsToLoad) {
  for (let i = 0; i < postsToLoad; i++) {
    if (postIndex.value < postsValue.value.length) {
      loadedPosts.value.push(postsValue.value[postIndex.value])
      postIndex.value++
    }
  }
}

function shareProfile() {
  navigator.share({
    title: "Check out my profile on Faser",
    url: "https://faser.app/" + accountData.value.username
  })
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
</style>
