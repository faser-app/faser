<script setup>
import GetProfileComponent from '~/components/account/profile/GetProfileComponent.vue';
import { definePageMeta } from '#imports';

definePageMeta({
    middleware: "profile-meta"
})
</script>

<template>
    <GetProfileComponent />
</template>