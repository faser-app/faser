<script setup>
import { definePageMeta } from '#imports';
import { useHead } from '#imports';

useHead({
    meta: [
        {
            name: "theme-color",
            content: "#000000"
        }
    ]
})

definePageMeta({
    middleware: "post-meta"
})
</script>

<template>
    <PostsPostPageComponent />
</template>
