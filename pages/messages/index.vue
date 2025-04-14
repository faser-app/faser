<template>
    <div
        class="messages-list-page"
        :style="{ backgroundColor: currentPalette.bg }"
    >
        <MessagesList />

        <!-- Floating action button to start a new message -->
        <RouterLink
            to="/search"
            class="new-message-button"
            :style="{ backgroundColor: currentPalette.buttonPrimary }"
        >
            <i class="fa-solid fa-pen-to-square"></i>
        </RouterLink>
    </div>
</template>

<script setup>
import currentPalette from '~/vars/getColors'

// Set page metadata
useHead({
    title: 'Messages - faser',
    meta: [{ name: 'description', content: 'Your conversations on faser' }],
})
</script>

<style scoped>
.messages-list-page {
    position: relative;
    min-height: 100vh;
}

/* Floating action button for new message */
.new-message-button {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.25rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    z-index: 10;
}

.new-message-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
}

/* Media query for desktop screens */
@media (min-width: 768px) {
    .new-message-button {
        bottom: 30px;
    }
}
</style>
