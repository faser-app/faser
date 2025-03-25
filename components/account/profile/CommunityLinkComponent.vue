<template>
    <div class="w-full mb-2 flex mr-8 h-12 truncate items-center pr-3 justify-between rounded-md"
        :style="{ backgroundColor: currentPalette.buttonPrimary, color: currentPalette.textSecondary }">
        <div class="flex items-center">
            <img class="h-8 w-8 m-2 rounded-full" v-if="hasImage"
                :src="'https://s3.faser.app/communityimages/' + community.id + '/image.png'"
                @error="hasImage = false" />
            <i v-else class="fa-solid fa-users p-2 mr-2 text-lg"></i>
            {{ community.displayName }}
        </div>
        <div class="flex gap-2">
            <i v-if="community.private" class="fa-solid fa-lock"></i>
            <i v-if="profileCommunitySettings?.hidden" class="fa-solid fa-eye-slash"></i>
        </div>
    </div>
</template>

<script setup>
import currentPalette from "~/vars/getColors";

const hasImage = ref(true)

const props = defineProps({
    community: {
        type: Object,
        required: true
    },
    profileCommunitySettings: {
        type: Object,
        required: false
    }
})
</script>