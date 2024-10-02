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

        const computedPageMeta = computed(() => {
            return {
                title: response.response._data[0].displayName + ' - faser.app',
                meta: [
                    { hid: 'og-title', property: 'og:title', content: response.response._data[0].displayName },
                    { hid: 'og-description', property: 'og:description', content: response.response._data[0].bio },
                ]
            };
        });

        useHead(computedPageMeta);
    }
})
</script>

<template>
    <GetProfileComponent />
</template>