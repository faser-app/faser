<template>
    <BaseModalComponent
        :isOpen="props.showModal"
        @close="$emit('close')"
        title="Rules"
        :showDefaultFooter="false"
        customClass="min-w-[50svw]"
        animationDirection="bottom"
    >
        <div
            class="flex break-all justify-center text-center mt-2 text-gray-400"
        >
            {{ props.rules }}
        </div>
        <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
            <button
                @click="$emit('close')"
                class="md:w-2/3 p-2 rounded-md"
                :style="{ backgroundColor: currentPalette.bgSecondary }"
            >
                Close
            </button>
        </div>
    </BaseModalComponent>
</template>

<script setup>
import currentPalette from '~/vars/getColors'
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'

const props = defineProps({
    showModal: Boolean,
    rules: String,
})

defineEmits(['close'])
</script>
