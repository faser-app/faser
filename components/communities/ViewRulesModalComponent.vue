<template>

    <transition name="fade" @leave="leave">
        <div v-if="props.showModal" :class="{ animation: props.showModal, fadeOut: !props.showModal }"
            @click.self="$emit('close')"
            class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur">
            <div class="p-5 rounded-xl m-3 md:w-auto w-full min-w-[50svw]" :style="{ backgroundColor: currentPalette.bg, color: currentPalette.textPrimary }" :class="{
                'border border-red-500': error,
            }">
                <h2 class="text-center font-bold">Rules</h2>
                <div class="flex break-all justify-center text-center mt-2 text-gray-400">
                    {{ props.rules }}
                </div>
                <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
                    <button @click="$emit('close')" class="md:w-2/3 p-2 rounded-xl" :style="{ backgroundColor: currentPalette.bgSecondary }">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </transition>

</template>

<script setup>

import currentPalette from '~/vars/getColors';

const props = defineProps({
    showModal: Boolean,
    rules: String
})

let scrollpos = window.scrollY;

watch(() => props.showModal, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})


</script>

<style scoped>
.animation {
    animation: fadeIn 0.25s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-leave-active {
    animation: faceOut 0.25s;
}

@keyframes faceOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>
 