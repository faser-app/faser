<template>
  <div class="bg-[#0206176c] h-[4.5rem] fixed backdrop-blur text-white w-full flex z-50">
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
      <div class="hidden opacity-0 self-center items-center sm:opacity-100 gap-5 mr-10 md:flex">
        <SearchUserComponent />
        <div v-for="link in links" :key="link.name" class="cursor-pointer">
          <RouterLink :to="link.href" class="text-white hover:scale">{{
            link.name
          }}</RouterLink>
        </div>
      </div>
      <div class="h-full flex items-center">
        <RouterLink to="/profile">
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
  <div class="fixed z-20 backdrop-blur top-[4.5rem] bg-[#0206176c] w-full md:hidden">
    <div class="backdrop-blur w-full">
      <div :class="{ 'expandable-content': true, expanded: expanded }">
        <SearchUserComponent />
        <div v-for="link in links" :key="link.name" class="w-full py-3 backdrop-blur">
          <RouterLink :to="link.href" class="text-white w-full my-2 ml-3 backdrop-blur">
            {{ link.name }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
  <div class="h-20 bg-gray-950"></div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();

const expanded = ref(false);
const username = ref("");

const loaded = ref(false);
const haveProfilePicture = ref(false);

const links = [
  {
    name: "Home",
    href: "/",
  },
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
});
</script>

<style scoped>
.expandable-content {
  transition: max-height 0.5s ease;
  overflow: hidden;
  max-height: 0;
}

.expandable-content.expanded {
  max-height: 100svh;
}
</style>
