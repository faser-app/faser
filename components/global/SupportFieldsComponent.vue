<template>
    <div class="w-full p-2 bg-gray-800 rounded-xl">
        <input type="email" class="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl" placeholder="Email"
            v-model="email" @input="errors.email = ''" :class="{ 'border border-red-500': errors.email }" />
        <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
        <input type="text" @input="errors.subject = ''"
            class="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl mt-2" placeholder="Subject"
            v-model="subject" :class="{ 'border border-red-500': errors.subject }" />
        <p v-if="errors.subject" class="text-red-500">{{ errors.subject }}</p>
        <textarea class="w-full p-2 bg-gray-800 border h-[20rem] border-gray-700 rounded-xl mt-2" placeholder="Message"
            v-model="message" @input="errors.message = ''"
            :class="{ 'border border-red-500': errors.message }"></textarea>
        <p v-if="errors.message" class="text-red-500">{{ errors.message }}</p>
        <button class="w-full h-10 bg-gray-700 text-white p-2 rounded-xl mt-2" @click="sendMessage">
            <div v-if="loading">
                <l-zoomies size="80" stroke="5" bg-opacity="0.1" speed="1.4" color="black"></l-zoomies>
            </div>
            <div v-else>
                Send
            </div>
        </button>
        <p class="text-green-500" v-if="success">Message sent successfully! (SupportId: {{ supportId }})</p>
    </div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";

const props = defineProps({
    predefinedSubject: {
        type: String,
        default: ""
    },
    predefinedMessage: {
        type: String,
        default: ""
    }
})

onMounted(() => {
    if (props.predefinedSubject) {
        subject.value = props.predefinedSubject
    }

    if (props.predefinedMessage) {
        message.value = props.predefinedMessage
    }
})

const email = ref("");
const subject = ref("");
const message = ref("");

const loading = ref(false);

const errors = ref([]);

const success = ref(false)

const supportId = ref(0)

function sendMessage() {
    if (!email.value) {
        errors.value.email = "Email is required";
    }

    if (!validateEmail(email.value)) {
        errors.value.email = "Email is invalid";
    }

    if (!subject.value) {
        errors.value.subject = "Subject is required";
    }

    if (!message.value) {
        errors.value.message = "Message is required";
    }

    if (errors.value.length > 0) {
        return;
    }

    loading.value = true;

    axios.post("https://api.faser.app/api/support/createSupportRequest", {
        email: email.value,
        subject: subject.value,
        message: message.value,
        token: Cookies.get("token")
    }).then((response) => {
        email.value = "";
        subject.value = "";
        message.value = "";
        loading.value = false

        success.value = true;

        supportId.value = response.data.supportId
    }).catch((err) => {
        console.log(err);
        alert("An error occurred. Please try again later.");
        loading.value = false;
    });
}

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}


</script>