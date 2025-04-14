<template>
    <BaseModalComponent
        :isOpen="isOpen"
        @close="$emit('close')"
        customClass="p-0 bg-transparent max-w-[90vw] max-h-[90vh]"
        :showDefaultFooter="false"
        animationDirection="bottom"
    >
        <div
            class="image-carousel w-full h-full relative"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            :style="{ transform: `translateY(${translateY}px)` }"
            :class="{ 'transition-back': !isDragging }"
        >
            <img
                :src="currentImage"
                class="full-image max-w-full max-h-[90vh] object-contain"
            />

            <div v-if="hasMultipleImages" class="navigation-arrows">
                <button
                    @click.stop="prevImage"
                    class="nav-arrow left-arrow"
                    :class="{ disabled: currentIndex === 0 }"
                >
                    <i class="fa-solid fa-chevron-left"></i>
                </button>

                <button
                    @click.stop="nextImage"
                    class="nav-arrow right-arrow"
                    :class="{
                        disabled: currentIndex === imagesList.length - 1,
                    }"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <div v-if="hasMultipleImages" class="image-counter">
                {{ currentIndex + 1 }} / {{ imagesList.length }}
            </div>
        </div>
    </BaseModalComponent>
</template>
<script setup>
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    imageSrc: {
        type: String,
        required: false,
        default: '',
    },
    imagesList: {
        type: Array,
        required: false,
        default: () => [],
    },
    startIndex: {
        type: Number,
        required: false,
        default: 0,
    },
})

defineEmits(['close'])

const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const translateY = ref(0)
const startX = ref(0)
const currentX = ref(0)
const translateX = ref(0)
const currentIndex = ref(props.startIndex)

watch(
    () => props.isOpen,
    (newValue) => {
        if (newValue) {
            currentIndex.value = props.startIndex
        }
    }
)

const currentImage = computed(() => {
    if (props.imagesList && props.imagesList.length > 0) {
        return props.imagesList[currentIndex.value]
    }
    return props.imageSrc
})

const hasMultipleImages = computed(() => {
    return props.imagesList && props.imagesList.length > 1
})

const nextImage = () => {
    if (currentIndex.value < props.imagesList.length - 1) {
        currentIndex.value++
    }
}

const prevImage = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
    }
}

const handleTouchStart = (event) => {
    isDragging.value = true
    startY.value = event.touches[0].clientY
    startX.value = event.touches[0].clientX
}

const handleTouchMove = (event) => {
    if (!isDragging.value) return

    currentY.value = event.touches[0].clientY
    currentX.value = event.touches[0].clientX

    const diffY = currentY.value - startY.value
    const diffX = currentX.value - startX.value

    if (Math.abs(diffX) > Math.abs(diffY) && hasMultipleImages.value) {
        translateX.value = diffX
        translateY.value = 0
    } else if (diffY > 0) {
        translateY.value = diffY
        translateX.value = 0
    }
}

const handleTouchEnd = () => {
    isDragging.value = false

    if (translateY.value > 200) {
        $emit('close')
    }

    if (Math.abs(translateX.value) > 100 && hasMultipleImages.value) {
        if (translateX.value > 0 && currentIndex.value > 0) {
            prevImage()
        } else if (
            translateX.value < 0 &&
            currentIndex.value < props.imagesList.length - 1
        ) {
            nextImage()
        }
    }

    translateY.value = 0
    translateX.value = 0
}

const handleKeyDown = (event) => {
    if (!props.isOpen || !hasMultipleImages.value) return

    if (event.key === 'ArrowRight') {
        nextImage()
    } else if (event.key === 'ArrowLeft') {
        prevImage()
    } else if (event.key === 'Escape') {
        $emit('close')
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
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

.navigation-arrows {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
}

.nav-arrow {
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0 20px;
    pointer-events: auto;
    transition: background-color 0.2s;
}

.nav-arrow:hover {
    background-color: rgba(0, 0, 0, 0.6);
}

.nav-arrow.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.image-counter {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
}
</style>
