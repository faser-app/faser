<template>
    <div class="min-h-screen text-white">
        <div v-for="post in posts" :key="post.id">
            <PostGetPostComponent :postId="post.postId" ownProfile="true" :profile="profileData" :ownProfile="ownProfile"
                :account="accountData" :ownProfileData="ownProfileData" :admin="true" />
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router';

const token = Cookies.get('token')
const router = useRouter()
const posts = ref([])
const profileData = ref({})
const ownProfile = ref(false)
const accountData = ref({})
const ownProfileData = ref({})

axios.get("https://api.faser.app/api/account/getOwnProfile", {
    headers: {
        token: token
    }
})
.then((response) => {
    if(!response.data[1].admin) {
        router.push("/?error=You%20are%20not%20an%20admin")
    }

    profileData.value = response.data[0]
    accountData.value = response.data[1]
    ownProfileData.value = response.data[0]
    ownProfile.value = true

    axios.post("https://api.faser.app/api/admin/getDisabledPosts", {
        token: token
    })
    .then((response) => {
        posts.value = response.data
    })
})
</script>