<script setup>
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: "main-meta"
})

import Cookies from "js-cookie"

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