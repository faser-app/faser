<template>
    <div class="message-page-wrapper" :style="{ backgroundColor: currentPalette.bg }">
        <MessageComponent />
    </div>
</template>

<script setup>
import currentPalette from '~/vars/getColors';

// Set metadata for the page
useHead({
    title: 'Chat - faser',
    meta: [
        { name: 'description', content: 'Chat with your connections on faser' }
    ]
})
</script>

<style scoped>
.message-page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
</style>