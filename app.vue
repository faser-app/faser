<script setup>
import { definePageMeta } from '#imports';
import { useGtag } from '#imports';
import Cookies from "js-cookie";

const gTag = useGtag()

if(Cookies.get("token")) {
  gTag.gtag('event', 'logged_in', {
    'logged_in': 'true'
  });
} else {
  gTag.gtag('event', 'not_logged_in', {
    'not_logged_in': 'true'
  })
}

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