<script setup>
import currentPalette from '~/vars/getColors'
</script>

<template>
    <div class="min-h-[calc(100vh-4.5rem)]">
        <div class="flex w-full justify-center">
            <RouterLink to="/communities/create">
                <button
                    class="rounded-md px-4 py-2"
                    :style="{
                        backgroundColor: currentPalette.bgSecondary,
                        color: currentPalette.textPrimary,
                    }"
                >
                    Create Community
                </button>
            </RouterLink>
        </div>
    </div>
</template>
