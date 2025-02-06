<script setup>
import currentPalette from '~/vars/getColors';
</script>

<template>
    <div class="min-h-screen" :style="{ backgroundColor: currentPalette.bg}">
        <LikesComponent />
    </div>
</template>