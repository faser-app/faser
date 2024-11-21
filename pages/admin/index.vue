<template>
    <div class="min-h-screen">
        <div class="flex w-full justify-center gap-4 mt-2" v-if="loaded">
            <RouterLink to="/admin/posts" class="py-3 px-5 rounded-xl bg-gray-800 text-white">Posts</RouterLink>
            <RouterLink to="/admin/accounts" class="py-3 px-5 rounded-xl bg-gray-800 text-white">Accounts</RouterLink>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router';

const token = Cookies.get('token')
const router = useRouter()
const loaded = ref(false)

axios.get("https://api.faser.app/api/account/getOwnProfile", {
    headers: {
        token: token
    }
})
    .then((response) => {
        if (!response.data[1].admin) {
            router.push("/?error=You%20are%20not%20an%20admin")
        } else {
            loaded.value = true
        }

    })
    .catch((error) => {
        router.push("/?error=You%20are%20not%20an%20admin")
    })

</script>