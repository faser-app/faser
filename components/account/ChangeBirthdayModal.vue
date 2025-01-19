<template>
    <transition name="fade" @leave="leave">
        <div v-if="props.showModal" :class="{ animation: props.showModal, fadeOut: !props.showModal }"
            @click.self="$emit('close')"
            class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur">
            <div class="bg-gray-900 max-h-[80svh] overflow-scroll p-5 rounded-xl m-3 md:w-auto w-full" :class="{
                'border border-red-500': error,
            }">
                <div class="w-full flex justify-center">
                    <div
                        class="bg-sky-950 border border-sky-600 h-14 w-14 rounded-full flex justify-center items-center">
                        <i class="fa-solid fa-cake text-xl"></i>
                    </div>
                </div>
                <h2 class="text-center font-bold mt-2">Birthday</h2>

                <div class="flex justify-center text-center mt-2 text-gray-400">
                    <div class="md:w-96 w-full">
                        <input type="date" class="w-full p-2 rounded-xl bg-gray-800 text-white" v-model="birthday"
                            placeholder="Birthday" @input="error = ''" />
                        <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
                    <button @click="$emit('close')" class="md:w-2/3 bg-gray-700 p-2 rounded-xl">
                        Cancel
                    </button>
                    <button @click="addBirthday" class="md:w-1/3 bg-sky-500 p-2 rounded-xl">
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

const birthday = ref("");
const error = ref("");

const emit = defineEmits(["close"]);

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

axios
    .get("https://api.faser.app/api/account/getOwnProfile", {
        headers: {
            token: Cookies.get("token"),
        },
    })
    .then((response) => {
        birthday.value = response.data[1].birthday;
    })
    .catch((error) => {
        if (error.response.data.status === "error") {
            router.push("/login");
        }
    });

function addBirthday() {
    axios.post("https://api.faser.app/api/account/changeBirthday", {
        birthday: birthday.value,
        token: Cookies.get("token")
    })
        .then((response) => {
            emit("success", {
                birthday: birthday.value
            });
        })
        .catch((err) => {
            error.value = err.response.data.error;
        })
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
