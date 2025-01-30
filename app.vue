<script setup>
import Cookies from "js-cookie";
import { useRoute } from "vue-router";
import axios from "axios";

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