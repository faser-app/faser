<template>
    <div class="absolute -mt-5 mx-2 bg-gray-800 p-3 w-10 h-10 flex items-center justify-center rounded-xl text-red-500 cursor-pointer"
        v-if="hover && message.sender === ownProfile[0].id" @mouseenter="hover = true" @mouseleave="hover = false"
        @click="deleteMessage">
        <i class="fa-solid fa-trash"></i>
    </div>
    <div class="p-2 rounded-xl m-2 max-w-[80svw]" @mouseenter="hover = true" :class="{
        'bg-gradient-to-tl from-gray-700 to-gray-800': message.sender === ownProfile[0].id,
        'bg-gradient-to-tr from-gray-700 to-gray-800': message.sender === profile[0].id,
    }" @mouseleave="hover = false">
        <p class="break-words ph-no-capture" v-html="convertedToUrl(message.message)"></p>
        <div class="w-full flex" :class="{
            'justify-start': message.sender === profile[0].id,
            'justify-end': message.sender === ownProfile[0].id,
        }">
            <p class="text-xs text-gray-400">{{
                DateTime.fromISO(message.time).toLocaleString(DateTime.DATETIME_MED) }}</p>
        </div>
    </div>
</template>

<script setup>
import { DateTime } from "luxon";
import axios from "axios";
import Cookies from "js-cookie";

function deleteMessage() {
    axios.post("https://api.faser.app/api/messages/deleteDM", {
        token: Cookies.get("token"),
        messageId: props.message.id,
        otherAccount: props.profile[0].id,
    })
        .then(() => { })
}

const hover = ref(false)

const urlRegix = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

function convertedToUrl(message) {
    var words = message.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (urlRegix.test(words[i])) {
            words[i] = '<a href="' + words[i] + '" target="_blank" class="underline">' + words[i] + '</a>';
        }
    }
    return words.join(" ");
}


const props = defineProps({
    message: Object,
    profile: Object,
    ownProfile: Object,
})
</script>