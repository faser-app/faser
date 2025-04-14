<script setup>
import currentPalette from '~/vars/getColors'

const props = defineProps({
    type: {
        type: String,
        default: 'primary',
    },
})
</script>

<template>
    <button
        :style="{
            backgroundColor:
                props.type === 'primary'
                    ? currentPalette.buttonPrimary
                    : props.type === 'secondary'
                      ? currentPalette.buttonSecondary
                      : currentPalette.buttonDanger,
            color: currentPalette.textSecondary,
        }"
    >
        <slot></slot>
    </button>
</template>
