<template>
    <div class="min-h-screen bg-black px-2 text-white">
        <div v-if="isLoading" class="text-center mt-5">
            <div class="w-full justify-center">
                <div class="flex justify-center">
                    <PostFakePostComponent />
                </div>
                <div class="mt-5 rounded-xö flex justify-center">
                    <div class="flex flex-col max-w-[90rem] w-full overflow-hidden rounded-xl">
                        <div v-for="i in 10">
                            <PostFakePostComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="w-full justify-center">
                <div class="flex justify-center">
                    <PostGetPostComponent :postId="postId" :ownProfile="false" :ownProfileData="ownProfileData"
                        :account="accountData" class="rounded-xl" />
                </div>
                <div class="mt-5 rounded-xö flex justify-center">
                    <div class="flex flex-col max-w-[90rem] w-full overflow-hidden rounded-xl">
                        <div v-for="(comment, index) in comments" :key="comment">
                            <PostGetPostComponent :postId="comment" :ownProfile="ownProfileArray[index]"
                                :ownProfileData="ownProfileData" :account="accountData" />
                        </div>
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
const runtimeConfig = useRuntimeConfig()


const isLoading = ref(true);

onMounted(async () => {
    try {
        const postValue = await axios.get("https://" + runtimeConfig.public.apiUrlServer + "/api/social/fetchPost", {
            headers: {
                token: Cookies.get("token"),
                postId: postId.value
            }
        });

        comments.value = postValue.data[0].comments;

        const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile";

        const ownProfileValue = await axios.get(url, {
            headers: {
                token: Cookies.get("token")
            }
        });

        ownProfile.value = ownProfileValue.data;
        ownProfileData.value = ownProfileValue.data[0];
        accountData.value = ownProfileValue.data[1];

        for (let i = 0; i < postValue.data[0].comments.length; i++) {
            const commentValue = await axios.get("https://" + runtimeConfig.public.apiUrlServer + "/api/social/fetchPost", {
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