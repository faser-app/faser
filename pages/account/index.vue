<template>
  <div class="min-h-screen bg-black"></div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  router.push("/account/settings");
});
</script>
