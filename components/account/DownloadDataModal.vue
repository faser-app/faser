<template>
    <BaseModalComponent
        :isOpen="showModal"
        @close="$emit('close')"
        title="Download Data"
        icon="id-card"
        iconBgColor="blue-950"
        iconBorderColor="blue-600"
        :error="error"
        submitText="Submit"
        animationDirection="bottom"
        submitButtonClass="bg-blue-500"
        @submit="submitUsernameChange"
    >
        <div class="flex justify-center text-center mt-2 text-gray-400">
            <div class="md:w-96 w-full">
                <p>Here you can Download your Data stored on faser</p>
                <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
            </div>
        </div>
    </BaseModalComponent>

    <BaseModalComponent
        :isOpen="showDownloadLink"
        @close="showDownloadLink = false"
        cancel-text="Close"
        submit-text="Delete"
        @submit="deleteFile"
        title="Your Download Link"
    >
        <div class="flex justify-center text-center mt-2 text-gray-400">
            <div class="md:w-96 w-full">
                <p>Here is your download link:</p>
                <a
                    :href="dataResponse.url"
                    target="_blank"
                    class="text-blue-500 hover:underline mt-2"
                >
                    {{ dataResponse.url }}
                </a>

                <p class="mt-2">
                    This file was requested on:
                    {{
                        new Date(dataResponse.requestedAt).toLocaleDateString()
                    }}
                </p>
                <p>
                    If you want to get an up to date version, you have to delete
                    the current one and request a new File.
                </p>
            </div>
        </div>
    </BaseModalComponent>
</template>
<script setup>
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
})

const showDownloadLink = ref(false)
const emit = defineEmits(['close'])
const runtimeConfig = useRuntimeConfig()

const router = useRouter()
const newUsername = ref('')
const error = ref('')
const dataResponse = ref({})

watch(
    () => props.showModal,
    (value) => {
        axios
            .post(baseURL + '/api/download/getCurrent', {
                token: Cookies.get('token'),
                lang: navigator.language || navigator.userLanguage,
            })
            .then((response) => {
                emit('close')
                dataResponse.value = response.data
                if (response.data.url) {
                    showDownloadLink.value = true
                } else {
                    showDownloadLink.value = false
                }

                console.log(response.data)
            })
            .catch((err) => {
                error.value = err.response.data.message
            })
    }
)

function submitUsernameChange() {
    axios
        .post(baseURL + '/api/download/requestDownload', {
            token: Cookies.get('token'),
            lang: navigator.language || navigator.userLanguage,
        })
        .then((response) => {
            emit('close')
            dataResponse.value = response.data
            showDownloadLink.value = true
        })
        .catch((err) => {
            error.value = err.response.data.message
        })
}

function deleteFile() {
    axios
        .post(baseURL + '/api/download/deleteDownloadFile', {
            token: Cookies.get('token'),
            lang: navigator.language || navigator.userLanguage,
        })
        .then((response) => {
            showDownloadLink.value = false
            dataResponse.value = {}
        })
        .catch((err) => {
            error.value = err.response.data.message
        })
    showDownloadLink.value = false
}
</script>
