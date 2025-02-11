<template>
    <transition name="fade" @leave="leave">
        <div v-if="props.showModal" :class="{ animation: props.showModal, fadeOut: !props.showModal }"
            @click.self="$emit('close')"
            class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur">
            <div class="bg-gray-900 max-h-[80svh] overflow-scroll p-5 rounded-md m-3 md:w-auto w-full" :class="{
                'border border-red-500': error,
            }">
                <div class="flex flex-wrap gap-2 w-full justify-center">
                    <div class="bg-gray-900 w-full flex justify-center items-center p-3 rounded-md">
                        <div class="flex flex-wrap justify-center">
                            <h1 class="text-xl font-bold mb-2">Edit Bio</h1>
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
            </div>
        </div>
    </transition>
</template>
<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const props = defineProps({
    showModal: Boolean,
})

const runtimeConfig = useRuntimeConfig()


let scrollpos = window.scrollY;

const bio = ref("")

watch(() => props.showModal, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})

const router = useRouter();
const error = ref("");

onMounted(() => {
    axios
        .get("https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile", {
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
        .post("https://" + runtimeConfig.public.apiUrlServer + "/api/profile/changeBio", {
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

<style scoped>
.animation {
    animation: fadeIn 0.25s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-leave-active {
    animation: faceOut 0.25s;
}

@keyframes faceOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>
