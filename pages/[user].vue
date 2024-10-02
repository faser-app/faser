<script setup>
import GetProfileComponent from '~/components/account/profile/GetProfileComponent.vue';
import { useFetch, useHead } from '#app';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const url = "https://api.faser.app/api/account/getProfile/";

const username = route.params.user.replace("@", "");

const headers = {
    username: username,
    lang: navigator.language || navigator.userLanguage,
};

const { data, status, error } = useFetch(url, {
    headers: headers,
});

const computedPageMeta = computed(() => {
    if (data.value && data.value.length > 0) {
        return {
            title: data.value[0].displayName + ' - faser.app',
            meta: [
                { hid: 'og-title', property: 'og:title', content: data.value[0].displayName },
                { hid: 'og-description', property: 'og:description', content: data.value[0].bio },
            ]
        };
    }
    return {
        title: 'Loading...',
        meta: []
    };
});

useHead(computedPageMeta);
</script>

<template>
    <GetProfileComponent />
</template>