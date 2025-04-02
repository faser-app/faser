<template>
    <BaseModalComponent :isOpen="isOpen" @close="$emit('close')" title="Delete Post?" icon="trash" :isDanger="true"
        submitText="Delete" @submit="$emit('delete')">
        <div class="flex justify-center text-center mt-2" :style="{ color: currentPalette?.textSecondary }">
            <div class="md:w-96 w-full">
                <p>Do you really want to delete this post?</p>
            </div>
        </div>
    </BaseModalComponent>
</template>
<script setup>
import BaseModalComponent from "~/components/ui/BaseModalComponent.vue";
import currentPalette from "~/vars/getColors";

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

defineEmits(['close', 'delete']);
</script>