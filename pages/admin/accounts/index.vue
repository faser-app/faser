<template>
    <div class="min-h-screen text-white px-2">
        <div class="flex w-full gap-2" v-if="loaded">
            <div class="w-1/2">
                <h1>Active Accounts</h1>

                <div v-for="account in activeAccounts" :key="account.id">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="flex justify-between w-full border-b border-gray-500 pb-2">
                            <div class="flex items-center gap-2">
                                <img :src="'https://s3.faser.app/profilepictures/' + account.id + '/image.png' + '?t=' + new Date().getTime()"
                                    class="h-12 w-12 rounded-full" />
                                <div>
                                    <p>{{ account.username }}</p>
                                </div>
                            </div>
                            <div>
                                <button class="bg-red-500 px-2 py-1 rounded" @click="terminateAccount(account.id)">
                                    Terminate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-r border-gray-700 min-h-screen"></div>
            <div class="w-1/2">
                <h1>Terminated Accounts</h1>

                <div v-for="account in terminatedAccounts" :key="account.id">
                    <div class="flex items-center gap-2">
                        <img :src="'https://s3.faser.app/profilepictures/' + account.id + '/image.png' + '?t=' + new Date().getTime()"
                            class="h-12 w-12 rounded-full" />
                        <div>
                            <p>{{ account.displayName }}</p>
                            <p>{{ account.username }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'

const token = Cookies.get('token')
const terminatedAccounts = ref([])
const activeAccounts = ref([])
const loaded = ref(false)
const runtimeConfig = useRuntimeConfig()


onMounted(() => {
    loadList()
})

function loadList() {
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/admin/getAccounts", {
        token: token
    })
        .then((response) => {
            terminatedAccounts.value = response.data.terminatedProfiles
            activeAccounts.value = response.data.activeProfiles
        })
}

function terminateAccount(id) {
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/admin/terminateAccount", {
        token: token,
        accountId: id
    })
        .then((response) => {
            loadList()
        })
}

axios.get("https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile", {
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