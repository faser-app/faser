<template>
    <transition :name="transitionName" @leave="onLeave">
        <div
            v-if="isOpen"
            class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur-sm modal-overlay"
            @click.self="$emit('close')"
        >
            <div
                class="p-5 rounded-md m-3 md:w-auto w-full modal-container"
                :class="[
                    customClass,
                    {
                        'border border-red-500': error,
                    },
                ]"
                :style="{
                    backgroundColor: currentPalette?.bg,
                    color: currentPalette?.textPrimary,
                    ...containerStyle,
                }"
            >
                <div v-if="icon" class="w-full flex justify-center">
                    <div
                        :class="`border h-14 w-14 rounded-full flex justify-center items-center`"
                        :style="{
                            backgroundColor: iconBgStyle,
                            borderColor: iconBorderStyle,
                        }"
                    >
                        <i :class="`fa-solid fa-${icon} text-xl`"></i>
                    </div>
                </div>
                <h2 v-if="title" class="text-center font-bold my-2">
                    {{ title }}
                </h2>

                <slot></slot>

                <div v-if="$slots.footer" class="mt-4">
                    <slot name="footer"></slot>
                </div>
                <div
                    v-else-if="showDefaultFooter"
                    class="flex flex-col md:flex-row justify-center gap-2 mt-4"
                >
                    <button
                        v-if="showCloseButton"
                        @click="$emit('close')"
                        class="md:w-2/3 p-2 rounded-md"
                        :style="{
                            backgroundColor: currentPalette?.buttonSecondary,
                            color: currentPalette?.textPrimary,
                        }"
                    >
                        {{ cancelText || 'Cancel' }}
                    </button>
                    <button
                        v-if="showSubmitButton"
                        @click="$emit('submit')"
                        class="md:w-1/3 p-2 rounded-md"
                        :style="{
                            backgroundColor: currentPalette?.buttonPrimary,
                            color: currentPalette?.textPrimary,
                        }"
                    >
                        {{ submitText || 'Submit' }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import currentPalette from '~/vars/getColors'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: '',
    },
    iconBgColor: {
        type: String,
        default: '',
    },
    iconBorderColor: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: '',
    },
    showSubmitButton: {
        type: Boolean,
        default: true,
    },
    customClass: {
        type: String,
        default: '',
    },
    showDefaultFooter: {
        type: Boolean,
        default: true,
    },
    cancelText: {
        type: String,
        default: 'Cancel',
    },
    submitText: {
        type: String,
        default: 'Submit',
    },
    cancelButtonClass: {
        type: String,
        default: '',
    },
    submitButtonClass: {
        type: String,
        default: '',
    },
    containerStyle: {
        type: Object,
        default: () => ({}),
    },
    isDanger: {
        type: Boolean,
        default: false,
    },
    animationDirection: {
        type: String,
        default: 'bottom',
    },
    showCloseButton: {
        type: Boolean,
        default: true,
    },
})

const transitionName = computed(() => 'modal-standard')

const iconBgStyle = computed(() => {
    if (props.iconBgColor) return props.iconBgColor
    return props.isDanger
        ? currentPalette.value?.buttonDanger
        : currentPalette.value?.buttonPrimary
})

const iconBorderStyle = computed(() => {
    if (props.iconBorderColor) return props.iconBorderColor
    return props.isDanger
        ? 'rgba(239, 68, 68, 0.6)'
        : currentPalette.value?.buttonSecondary
})

const emit = defineEmits(['close', 'submit'])

let scrollpos = 0

watch(
    () => props.isOpen,
    (value) => {
        if (value) {
            scrollpos = window.scrollY

            setTimeout(() => {
                document.body.style.top = `-${scrollpos}px`
                document.body.style.position = 'fixed'
                document.body.style.width = '100%'
                document.body.classList.add('overflow-hidden')
            }, 5)
        } else {
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.classList.remove('overflow-hidden')
            window.scrollTo(0, scrollpos)
        }
    }
)

function onLeave() {}

onMounted(() => {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && props.isOpen) {
            emit('close')
        }
    })
})
</script>

<style scoped>
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
    max-width: 95%;
    max-height: 95vh;
    overflow-y: auto;
}

.modal-standard-enter-active,
.modal-standard-leave-active {
    transition: all 0.25s ease;
}

.modal-standard-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.modal-standard-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
