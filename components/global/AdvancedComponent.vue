<template>
    <Transition name="fade">
        <div class="bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] p-5 text-center rounded-xl m-3 md:w-auto w-full max-w-[80svw]"
            v-if="showModal">
            <h1
                class="text-2xl text-shadow font-bold mb-2 text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text">
                faser Advanced</h1>
            <p>Oh hello! You've found a faser Advanced feature.</p>
            <p>Subscribe now to faser Advanced to use it!</p>
            <div class="md:block hidden">

                <table class="border-separate md:border-spacing-5 my-2">
                    <tr class="ml-2">
                        <td></td>
                        <td class="font-bold">faser Basic</td>
                        <td class="font-bold">faser Advanced</td>
                    </tr>
                    <tr>
                        <td>Max post Character Limit</td>
                        <td>300</td>
                        <td>2000</td>
                    </tr>
                    <tr>
                        <td>Edit Messages</td>
                        <td>No</td>
                        <td>Yes</td>
                    </tr>
                </table>
            </div>
            <div class="md:hidden block mt-2">
                <div v-for="(item, index) in accordionItems" :key="item"
                    :class="{ 'border-b border-white': index < accordionItems.length - 1 }">
                    <button @click="toggleAccordion(index)" class="w-full flex justify-between items-center py-5">
                        <span>{{ item.title }}</span>
                        <span :id="'icon-' + index" class="transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                class="w-4 h-4">
                                <path
                                    d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                            </svg>
                        </span>
                    </button>
                    <div :id="'content-' + index"
                        class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                        <div class="pb-5 text-sm">
                            <div class="flex justify-between">
                                <span class="text-bold">Basic</span>
                                <span>{{ item.basic }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-bold">Advanced</span>
                                <span>{{ item.advanced }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button @click="$emit('closeModal')" class="w-full bg-gray-700 mt-2 p-2 rounded-xl">
                Cancel
            </button>
        </div>
    </Transition>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    showModal: Boolean,
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
]

function toggleAccordion(index) {
    const content = document.getElementById(`content-${index}`);
    const icon = document.getElementById(`icon-${index}`);

    const minusSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
      </svg>
    `;

    const plusSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
      </svg>
    `;

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0';
        icon.innerHTML = plusSVG;
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.innerHTML = minusSVG;
    }
}

</script>

<style scoped>
.text-shadow {
    filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.746));
}
</style>