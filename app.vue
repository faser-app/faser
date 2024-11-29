<script setup>
import { useGtag, useHead, definePageMeta } from '#imports';
import Cookies from "js-cookie";
import { useRoute } from "vue-router";

const route = useRoute()

useHead({
  meta: [
    {
      name: "theme-color",
      content: "#030712"
    }
  ]
})

const pagesWithoutFooter = ref([
  "messages"
])

const gTag = useGtag()

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
      <FooterComponent v-if="!route.fullPath.includes(pagesWithoutFooter)" />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style>
</style>