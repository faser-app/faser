<template>
    <div class="min-h-[calc(100vh-4.5rem)] text-white">
        <div v-for="post in posts" :key="post.id">
            <PostGetPostComponent
                :postId="post.postId"
                ownProfile="true"
                :profile="profileData"
                :ownProfile="ownProfile"
                :account="accountData"
                :ownProfileData="ownProfileData"
                :admin="true"
            />
        </div>

        <div v-if="posts.length == 0" class="w-full flex justify-center">
            <p>No disabled posts</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const token = Cookies.get('token')
const router = useRouter()
const posts = ref([])
const profileData = ref({})
const ownProfile = ref(false)
const accountData = ref({})
const ownProfileData = ref({})

const runtimeConfig = useRuntimeConfig()

axios
    .get(baseURL + '/api/account/getOwnProfile', {
        headers: {
            token: token,
        },
    })
    .then((response) => {
        if (!response.data[1].admin) {
            router.push('/?error=You%20are%20not%20an%20admin')
        }

        profileData.value = response.data[0]
        accountData.value = response.data[1]
        ownProfileData.value = response.data[0]
        ownProfile.value = true

        axios
            .post(baseURL + '/api/admin/getDisabledPosts', {
                token: token,
            })
            .then((response) => {
                posts.value = response.data
            })
    })
    .catch((error) => {
        router.push('/?error=You%20are%20not%20an%20admin')
    })
</script>
