<template>
    <div class="min-h-screen bg-gray-950 px-2 text-white">
        <div v-if="isLoading" class="text-center mt-5">Loading...</div>
        <div v-else>
            <div class="w-full justify-center">
                <PostGetPostComponent :postId="postId" :ownProfile="false" :ownProfileData="ownProfileData"
                    :account="accountData" />
                <div class="mt-5">
                    <div v-for="(comment, index) in comments" :key="comment">
                        <PostGetPostComponent :postId="comment" :ownProfile="ownProfileArray[index]"
                            :ownProfileData="ownProfileData" :account="accountData" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const comments = ref([]);
const ownProfile = ref([]);
const ownProfileData = ref([]);
const accountData = ref([]);
const ownProfileArray = ref([]);
const postId = ref(route.params.post);

const isLoading = ref(true);

onMounted(async () => {
    try {
        const postValue = await axios.get("https://api.faser.app/api/social/fetchPost", {
            headers: {
                token: Cookies.get("token"),
                postId: postId.value
            }
        });

        comments.value = postValue.data[0].comments;

        const url = "https://api.faser.app/api/account/getOwnProfile";

        const ownProfileValue = await axios.get(url, {
            headers: {
                token: Cookies.get("token")
            }
        });

        ownProfile.value = ownProfileValue.data;
        ownProfileData.value = ownProfileValue.data[0];
        accountData.value = ownProfileValue.data[1];

        for (let i = 0; i < postValue.data[0].comments.length; i++) {
            const commentValue = await axios.get("https://api.faser.app/api/social/fetchPost", {
                headers: {
                    token: Cookies.get("token"),
                    postId: postValue.data[0].comments[i]
                }
            });

            if (commentValue.data[0].authorId === ownProfileData.value.id) {
                ownProfileArray.value.push(true);
            } else {
                ownProfileArray.value.push(false);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
});
</script>