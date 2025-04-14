<template>
    <BaseModalComponent
        :isOpen="isOpen"
        @close="$emit('close')"
        title="Report Post"
        customClass="max-h-[80svh] overflow-scroll"
        :containerStyle="{ backgroundColor: currentPalette?.bg }"
        animationDirection="bottom"
        :showDefaultFooter="false"
    >
        <div class="w-full">
            <SupportFieldsComponent
                :predefinedSubject="'Post Report for ' + authorName"
                :predefinedMessage="
                    'I want to report this post because...\n\nPost ID: ' +
                    postId
                "
            />
            <p class="text-center text-gray-400 mt-2">
                Please provide the Post ID for the Person you want to report.
            </p>
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
    postId: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        default: '',
    },
})

defineEmits(['close'])
</script>
