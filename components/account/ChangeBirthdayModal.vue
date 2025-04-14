<template>
    <BaseModalComponent
        :isOpen="props.showModal"
        @close="$emit('close')"
        title="Birthday"
        icon="cake"
        iconBgColor="sky-950"
        iconBorderColor="sky-600"
        :error="error"
        submitText="Submit"
        animationDirection="bottom"
        submitButtonClass="bg-sky-500"
        @submit="addBirthday"
        customClass="max-h-[80svh] overflow-scroll"
    >
        <div class="flex justify-center text-center mt-2 text-gray-400">
            <div class="md:w-96 w-full">
                <input
                    type="date"
                    class="w-full p-2 rounded-md bg-gray-800 text-white"
                    v-model="birthday"
                    placeholder="Birthday"
                    @input="error = ''"
                />
                <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
            </div>
        </div>
    </BaseModalComponent>
</template>
<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'

const birthday = ref('')
const error = ref('')
const router = useRouter()

const runtimeConfig = useRuntimeConfig()

const emit = defineEmits(['close', 'success'])

const props = defineProps({
    showModal: Boolean,
})

onMounted(() => {
    axios
        .get(baseURL + '/api/account/getOwnProfile', {
            headers: {
                token: Cookies.get('token'),
            },
        })
        .then((response) => {
            birthday.value = response.data[1].birthday
        })
        .catch((error) => {
            if (error.response.data.status === 'error') {
                router.push('/login')
            }
        })
})

function addBirthday() {
    axios
        .post(baseURL + '/api/account/changeBirthday', {
            birthday: birthday.value,
            token: Cookies.get('token'),
        })
        .then((response) => {
            emit('success', {
                birthday: birthday.value,
            })
        })
        .catch((err) => {
            error.value = err.response.data.error
        })
}
</script>
