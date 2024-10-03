<script setup>
import { definePageMeta } from '#imports';
import { useGtag } from '#imports';
import Cookies from "js-cookie";

const gTag = useGtag()

definePageMeta({
  middleware: "main-meta"
})

if (Cookies.get("token")) {
  gTag.gtag('event', 'logged_in', {
    'logged_in': 'true'
  });
} else {
  gTag.gtag('event', 'not_logged_in', {
    'not_logged_in': 'true'
  });
}

const accepted = ref(false)

if (Cookies.get("accepted") || Cookies.get("essential")) {
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