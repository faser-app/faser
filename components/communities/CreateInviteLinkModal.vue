<template>
    <Transition name="fade" @leave="leave">
        <div v-if="props.showModal" @click.self="$emit('close')" class="fixed top-0 left-0 backdrop-blur z-[100] w-screen h-screen flex items-center justify-center">
            <div class="bg-gray-800 p-5 rounded-xl m-3 md:w-auto w-full min-w-[50svw]">
                <h2 class="text-center font-bold">Create Invite Link</h2>
                <div class="flex break-all justify-center text-center mt-2 text-gray-400">
                    <p>Invite your friends to join this community by sharing this link</p>
                </div>
            </div>
        </div>
    </Transition>

    {{ props.showModal }}
</template>

<script setup>
const props = defineProps({
    showModal: Boolean,
    communityId: String
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