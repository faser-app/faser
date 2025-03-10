<template>
  <div class="min-h-[calc(100vh-4.5rem)] bg-black"></div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  router.push("/account/settings");
});
</script>
