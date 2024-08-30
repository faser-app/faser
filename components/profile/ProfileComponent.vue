<template>
  <div class="bg-gray-950 min-h-screen text-white">
    <div class="md:flex w-full">
      <div class="md:flex hidden flex-wrap md:w-60 gap-2 justify-center">
        <div v-for="community in communities" :key="community.name">
          <div
            class="w-full flex mr-8 h-fit truncate items-center rounded-xl bg-gray-800"
          >
            <img
              src="https://via.placeholder.com/150"
              alt="profile picture"
              class="rounded-full h-8 w-8 m-2"
            />
            {{ community.name }}
          </div>
        </div>
        <p v-if="communities.length === 0">No Communites yet</p>
      </div>
      <div class="w-full mr-4">
        <div
          class="flex flex-wrap bg-gray-800 md:w-full ml-2 md:ml-1 rounded-xl items-center mr-2 h-fit"
        >
          <img
            v-if="profileData.avatarURL"
            :src="profileData.avatarURL"
            alt="profile picture"
            class="rounded-full h-24 w-24 m-5"
          />
          <div
            v-else
            class="rounded-full h-24 w-24 m-5 flex border justify-center items-center border-[#96969627] bg-[#1118276c]"
          >
            <i
              v-if="!avatarURL"
              class="fa-solid fa-user rounded-full text-4xl"
            ></i>
          </div>
          <div class="grid">
            <div class="flex items-center">
              <div>
                <div class="flex gap-2 text-sm mb-2" v-if="badges.length !== 0">
                  <div
                    v-for="badge in badges"
                    :key="badge.name"
                    class="bg-black rounded-full"
                  >
                    <div
                      class="flex items-center cursor-default border rounded-full px-2 p-1"
                      :style="
                        'background-color: ' +
                        badge.color +
                        '55; border: 1px solid ' +
                        badge.color +
                        ';'
                      "
                    >
                      {{ badge.name }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <p class="text-xl">
                    <span class="text-gray-400 mr-0.5">@</span
                    >{{ accountData.username }}
                  </p>
                  <div
                    v-if="profileData.verifiedAccount"
                    class="flex justify-center text-xs items-center bg-sky-600 border w-6 h-6 border-sky-300 rounded-full"
                  >
                    <i class="fa-solid verifiedBadge fa-check"></i>
                  </div>
                </div>
              </div>
              <RouterLink
                to="/account/settings"
                class="absolute md:visible invisible right-5 bg-gray-700 p-3 rounded-xl"
              >
                Account settings
              </RouterLink>
              <RouterLink
                to="/account/settings"
                class="absolute visible md:invisible right-5 bg-gray-700 p-3 rounded-xl"
              >
                <i class="fa-solid fa-pen"></i>
              </RouterLink>
            </div>
          </div>
          <div class="w-full p-5 bg-gray-700 mb-2 bio">
            <p v-if="profileData.bio" v-html="markdownHTML"></p>
            <p v-else class="italic text-gray-300">
              No bio. Just imagine something cool here.
            </p>
          </div>
          <p class="w-full pl-5 pb-3">Member since {{ sinceString }}</p>
        </div>
        <div
          class="flex flex-wrap mt-2 bg-gray-800 md:w-full ml-2 md:ml-1 rounded-xl items-center mr-2 h-fit"
        >
          <div class="w-full flex justify-center">
            <p class="text-xl mt-2">Posts</p>
          </div>
          <div class="h-36 flex w-full justify-center items-center">
            <p class="italic text-gray-400">No posts yet</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        v-if="communities.length !== 0"
        class="flex md:hidden w-full justify-center text-xl mt-2"
      >
        <p>Communities</p>
      </div>
      <div class="flex md:hidden mt-2 flex-wrap md:w-60 gap-2 justify-center">
        <div v-for="community in communities" :key="community.name">
          <div
            class="w-full flex mr-8 h-fit truncate items-center rounded-xl bg-gray-800"
          >
            <img
              src="https://via.placeholder.com/150"
              alt="profile picture"
              class="rounded-full h-8 w-8 m-2"
            />
            {{ community.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

const router = useRouter();

const url = "https://api.faser.app/api/account/getOwnProfile";

const accountData = ref({});
const profileData = ref({});

const sinceString = ref("");

const markdownHTML = ref("");

const badges = ref([]);

const communities = ref([]);

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

    badges.value = response.data[0].badges;
  })
  .catch((error) => {
    if (error.response.data.status === "error") {
      router.push("/login");
    }
  });
</script>

<style scoped>
.verifiedBadge {
  transform: translateY(1px);
}

.bio h1 {
  font-size: 2em;
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
