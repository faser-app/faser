<template>
  <div class="bg-black" :class="{
    'mb-20': mobile
  }">
    <div class="bg-gray-900 text-white text-center p-4 rounded-t-xl">
      <div class="flex justify-center gap-4">
        <div v-for="link in links" :key="link.name">
          <RouterLink v-if="link.url.startsWith('/')" :to="link.url" class="underline">{{ link.name }}</RouterLink>
          <a :href="link.url" v-else class="underline">{{ link.name }}</a>
        </div>
      </div>
      <div class="flex w-full justify-center gap-2">
        <div class="flex justify-center underline mt-2 cursor-pointer" @click="resetCookies">
          Cookie Settings
        </div>
        <RouterLink to="/faq" class="flex justify-center underline mt-2 cursor-pointer">
          FAQ
        </RouterLink>
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
const mobile = ref(false);

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

if (window.navigator.standalone && window.navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
  mobile.value = true
}

function resetCookies() {
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
