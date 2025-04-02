<template>
    <BaseModalComponent :isOpen="props.showModal" @close="$emit('close')" title="Edit Bio"
        customClass="max-h-[80svh] overflow-scroll" :error="bioError" animationDirection="bottom"
        :showDefaultFooter="false">
        <div class="flex flex-wrap gap-2 w-full justify-center">
            <div class="bg-gray-900 w-full flex justify-center items-center p-3 rounded-md">
                <div class="flex flex-wrap justify-center">
                    <div class="w-full"></div>
                    <textarea v-model="bio" class="w-full p-2 rounded-md bg-gray-800 text-white" :class="{
            'border border-red-500': bioError,
          }" rows="5" cols="50" @input="bioError = ''"></textarea>
                    <div class="text-center">
                        <button class="p-2 bg-gray-700 mt-1 rounded-md" @click="saveBio">
                            Save
                        </button>
                        <p v-if="bioError" class="text-red-500 mt-2">{{ bioError }}</p>
                    </div>
                </div>
            </div>
        </div>
    </BaseModalComponent>
</template>
<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import BaseModalComponent from "~/components/ui/BaseModalComponent.vue";

const props = defineProps({
    showModal: Boolean,
})

defineEmits(['close']);

const runtimeConfig = useRuntimeConfig()
const bio = ref("")
const router = useRouter();
const bioError = ref("");

onMounted(() => {
    axios
        .get(baseURL + "/api/account/getOwnProfile", {
            headers: {
                token: Cookies.get("token"),
            },
        })
        .then((response) => {
            bio.value = response.data[0].bio
        })
        .catch((error) => {
            if (error.response.data.status === "error") {
                router.push("/login");
            }
        });
})

function saveBio() {
    axios
        .post(baseURL + "/api/profile/changeBio", {
            token: Cookies.get("token"),
            bio: bio.value,
            lang: navigator.language || navigator.userLanguage,
        })
        .then((response) => {
            router.push("/profile");
        })
        .catch((error) => {
            bioError.value = error.response.data.message;
        });
}
</script>
