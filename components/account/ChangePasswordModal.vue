<template>
    <BaseModalComponent
        :isOpen="showModal"
        @close="changePasswordModal(false)"
        title="Change Password"
        icon="key"
        iconBgColor="red-950"
        iconBorderColor="red-600"
        :error="error"
        animationDirection="bottom"
        submitButtonClass="bg-red-500"
        @submit="submitPassword"
    >
        <div class="flex justify-center text-center mt-2 text-gray-400">
            <div class="md:w-96 w-full">
                <input
                    type="email"
                    class="w-full p-2 rounded-md bg-gray-800 text-white"
                    v-model="email"
                    placeholder="Email"
                    @input="error = ''"
                />
                <input
                    type="password"
                    class="w-full p-2 rounded-md bg-gray-800 text-white mt-2"
                    v-model="password"
                    placeholder="Password"
                    @input="error = ''"
                />
                <input
                    type="password"
                    class="w-full p-2 rounded-md bg-gray-800 text-white mt-5"
                    v-model="newPassword"
                    placeholder="New Password"
                    @input="error = ''"
                />
                <input
                    type="password"
                    class="w-full mt-2 p-2 rounded-md bg-gray-800 text-white"
                    v-model="retypedPassword"
                    placeholder="Retype Password"
                    @input="error = ''"
                />
                <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
            </div>
        </div>
    </BaseModalComponent>
</template>
<script setup>
import { watch } from 'vue'
import {
    getModalState,
    changePasswordModal,
} from '~/scripts/account/changePassword'
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)
const email = ref('')
const password = ref('')
const newPassword = ref('')
const retypedPassword = ref('')
const error = ref('')

const runtimeConfig = useRuntimeConfig()

onMounted(() => {
    watch(getModalState(), (value) => {
        showModal.value = value
    })
})

function submitPassword() {
    if (newPassword.value !== retypedPassword.value) {
        error.value = 'Passwords do not match'
        return
    }

    axios
        .post(baseURL + '/api/account/changePassword', {
            oldToken: Cookies.get('token'),
            email: email.value,
            password: password.value,
            newPassword: newPassword.value,
            lang: navigator.language || navigator.userLanguage,
        })
        .then((response) => {
            changePasswordModal(false)
            Cookies.remove('token')
            Cookies.remove('tokenList')
            router.push('/profile')
        })
        .catch((err) => {
            error.value = err.response.data.message
        })
}
</script>
