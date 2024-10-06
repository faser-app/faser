<template>
    <ProfileComponent />
</template>

<script setup>
import { useHead } from '#app';

useHead({
    title: 'Profile - faser.app',
    meta: [
        {
            name: "theme-color",
            content: "#000000"
        }
    ]
});
</script>