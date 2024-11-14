<template>
    <transition name="fade" @leave="leave">
        <div v-if="props.showModal" :class="{ animation: props.showModal, fadeOut: !props.showModal }"
            @click.self="$emit('close')"
            class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur">
            <div class="bg-gray-900 p-5 rounded-xl m-3 md:w-auto w-full" :class="{
                'border border-red-500': error,
            }">
                <div class="w-full flex justify-center">
                    <div
                        class="bg-red-950 border border-red-600 h-14 w-14 rounded-full flex justify-center items-center">
                        <i class="fa-solid fa-trash text-xl"></i>
                    </div>
                </div>
                <h2 class="text-center font-bold mt-2">Delete Account</h2>
                <div class="flex justify-center text-center mt-2 text-gray-400">
                    <div class="md:w-96 w-full">
                        <input type="email" class="w-full p-2 rounded-xl bg-gray-800 text-white" v-model="email"
                            placeholder="Email" @input="error = ''" />
                        <input type="password" class="w-full p-2 rounded-xl bg-gray-800 text-white mt-2"
                            v-model="password" placeholder="Password" @input="error = ''" />
                        <input type="password" class="w-full mt-2 p-2 rounded-xl bg-gray-800 text-white"
                            v-model="retypedPassword" placeholder="Retype Password" @input="error = ''" />
                        <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
                    <button @click="$emit('close')" class="md:w-2/3 bg-gray-700 p-2 rounded-xl">
                        Cancel
                    </button>
                    <button @click="deleteAccount" class="md:w-1/3 bg-red-500 p-2 rounded-xl">
                        Submit
                    </button>
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

let scrollpos = window.scrollY;

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
const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const error = ref("");


function deleteAccount() {
    axios.post("https://api.faser.app/api/account/deleteAccount", {
        "token": Cookies.get("token"),
        "password": password.value,
        "email": email.value
    })
        .then((response) => {
            Cookies.remove("token");
            router.push("/");
        })
        .catch((error) => {
            error.value = error.response.data.message;
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
