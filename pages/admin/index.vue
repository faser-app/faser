<template>
    <div class="min-h-screen">
        <div class="flex w-full justify-center gap-4 mt-2" v-if="loaded">
            <RouterLink to="/admin/posts" class="py-3 px-5 rounded-md bg-gray-800 text-white">Posts</RouterLink>
            <RouterLink to="/admin/accounts" class="py-3 px-5 rounded-md bg-gray-800 text-white">Accounts</RouterLink>
        </div>
        <div class="flex w-full justify-center mt-2">
            <button @click="restart" class="py-3 px-5 rounded-md bg-gray-800 text-white">
                Restart API
            </button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router';
const runtimeConfig = useRuntimeConfig()


const token = Cookies.get('token')
const router = useRouter()
const loaded = ref(false)

function restart() {
    axios.post(baseURL + "/api/admin/restart", {
        token: token
    })
}

axios.get(baseURL + "/api/account/getOwnProfile", {
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