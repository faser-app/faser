<template>
    <div class="min-h-screen flex justify-center mt-4">
        <MessagesComponent :messages="messages" :standalone="mobile" @clear-messages="messages = []" />
    </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";

const messages = ref([]);
const mobile = ref(false)
const runtimeConfig = useRuntimeConfig()


axios.post(baseURL + "/api/profile/getUserMessages", {
    token: Cookies.get("token")
})
    .then((response) => {
        messages.value = response.data.messages
    });

if (window.navigator.standalone && window.navigator.userAgent.match(/(iPhone|iPod|iPad|Macintosh)/i)) {
    mobile.value = true
}
</script>