<script setup>
import currentPalette from '~/vars/getColors';
</script>

<template>
    <div class="min-h-screen" :style="{ backgroundColor: currentPalette.bg}">
        <h1 class="text-2xl font-bold mb-2 ml-2">Your saved Posts</h1>
        <SavedPostsComponent />
    </div>
</template>