<template>
  <div class="bg-gray-950 min-h-screen text-white">
    <div class="md:flex w-full" v-if="loaded && success">
      <div class="md:flex hidden flex-wrap md:w-1/5 gap-2 justify-center">
        <div v-for="community in communities" :key="community.name">
          <div class="w-full flex mr-8 h-fit truncate items-center rounded-xl bg-gray-800">
            <img src="https://via.placeholder.com/150" alt="profile picture" class="rounded-full h-8 w-8 m-2" />
            {{ community.name }}
          </div>
        </div>
        <p v-if="communities.length === 0 && !privateAccount">
          No Communites yet
        </p>
        <p v-if="privateAccount">Private account</p>
      </div>
      <div class="md:w-4/5 w-full mr-4">
        <div class="flex flex-wrap bg-gray-800 md:w-full ml-2 md:ml-1 rounded-xl items-center mr-2 h-fit">
          <img v-if="hasProfilePicture && imageLoaded" :src="'https://api.faser.app/api/profile/getProfilePhoto?username=' +
            route.params.user.replace('@', '')
            " alt="profile picture" class="h-24 w-24 m-5 object-cover" :class="{
              'rounded-full': !profileData.businessAccount,
              'rounded-xl': profileData.businessAccount
            }" />
          <div v-else class="h-24 w-24 m-5 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
            :class="{
              'rounded-full': !profileData.businessAccount,
              'rounded-xl': profileData.businessAccount
            }">
            <i class="fa-solid fa-user rounded-full text-4xl"></i>
          </div>
          <div class="grid">
            <div class="flex items-center">
              <div>
                <div class="flex gap-2 text-sm mb-2" v-if="badges.length !== 0">
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
            class="ml-5 cursor-pointer h-10 w-24 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] ">
            <p class="absolute">Followed</p>
            <div
              class="z-20 flex items-center justify-center transition-all duration-500 ease-out px-5 bg-gray-700 shadow-2xl rounded-xl text-gray-100"
              :class="{
                'h-10 w-24': !followed,
                'h-0 w-0 overflow-hidden': followed
              }">
              <p>Follow</p>
            </div>
          </div>
          <div class="min-w-full mb-3 sm:mb-0 sm:min-w-fit sm:ml-5 justify-center flex flex-wrap gap-4">
            <div class="text-center text-gray-400 rounded-xl cursor-pointer select-none" @click="openFollower = true">
              <p>Follower</p>
              <p>{{ followers }}</p>
            </div>
            <div class="text-center text-gray-400 rounded-xl cursor-pointer select-none" @click="openFollowing = true">
              <p>Following</p>
              <p>{{ following }}</p>
            </div>
            <div class="text-center text-gray-400 rounded-xl select-none">
              <p>Posts</p>
              <p>{{ posts }}</p>
            </div>
          </div>
          <div class="w-full p-5 bg-gray-700 mb-2">
            <p v-if="profileData.bio" v-html="markdownHTML"></p>
            <p v-else class="italic text-gray-300">
              No bio. Just imagine something cool here.
            </p>
          </div>
          <p class="w-full pl-5 pb-3">Member since {{ sinceString }}</p>
        </div>
        <div class="flex flex-wrap mt-2 bg-gray-800 md:w-full ml-2 md:ml-1 rounded-xl items-center mr-2 h-fit">
          <div class="p-2 mt-2 bg-gray-800 w-full ml-2 md:ml-1 rounded-xl items-center h-fit">
            <div class="w-full flex justify-center">
              <p class="text-xl mt-2 mb-2">Posts</p>
            </div>
            <div v-if="posts == 0" class="h-36 flexjustify-center items-center">
              <p class="italic text-gray-400">No posts yet</p>
            </div>
            <div v-else v-for="post in postsValue" :key="post.id" class="w-full justify-center items-center">
              <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
                :account="accountData" :ownProfileData="ownProfileData" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="communities.length !== 0" class="flex md:hidden w-full justify-center text-xl mt-2">
        <p>Communities</p>
      </div>
      <div class="flex md:hidden mt-2 flex-wrap md:w-60 gap-2 justify-center">
        <div v-for="community in communities" :key="community.name">
          <div class="w-full flex mr-8 h-fit truncate items-center rounded-xl bg-gray-800">
            <img src="https://via.placeholder.com/150" alt="profile picture" class="rounded-full h-8 w-8 m-2" />
            {{ community.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!success && !loaded">
      <div class="flex flex-wrap min-h-svh w-full justify-center items-center">
        <p class="text-3xl text-gray-400">404 Not found</p>
      </div>
    </div>

    <div v-if="openFollower" :class="{
      'animation': openFollower
    }" class="fixed h-full w-full backdrop-blur top-0 left-0 flex justify-center items-center">
      <div class="bg-gray-800 w-[60rem] max-h-[90rem] overflow-y-scroll mx-4 p-2 rounded-xl">
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

    <div v-if="openFollowing" :class="{
      'animation': openFollowing
    }" class="fixed h-full w-full backdrop-blur top-0 left-0 flex justify-center items-center">
      <div class="bg-gray-800 w-[60rem] max-h-[90rem] overflow-y-scroll mx-4 p-2 rounded-xl">
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

  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import MarkdownIt from "markdown-it";
