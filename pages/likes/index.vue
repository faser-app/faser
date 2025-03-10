<script setup>
import currentPalette from '~/vars/getColors';
</script>

<template>
    <div class="min-h-[calc(100vh-4.5rem)]" :style="{ backgroundColor: currentPalette.bg}">
        <LikesComponent />
    </div>
</template>