<template>
  <div class="bg-gray-950">
    <div class="bg-gray-900 text-white text-center p-4 rounded-t-xl">
      <div class="flex justify-center gap-4">
        <div v-for="link in links" :key="link.name">
          <RouterLink v-if="link.url.startsWith('/')" :to="link.url" class="underline">{{ link.name }}</RouterLink>
          <a :href="link.url" v-else class="underline">{{ link.name }}</a>
        </div>
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
</script>
