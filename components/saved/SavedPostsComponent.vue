<template>
    <div class="px-2">
        <div v-if="postsValue == 0" class="h-36 flex justify-center items-center">
            <p class="italic text-gray-400">No saved Posts</p>
        </div>
        <div v-else v-for="post in loadedPosts" :key="post" class="w-full block">
            <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
                :account="accountData" :ownProfileData="ownProfileData" />
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";

const postsValue = ref([]);
const loadedPosts = ref([]);
const ownProfileData = ref({});
const lastRequest = ref(0)
const postIndex = ref(0)
const accountData = ref([])
const ownProfile = ref([])
const profileData = ref([])

const url = "https://api.faser.app/api/account/getOwnProfile"

axios.get(url, {
    headers: {
        token: Cookies.get("token")
    }
}).then((response) => {

    postsValue.value = response.data[0].savedPosts

    ownProfileData.value = response.data[0]

    accountData.value = response.data[1]

    ownProfile.value = response.data[0]

    profileData.value = response.data[0]

    loadPosts(3)
})

document.addEventListener("scroll", (event) => {
    if (document.body.offsetHeight - 2000 < window.scrollY) {
        if (lastRequest.value + 1000 < Date.now()) {
            lastRequest.value = Date.now()

            loadPosts(3)
        }
    }
})

function loadPosts(postsToLoad) {
    for (let i = 0; i < postsToLoad; i++) {
        if (postIndex.value < postsValue.value.length) {
            loadedPosts.value.push(postsValue.value[postIndex.value])
            postIndex.value++
        }
    }
}

</script>