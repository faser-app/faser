<template>
    <div class="rounded-xl p-2 mx-2" :style="{ backgroundColor: currentPalette.bgSecondary }">
        <div v-if="postsValue == 0" class="h-36 flex justify-center items-center">
            <p class="italic text-gray-400">No saved Posts</p>
        </div>
        <div v-else v-for="(post, index) in loadedPosts" :key="post" class="w-full flex justify-center">
            <PostGetPostComponent :postId="post" ownProfile="false" :profile="profileData" :ownProfile="ownProfile"
                :account="accountData" :ownProfileData="ownProfileData" :border="index !== loadedPosts.length - 1" />
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


const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile"

onMounted(() => {
    axios.get(url, {
        headers: {
            token: Cookies.get("token")
        }
    }).then((response) => {

        postsValue.value = response.data[0].savedPosts.reverse()

        ownProfileData.value = response.data[0]

        accountData.value = response.data[1]

        ownProfile.value = response.data[0]

        profileData.value = response.data[0]

        loadPosts(5)
    })

})

document.addEventListener("scroll", (event) => {
    if (document.body.offsetHeight - 2000 < window.scrollY) {
        if (lastRequest.value + 1000 < Date.now()) {
            lastRequest.value = Date.now()

            loadPosts(5)
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