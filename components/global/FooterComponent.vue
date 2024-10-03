<template>
  <div class="bg-gray-950">
    <div class="bg-gray-900 text-white text-center p-4 rounded-t-xl">
      <div class="flex justify-center gap-4">
        <div v-for="link in links" :key="link.name">
          <RouterLink v-if="link.url.startsWith('/')" :to="link.url" class="underline">{{ link.name }}</RouterLink>
          <a :href="link.url" v-else class="underline">{{ link.name }}</a>
        </div>
      </div>
      <div class="w-full flex justify-center underline mt-2 cursor-pointer" @click="resetCookies">
        Cookie Settings
      </div>

      <p class="mt-5">© 2024 faser</p>

      <div class="flex justify-center mt-3 text-2xl">
        <a href="https://github.com/faser-app">
          <i class="fa-brands fa-github hover:text-[#4078c0]"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import Cookie from "js-cookie";
import { useGtag } from "#imports";

const gTag = useGtag();

const links = ref([
  {
    name: "Imprint",
    url: "/imprint",
  },
  {
    name: "ToS",
    url: "/tos",
  },
  {
    name: "Cookie Policy",
    url: "/cookies",
  },
  {
    name: "Privacy",
    url: "/privacy",
  },
  {
    name: "Status Page",
    url: "https://stats.uptimerobot.com/Ow7zN9GfBE",
  },
]);

function resetCookies () {
  gTag.gtag('consent', 'update', {
    ad_storage: 'denied',
    analytics_storage: 'denied'
  });

  Object.keys(Cookie.get()).forEach((cookie) => {
    Cookie.remove(cookie);
  });

  window.location.reload();
}
</script>
