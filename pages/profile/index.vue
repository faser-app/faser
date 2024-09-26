<template>
    <ProfileComponent />
</template>

<script setup>
import { useHead } from '#app';

useHead({
    title: 'Profile - faser.app',
    meta: [
        {
            name: 'description',
            content: 'This is the profile page'
        }
    ]
});
</script>