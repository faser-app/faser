<script setup>
useHead({
  title: "faser.app",
});
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <HeaderComponent />
      <NuxtPage />
      <TailwindBreakpointIndicator />
      <FooterComponent />
    </NuxtLayout>
  </TooltipProvider>
</template>

<style>
</style>