import Cookies from "js-cookie";

const router = useRouter()

const md = new MarkdownIt();

const url = "https://api.faser.app/api/account/getProfile";

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
const openFollowing = ref(false)

const privateAccount = ref(false);

const isAbleToFollow = ref(true)

const followed = ref(false)

const hasProfilePicture = ref(false);
const imageLoaded = ref(false);

const markdownHTML = ref("");

const ownId = ref(0)

const ownProfile = ref({});
const ownProfileData = ref({});

const communities = ref([]);

const route = useRoute();

const username = route.params.user.replace("@", "");

axios.get("https://api.faser.app/api/account/getOwnProfile", {
  headers: {
    token: Cookies.get("token"),
  },
}).then((ownResponse) => {
  ownProfileData.value = ownResponse.data[0];
  ownId.value = ownResponse.data[0].id
})

axios
  .get(url, {
    headers: {
      username: username,
      token: Cookies.get("token"),
      lang: navigator.language || navigator.userLanguage,
    },
  })
  .then((response) => {
    loaded.value = true;
    success.value = true;

    profileData.value = response.data[0];

    badges.value = response.data[0].badges;

    markdownHTML.value = md.render(response.data[0].bio);

    posts.value = response.data[0].posts.length;
    followers.value = response.data[0].follower.length;
    following.value = response.data[0].following.length;

    if (response.data[0].follower.includes(ownId.value)) {
      followed.value = true
    }

    postsValue.value = response.data[0].posts.reverse();

    privateAccount.value = response.data[0].privateAccount;

    const accountCreated = new Date(response.data[1].memberSince);
    const accountCreatedString = accountCreated.toLocaleDateString();
    sinceString.value = accountCreatedString;

    if (response.data[0].id === ownResponse.data[0].id) {
      isAbleToFollow.value = false
    }
  })
  .catch((error) => {
    loaded.value = true;
    success.value = true;
  });

axios
  .get(
    "https://api.faser.app/api/profile/getProfilePhoto?username=" + username
  )
  .then((response) => {
    hasProfilePicture.value = true;
    imageLoaded.value = true;
  })
  .catch((error) => {
    hasProfilePicture.value = false;
    imageLoaded.value = true;
  });

function toggleFollow() {
  let url = ""

  if (followed.value) {
    url = "https://api.faser.app/api/social/unfollowUser"
    followers.value--
  } else {
    url = "https://api.faser.app/api/social/followUser"
    followers.value++
  }

  axios.post(url, {
    token: Cookies.get("token"),
    username: route.params.user.replace("@", "")
  })
    .then()
    .catch((error) => {
      router.push("/login")
    })

  followed.value = !followed.value
}
</script>

<style scoped>
.verifiedBadge {
  transform: translateY(1px);
}

.bio h1 {
  font-size: 2em;
}

.animation {
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

.bio h2 {
  font-size: 1.5em;
}

.bio h3 {
  font-size: 1.17em;
}

.bio h4 {
  font-size: 1em;
}

.bio h5 {
  font-size: 0.83em;
}

.bio h6 {
  font-size: 0.67em;
}

.bio p {
  font-size: 1em;
}

.bio a {
  text-decoration: underline;
}

.bio ul {
  list-style-type: disc;
}

.bio ol {
  list-style-type: decimal;
}

.bio li {
  font-size: 1em;
}

.bio blockquote {
  font-size: 1em;
}

.bio code {
  font-size: 1em;
}

.bio pre {
  font-size: 1em;
}

.bio strong {
  font-weight: bold;
}

.bio em {
  font-style: italic;
}

.bio u {
  text-decoration: underline;
}

.bio del {
  text-decoration: line-through;
}

.bio s {
  text-decoration: line-through;
}

.bio ins {
  text-decoration: underline;
}

.bio mark {
  background-color: yellow;
}

.bio sub {
  vertical-align: sub;
}

.bio sup {
  vertical-align: super;
}

.bio small {
  font-size: 0.83em;
}

.bio b {
  font-weight: bold;
}

.bio i {
  font-style: italic;
}

.bio u {
  text-decoration: underline;
}

.bio center {
  text-align: center;
}

.bio table {
  border-collapse: collapse;
  width: 100%;
}

.bio th {
  border: 1px solid #ddd;
  padding: 8px;
}

.bio td {
  border: 1px solid #ddd;
  padding: 8px;
}

.bio tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
