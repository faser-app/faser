<script setup>
import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'
import axios from 'axios'
import posthog from 'posthog-js'
import currentPalette from './vars/getColors'
import userinfo from '~/vars/userinfo.js'
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'

useHead({
    bodyAttrs: {
        style: `background-color: ${currentPalette.value.bg}; color: ${currentPalette.value.textPrimary}`,
    },
})

const mobile = ref(false)
const route = useRoute()

const acceptedPrivacyPolicy = ref(false)

const pagesWithoutFooter = ref(['messages'])

// Pages that should use the full-width layout
const fullWidthPages = ref(['login', 'register', 'verify', 'community'])

const noPrivacyPolicy = ref(['privacy', 'imprint', 'tos', 'cookies'])

const accepted = ref(false)

if (Cookies.get('accepted') || Cookies.get('essential')) {
    accepted.value = true
}

const runtimeConfig = useRuntimeConfig()

if (Cookies.get('accepted') && Cookies.get('token')) {
    if (
        !window.location.host.includes('127.0.0.1') &&
        !window.location.host.includes('localhost')
    ) {
        posthog.init('phc_KiJYjTkcLZtWEX9HM20Sybwv8HiR8UMCTCf5adoKJPf', {
            api_host: 'https://eu.i.posthog.com',
        })
    }
}

const isFullWidthPage = computed(() => {
    return fullWidthPages.value.some((page) => route.path.includes(page))
})

const showPrivacyPolicy = computed(() => {
    return !noPrivacyPolicy.value.some((page) => route.path.includes(page))
})

const isFooterVisible = computed(() => {
    return !pagesWithoutFooter.value.some((page) => route.path.includes(page))
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

    axios
        .get(baseURL + '/api/account/getOwnProfile', {
            headers: {
                token: Cookies.get('token'),
            },
        })
        .then((response) => {
            acceptedPrivacyPolicy.value = !response.data[1].accepted
        })
})

function acceptPrivacyPolicy() {
    axios
        .post(baseURL + '/api/account/accept', {
            token: Cookies.get('token'),
        })
        .then((response) => {
            acceptedPrivacyPolicy.value = false
        })
}

onUnmounted(() => {
    window.removeEventListener('resize', () => {
        windowWidth.value = window.innerWidth
    })
})

function closeWindow() {
    window.close()
}

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
                <SidebarComponent
                    v-if="!isFullWidthPage && !isMobileView"
                    class="hidden md:block left-sidebar"
                />

                <!-- Main content area -->
                <main
                    :class="[
                        'main-content-area',
                        isFullWidthPage ? 'full-width' : 'with-sidebars',
                        { 'with-right-sidebar': isHomePage && !isMobileView },
                        { 'no-right-sidebar': !isHomePage || isMobileView },
                        { 'mobile-view': isMobileView },
                    ]"
                >
                    <NuxtPage />
                </main>

                <BaseModalComponent
                    :is-open="showPrivacyPolicy && acceptedPrivacyPolicy"
                    title="Privacy Policy Change"
                    :show-close-button="false"
                    submit-text="Accept"
                    @submit="acceptPrivacyPolicy"
                >
                    <p className="text-base leading-relaxed text-gray-300">
                        We've updated our Privacy Policy to provide you with
                        greater transparency and comply with the latest legal
                        requirements.
                    </p>
                    <p className="text-base leading-relaxed text-gray-300">
                        Please review and accept the updated policy to continue
                        using this app.
                    </p>
                    <div className="mt-4">
                        <a
                            href="/privacy"
                            className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                            View Privacy Policy
                        </a>
                    </div>
                </BaseModalComponent>

                <!-- Right sidebar with Trends - Only on home page (desktop only) -->
                <TrendsComponent
                    v-if="isHomePage && !isMobileView"
                    class="hidden lg:block right-sidebar"
                />
            </div>

            <!-- Mobile bottom navigation bar -->
            <BottomBarComponent v-if="isMobileView && !isFullWidthPage" />

            <!-- Mobile content padding for bottom bar -->
            <div
                v-if="isMobileView && !isFullWidthPage"
                class="mobile-bottom-spacing"
            ></div>

            <!-- Cookie banner and other full-width elements -->
            <CookieBannerComponent v-if="!accepted" />
            <!-- Footer is now visible in both mobile and medium screens (where trends are gone but not in mobile view yet) -->
            <FooterComponent
                v-if="isFooterVisible"
                :class="[
                    'footer-component',
                    { 'mobile-footer pb-18': isMobileView },
                    { 'medium-footer': !isMobileView && windowWidth < 1024 },
                ]"
            />
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

.main-content-area.no-right-sidebar {
    width: 100%;
    max-width: 100%;
}

.mobile-footer {
    display: block;
}

.medium-footer {
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

    /* We no longer hide the footer on medium screens */
    .mobile-footer {
        display: none;
    }
}

@media (min-width: 1024px) {
    .main-content-area.with-sidebars.with-right-sidebar {
        margin-right: 350px;
    }

    .main-content-area.no-right-sidebar {
        margin-right: 0;
    }

    /* Hide medium-footer on large screens */
    .medium-footer {
        display: none;
    }
}

/* Full-width layout for login, register, etc. */
.main-content-area.full-width {
    margin-left: 0;
    margin-right: 0;
}
</style>
