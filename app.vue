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
      <FooterComponent />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style>
</style>
