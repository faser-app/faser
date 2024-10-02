<script setup>
import { definePageMeta } from '#imports';
import Cookies from "js-cookie";

definePageMeta({
  middleware: "main-meta"
})  

const accepted = ref(false)

if (Cookies.get("accepted")) {
  accepted.value = true
}
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <HeaderComponent />
      <NuxtPage />
      <CookieBannerComponent v-if="!accepted" />
      <TailwindBreakpointIndicator />
      <FooterComponent />
    </NuxtLayout>
  </TooltipProvider>
</template>