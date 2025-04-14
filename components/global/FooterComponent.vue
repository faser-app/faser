<template>
    <div
        :class="{
            'mb-20': mobile,
        }"
    >
        <div
            class="text-white text-center p-4 rounded-t-xl"
            :style="{ border: '1px solid ' + currentPalette.bgSecondary }"
        >
            <div class="flex justify-center gap-4">
                <div v-for="link in links" :key="link.name">
                    <RouterLink
                        v-if="link.url.startsWith('/')"
                        :to="link.url"
                        class="underline"
                        >{{ link.name }}</RouterLink
                    >
                    <a :href="link.url" v-else class="underline">{{
                        link.name
                    }}</a>
                </div>
            </div>
            <div class="flex w-full justify-center gap-2">
                <div
                    class="flex justify-center underline mt-2 cursor-pointer"
                    @click="resetCookies"
                >
                    Cookie Settings
                </div>
                <RouterLink
                    to="/faq"
                    class="flex justify-center underline mt-2 cursor-pointer"
                >
                    FAQ
                </RouterLink>
            </div>

            <p class="mt-5">© 2025 faser</p>

            <div class="flex justify-center mt-3 text-2xl">
                <a href="https://github.com/faser-app">
                    <i class="fa-brands fa-github hover:text-[#4078c0]"></i>
                </a>
            </div>
            <p class="text-gray-400">Version: {{ config.public.appVersion }}</p>
        </div>
    </div>
</template>

<script setup>
import Cookie from 'js-cookie'
import currentPalette from '~/vars/getColors'

const config = useRuntimeConfig()
const mobile = ref(false)

const links = ref([
    {
        name: 'Imprint',
        url: '/imprint',
    },
    {
        name: 'ToS',
        url: '/tos',
    },
    {
        name: 'Cookie Policy',
        url: '/cookies',
    },
    {
        name: 'Privacy',
        url: '/privacy',
    },
    {
        name: 'Status Page',
        url: 'https://stats.uptimerobot.com/Ow7zN9GfBE',
    },
])

if (
    window.navigator.standalone &&
    window.navigator.userAgent.match(/(iPhone|iPod|iPad)/i)
) {
    mobile.value = true
}

function resetCookies() {
    Object.keys(Cookie.get()).forEach((cookie) => {
        Cookie.remove(cookie)
    })

    window.location.reload()
}
</script>
