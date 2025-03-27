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

// Pages that should use the full-width layout
const fullWidthPages = ref([
  "login",
  "register",
  "verify",
  "account/settings"
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

const isFullWidthPage = computed(() => {
  return fullWidthPages.value.some(page => route.path.includes(page))
})

const isHomePage = computed(() => {
  return route.path === '/'
})

// Fix the window reference issue
const windowWidth = ref(0)

onMounted(() => {
  windowWidth.value = window.innerWidth

  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    windowWidth.value = window.innerWidth
  })
})

const isMobileView = computed(() => {
  return windowWidth.value < 768
})
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <!-- Twitter-style layout -->
      <div class="app-container">
        <!-- Left sidebar menu (desktop only) -->
        <SidebarComponent v-if="!isFullWidthPage && !isMobileView" class="hidden md:block left-sidebar" />

        <!-- Main content area -->
        <main :class="[
          'main-content-area',
          isFullWidthPage ? 'full-width' : 'with-sidebars',
          {'with-right-sidebar': isHomePage},
          {'mobile-view': isMobileView}
        ]">
          <NuxtPage />
        </main>

        <!-- Right sidebar with Trends - Only on home page (desktop only) -->
        <TrendsComponent v-if="isHomePage && !isMobileView" class="hidden lg:block right-sidebar" />
      </div>

      <!-- Mobile bottom navigation bar -->
      <BottomBarComponent v-if="isMobileView && !isFullWidthPage" />

      <!-- Mobile content padding for bottom bar -->
      <div v-if="isMobileView && !isFullWidthPage" class="mobile-bottom-spacing"></div>

      <!-- Cookie banner and other full-width elements -->
      <CookieBannerComponent v-if="!accepted" />
      <FooterComponent v-if="!isFullWidthPage && !route.fullPath.includes(pagesWithoutFooter) && !isMobileView"
        class="mobile-footer" />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  position: relative;
}

.left-sidebar {
  flex: 0 0 auto;
}

.right-sidebar {
  flex: 0 0 auto;
}

.main-content-area {
  flex: 1;
  overflow-x: hidden;
}

.main-content-area.with-sidebars {
  margin-left: 70px;
  margin-right: 0;
}

.main-content-area.with-right-sidebar {
  margin-right: 0;
}

.mobile-footer {
  display: block;
}

/* Mobile specific styles */
.main-content-area.mobile-view {
  margin-left: 0;
  padding-bottom: 70px;
  /* Add space for the bottom bar */
}

.mobile-bottom-spacing {
  height: 64px;
  /* Same height as the bottom bar */
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .main-content-area.with-sidebars {
    margin-left: 280px;
    margin-right: 0;
  }

  .mobile-footer {
    display: none;
  }
}

@media (min-width: 1024px) {
  .main-content-area.with-sidebars {
    margin-right: 350px;
  }

  .main-content-area.with-right-sidebar {
    margin-right: 350px;
  }
}

/* Full-width layout for login, register, etc. */
.main-content-area.full-width {
  margin-left: 0;
  margin-right: 0;
}
</style>