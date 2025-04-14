<template>
    <BaseModalComponent
        :isOpen="isOpen"
        @close="$emit('close')"
        title="Edit post"
        icon="pen"
        iconBgColor="blue-950"
        iconBorderColor="blue-600"
        :containerStyle="{ backgroundColor: currentPalette?.bg }"
        submitText="Save"
        animationDirection="bottom"
        submitButtonClass="bg-blue-500"
        @submit="$emit('save', content)"
    >
        <div
            class="flex flex-col justify-center text-center mt-2 text-gray-400"
        >
            <p class="mb-2">
                If you edit the post, an edited text will be added to the post
            </p>
            <textarea
                class="w-full p-2 rounded-md text-white"
                :style="{ backgroundColor: currentPalette?.bgSecondary }"
                v-model="content"
            ></textarea>
        </div>
    </BaseModalComponent>
</template>
<script setup>
import currentPalette from '~/vars/getColors'
import BaseModalComponent from '~/components/ui/BaseModalComponent.vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    initialContent: {
        type: String,
        default: '',
    },
})

const content = ref(props.initialContent)

watch(
    () => props.initialContent,
    (newValue) => {
        content.value = newValue
    }
)

defineEmits(['close', 'save'])
</script>
