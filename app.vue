<script setup>
import Cookies from "js-cookie";
import { useRoute } from "vue-router";
import axios from "axios";
import posthog from 'posthog-js'


const mobile = ref(false)
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

const accepted = ref(false)

if (Cookies.get("accepted") || Cookies.get("essential")) {
  accepted.value = true
}

if (Cookies.get("accepted")) {
  posthog.init('phc_KiJYjTkcLZtWEX9HM20Sybwv8HiR8UMCTCf5adoKJPf',
    {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'always'
    }
  )
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