<template>
  <HeaderComponent />
  <div class="min-h-screen bg-gray-950"></div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
    router.push("/account/settings");
});
</script>
