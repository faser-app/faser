<template>
    <div class="w-full">
        <div class="fixed bottom-0 right-0 md:bottom-4 md:right-4 md:max-w-[30svw] text-white bg-gray-900 p-4 rounded-xl">
            <div class="flex-1">
                <p class="text-sm">We use essential cookies to ensure the proper functioning of our website. These
                    cookies
                    are necessary for the website to operate and cannot be turned off. By continuing to use our website,
                    you
                    agree to our use of cookies. For more details, please see our <RouterLink to="/privacy"
                        class="underline">Privacy Policy</RouterLink>.</p>
            </div>
            <button class="bg-gray-700 text-white mt-2 py-1 px-4 rounded" @click="acceptCookies">Accept</button>
        </div>
    </div>
</template>

<script setup>
import Cookies from "js-cookie"

function acceptCookies() {
    Cookies.set("accepted", true, { expires: 365 })
    window.location.reload()
}
</script>