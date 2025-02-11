<template>
    <div class="flex mb-4 justify-center text-center" :style="{ backgroundColor: currentPalette.bg}">
        <div class="w-1/2 p-2 cursor-pointer" @click="category = 'post'" :class="{
            'border-b border-gray-400': category === 'post'
        }">
            <p>Posts</p>
        </div>
        <div class="w-1/2 p-2 cursor-pointer" @click="category = 'community'" :class="{
            'border-b border-gray-400': category === 'community'
        }">
            <p>Community</p>
        </div>
    </div>

    <div v-show="category === 'post'" class="rounded-md p-2 mx-2 mb-2"
        :style="{ backgroundColor: currentPalette.bgSecondary }">
        <p class="mb-2 text-gray-300">{{ postsValue.length }} results</p>
        <div v-if="postsValue == 0" class="h-36 flex justify-center items-center">
            <p class="italic text-gray-400">No liked Posts</p>
        </div>
        <div v-else v-for="(post, index) in loadedPosts" :key="post" class="w-full flex justify-center">
            <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
                :account="accountData" :ownProfileData="ownProfileData" :border="index !== loadedPosts.length - 1" />
        </div>
    </div>

    <div v-show="category === 'community'" class="rounded-md p-2 mx-2 mb-2"
        :style="{ backgroundColor: currentPalette.bgSecondary }">
        <p class="mb-2 text-gray-300">{{ communityValue.length }} results</p>
        <div v-if="communityValue == 0" class="h-36 flex justify-center items-center">
            <p class="italic text-gray-400">No liked Communities</p>
        </div>
        <div v-else v-for="(community, index) in communityLoaded" :key="community" class="w-full flex justify-center">
            <PostGetPostComponent :post-id="community" ownProfile="false" :profile="profileData"
                :ownProfile="ownProfile" :account="accountData" :ownProfileData="ownProfileData"
                :border="index !== communityLoaded.length - 1" />
        </div>
    </div>

</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import currentPalette from "~/vars/getColors";

const postsValue = ref([]);
const loadedPosts = ref([]);
const ownProfileData = ref({});
const lastRequest = ref(0)
const postIndex = ref(0)
const accountData = ref([])
const ownProfile = ref([])
const profileData = ref([])
const runtimeConfig = useRuntimeConfig()
const category = ref("post")
const communityIndex = ref(0)
const communityValue = ref([])
const communityLoaded = ref([])
const communityLastRequest = ref(0)

watch(category, () => {
    loadPosts(25)
})

const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/profile/likedPosts"

axios.post(url, {
    token: Cookies.get("token")
})
    .then((response) => {
        postsValue.value = response.data.post.reverse()
        communityValue.value = response.data.community.reverse()
    })

axios.get("https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile", {
    headers: {
        token: Cookies.get("token")
    }
})
    .then((response) => {

        console.log(response.data)

        ownProfileData.value = response.data[0]

        accountData.value = response.data[1]

        ownProfile.value = response.data[0]

        profileData.value = response.data[0]

        loadPosts(25)
    })

document.addEventListener("scroll", (event) => {
    if (document.body.offsetHeight - 8000 < window.scrollY) {
        if (lastRequest.value + 1000 < Date.now() && category.value === "post") {
            lastRequest.value = Date.now()

            loadPosts(25)
        }

        if (communityLastRequest.value + 1000 < Date.now() && category.value === "community") {
            communityLastRequest.value = Date.now()

            loadPosts(25)
        }
    }
})

function loadPosts(postsToLoad) {
    for (let i = 0; i < postsToLoad; i++) {

        if (postIndex.value < postsValue.value.length && category.value === "post") {
            loadedPosts.value.push(postsValue.value[postIndex.value])
            postIndex.value++
        }

        if (communityIndex.value < communityValue.value.length && category.value === "community") {
            communityLoaded.value.push(communityValue.value[communityIndex.value])
            communityIndex.value++
        }
    }
}

</script>