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

console.log()
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <HeaderComponent />
      <NuxtPage />
      <CookieBannerComponent v-if="!accepted" />
      <FooterComponent v-if="!route.fullPath.includes(route.path.split('/')[1])" />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}

.page-enter-from {
  transform: translateX(100%);
}

.page-enter-to {
  transform: translateX(0);
}

.page-leave-from {
  transform: translateX(0);
}

.page-leave-to {
  transform: translateX(-100%);
}
</style>