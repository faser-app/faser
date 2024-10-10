<template>
    <div v-for="(item, index) in accordionItems" :key="item"
        :class="{ 'border-b border-white': index < accordionItems.length - 1 }">
        <button @click="toggleAccordion(index)" class="w-full flex justify-between items-center py-5">
            <span>{{ item.title }}</span>
            <span :id="props.accordionId + '-icon-' + index" class="transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
                    <path
                        d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
            </span>
        </button>
        <div :id="props.accordionId + '-content-' + index" class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="pb-5 text-sm" v-if="props.type === 'advanced'">
                <div class="flex justify-between">
                    <span class="text-bold">Basic</span>
                    <span>{{ item.basic }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-bold">Advanced</span>
                    <span>{{ item.advanced }}</span>
                </div>
            </div>
            <div class="pb-5 text-sm" v-else>
                <span>{{ item.content }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    items: Array,
    type: String,
    accordionId: String,
});

const accordionItems = props.items;

function toggleAccordion(index) {
    const content = document.getElementById(`${props.accordionId}-content-${index}`);
    const icon = document.getElementById(`${props.accordionId}-icon-${index}`);

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
