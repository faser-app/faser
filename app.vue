<script setup>
useHead({
  title: "faser.app",
});
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <NuxtPage />
      <TailwindBreakpointIndicator />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style>
</style>
