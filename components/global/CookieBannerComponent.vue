<template>
    <div class="w-full">
        <div class="fixed right-0 bottom-20 md:right-4 md:max-w-[30svw] text-white bg-gray-900 p-4 rounded-xl">
            <div class="flex-1">
                <p class="text-sm">We use essential cookies to ensure the proper functioning of our website. These
                    cookies are necessary for the website to operate and cannot be turned off. Additionally, we use
                    analytics
                    cookies to help us improve our services. You can choose to accept or reject these analytics cookies.
                    For more details, please see our <RouterLink to="/privacy" class="underline">Privacy Policy
                    </RouterLink>.</p>
            </div>
            <div class="flex mt-2">
                <button class="bg-gray-700 text-white py-1 px-4 rounded" @click="acceptEssentialCookies">Only
                    Essential</button>
                <button class="bg-gray-700 text-white py-1 px-4 ml-2 rounded" @click="acceptAllCookies">Accept
                    All</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Cookies from "js-cookie"

function acceptAllCookies() {
    Cookies.set("accepted", true, { expires: 365 });

    window.location.reload();
}

function acceptEssentialCookies() {
    Cookies.set("essential", true, { expires: 365 });

    window.location.reload();
}
</script>