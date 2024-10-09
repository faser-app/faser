<template>
    <Transition name="fade">
        <div class="bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] p-5 text-center rounded-xl m-3 md:w-auto w-full"
            v-if="showModal">
            <h1
                class="text-2xl text-shadow font-bold mb-2 text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text">
                faser Advanced</h1>
            <p>Oh hello! You've found a faser Advanced feature.</p>
            <p>Subscribe now to faser Advanced to use it!</p>
            <table class="border-separate border-spacing-5 my-2">
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
            <button @click="$emit('closeModal')" class="md:w-2/3 bg-gray-700 mt-2 p-2 rounded-xl">
                Cancel
            </button>
        </div>
    </Transition>
</template>

<script setup>
const props = defineProps({
    showModal: Boolean,
})
</script>

<style scoped>
.text-shadow {
    filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.746));
}
</style>