<template>
  <MainComponent />
</template>
<script setup>
import { useHead } from '#app';

useHead({
  title: 'Home - faser.app',
  meta: [
    {
      name: 'description',
      content: 'This is the home page'
    }
  ]
});
</script>