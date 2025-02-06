<script setup>
import Cookies from "js-cookie";
import { useRoute } from "vue-router";
import axios from "axios";
import posthog from 'posthog-js'
import currentPalette from "./vars/getColors";

useHead({
  bodyAttrs: {
    style: `background-color: ${currentPalette.value.bg}; color: ${currentPalette.value.textPrimary}`
  }
})

const mobile = ref(false)
const route = useRoute()

const pagesWithoutFooter = ref([
  "messages"
])

const accepted = ref(false)

if (Cookies.get("accepted") || Cookies.get("essential")) {
  accepted.value = true
}

const runtimeConfig = useRuntimeConfig()

if (Cookies.get("accepted") && Cookies.get("token")) {
  if (!window.location.host.includes('127.0.0.1') && !window.location.host.includes('localhost')) {
    posthog.init('phc_KiJYjTkcLZtWEX9HM20Sybwv8HiR8UMCTCf5adoKJPf', { api_host: 'https://eu.i.posthog.com' })
  }
}
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <HeaderComponent />
      <NuxtPage />
      <CookieBannerComponent v-if="!accepted" />
      <FooterComponent v-if="!route.fullPath.includes(pagesWithoutFooter)" />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style></style>