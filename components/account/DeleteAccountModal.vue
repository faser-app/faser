<template>
    <BaseModalComponent :isOpen="props.showModal" @close="$emit('close')" title="Delete Account" icon="trash"
        iconBgColor="red-950" iconBorderColor="red-600" :error="error" animationDirection="bottom"
        submitButtonClass="bg-red-500" @submit="deleteAccount">
        <div class="flex justify-center text-center mt-2 text-gray-400">
            <div class="md:w-96 w-full">
                <input type="email" class="w-full p-2 rounded-md bg-gray-800 text-white" v-model="email"
                    placeholder="Email" @input="error = ''" />
                <input type="password" class="w-full p-2 rounded-md bg-gray-800 text-white mt-2" v-model="password"
                    placeholder="Password" @input="error = ''" />
                <input type="password" class="w-full mt-2 p-2 rounded-md bg-gray-800 text-white"
                    v-model="retypedPassword" placeholder="Retype Password" @input="error = ''" />
                <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
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

const router = useRouter();
const email = ref("");
const password = ref("");
const retypedPassword = ref("");
const error = ref("");

const runtimeConfig = useRuntimeConfig()

function deleteAccount() {
    axios.post(baseURL + "/api/account/deleteAccount", {
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
