<template>
  <div class="bg-gray-950">
    <div class="bg-gray-900 text-white text-center p-4 rounded-t-xl">
      <div class="flex justify-center gap-4">
        <div v-for="links in links" :key="links.name">
          <a :href="links.url" class="underline">{{ links.name }}</a>
        </div>
      </div>

      <p class="mt-5">© 2024 faser</p>
    </div>
  </div>
</template>

<script setup>
const links = ref([
  {
    name: "Support",
    url: "mailto:support@faser.app",
  },
]);
</script>
