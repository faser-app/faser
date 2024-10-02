<script setup>
import GetProfileComponent from '~/components/account/profile/GetProfileComponent.vue';
import { useFetch, useHead } from '#app';
import { useRoute } from 'vue-router';

const route = useRoute();

const url = "https://api.faser.app/api/account/getProfile/";

const username = route.params.user.replace("@", "");

const { data, status, error } = useFetch(url, {
    headers: {
        username: username,
        lang: navigator.language || navigator.userLanguage,
    },

    onResponse(response) {
        console.log(response.response._data)

        useHead({
            title: response.response._data[0].displayName + ' - faser.app',
            meta: [
                {
                    name: "og:title",
                    content: response.response._data[0].displayName + ' - faser.app'
                },
                {
                    name: "og:description",
                    content: response.response._data[0].bio
                },
                {
                    name: "og:image",
                    content: "https://api.faser.app/api/profile/getProfilePhoto?username=" + response.response._data[0].username
                },
                {
                    name: "og:url",
                    content: "https://faser.app/" + response.response._data[0].username
                }
            ]
        })
    }
})
</script>

<template>
    <GetProfileComponent />
</template>