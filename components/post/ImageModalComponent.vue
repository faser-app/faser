<template>
    <BaseModalComponent :isOpen="isOpen" @close="$emit('close')"
        customClass="p-0 bg-transparent max-w-[90vw] max-h-[90vh]" :showDefaultFooter="false"
        animationDirection="bottom">
        <div class="image-carousel w-full h-full" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
            @touchend="handleTouchEnd" :style="{ transform: `translateY(${translateY}px)` }"
            :class="{'transition-back': !isDragging}">
            <img :src="imageSrc" class="full-image max-w-full max-h-[90vh] object-contain"
                @click.self="$emit('close')" />
        </div>
    </BaseModalComponent>
</template>
<script setup>
import BaseModalComponent from "~/components/ui/BaseModalComponent.vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    imageSrc: {
        type: String,
        required: true
    }
});

defineEmits(['close']);

const isDragging = ref(false);
const startY = ref(0);
const currentY = ref(0);
const translateY = ref(0);

const handleTouchStart = (event) => {
    isDragging.value = true;
    startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
    if (!isDragging.value) return;
    currentY.value = event.touches[0].clientY;
    if (currentY.value - startY.value > 0) {
        translateY.value = currentY.value - startY.value;
    }
};

const handleTouchEnd = () => {
    isDragging.value = false;

    if (translateY.value > 200) {
        $emit('close');
    }
    translateY.value = 0;
};
</script>

<style scoped>
.transition-back {
    transition: transform 0.3s ease-out;
}

.full-image {
    width: auto;
    height: auto;
    margin: auto;
}
</style>