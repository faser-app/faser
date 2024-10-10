<template>
    <Transition name="fade">
        <div class="advanced-gradient md:mb-0 mb-[10svh] backdrop-blur-xl p-5 overflow-scroll text-center rounded-xl m-3 md:w-auto min-w-full max-h-[80svh] max-w-[80svw]"
            v-if="showModal">
            <h1 class="text-2xl font-bold mb-2 text-[#ffffffbb]">
                faser Advanced</h1>
            <div v-show="!props.faqPage">
                <p>Oh hello! You've found a faser Advanced feature.</p>
                <p>Subscribe now to faser Advanced to use it!</p>
            </div>
            <p>Here are some features listed what you can do with faser advanced</p>
            <div class="mt-2">
                <AccordionBuilder :items="accordionItems" type="advanced" accordion-id="advanced" />
            </div>
            <div class="flex justify-center gap-2">
                <button v-if="!props.faqPage" @click="$emit('closeModal')" class="w-1/3 bg-gray-700 mt-2 p-2 rounded-xl">
                    Cancel
                </button>
                <button @click="$emit('closeModal')" class="w-2/3 bg-[#ffffff3f] text-white border mt-2 p-2 rounded-xl">
                    Subscribe
                </button>
            </div>
            <p>faser Advanced is not implemented right now</p>
            <div class="w-full text-left">
                <p class="text-sm mt-2">Side note:</p>
                <p>Maybe am i going to remove or add some things later.</p>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    showModal: Boolean,
    faqPage: Boolean,
})

const accordionItems = [
    {
        title: "Max post Character Limit",
        basic: "300",
        advanced: "2000",
    },
    {
        title: "Edit Messages",
        basic: "No",
        advanced: "Yes",
    },
    {
        title: "Extra faser Advanced Badge",
        basic: "No badge",
        advanced: "Advanced badge",
    },
    {
        title: "Early Access to new features",
        basic: "Release Features",
        advanced: "Early Access Features",
    },
    {
        title: "Full Bio Features",
        basic: "Restricted Markdown Support",
        advanced: "Extended Markdown Support",
    },
    {
        title: "Limited File Uploads",
        basic: "Smaller File Sizes",
        advanced: "Full File Size",
    },
    {
        title: "No Ads",
        basic: "Ads between posts",
        advanced: "No Ads at all",
    },
    {
        title: "Personalized Themes",
        basic: "Basic Design",
        advanced: "Many Design Options",
    },
    {
        title: "Custom Emojis",
        basic: "Basic Emojis",
        advanced: "Custom Emojis and Stickers",
    },
]
</script>

<style scoped>
.advanced-gradient {
    background: linear-gradient(45deg, rgba(36, 199, 206, 1) 0%, rgba(30, 209, 215, 1) 30%, rgba(255, 0, 243, 1) 70%, rgba(255, 83, 0, 1) 100%);
    background-size: 800% 800%;
    background-repeat: no-repeat;
    animation: gradient 25s linear infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 100%;
    }

    50% {
        background-position: 100% 0%;
    }

    100% {
        background-position: 0% 100%;
    }
}
</style>