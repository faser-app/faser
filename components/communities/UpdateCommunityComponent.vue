<template>
    <Transition name="fade" @leave="leave">
        <div v-if="showModal" @click.self="$emit('close')"
            class="fixed animation top-0 left-0 backdrop-blur z-[100] w-screen h-screen flex items-center justify-center">
            <div class="p-5 rounded-md max-h-[80vh] overflow-auto m-3 md:w-auto w-full min-w-[50svw]"
                :style="{ backgroundColor: currentPalette.bg }">

                <h2 class="text-center font-bold">Update Community</h2>

                <div class="w-full grid grid-cols-2 gap-2 mt-4">
                    <label class="text-center">Display Name</label>
                    <input type="text" class="input-field" v-model.trim="community.displayName">

                    <label class="text-center">Description</label>
                    <textarea class="input-field" v-model.trim="community.description"></textarea>

                    <div class="flex justify-center items-center gap-2">
                        <label class="text-center">Tags</label>
                        <i @click="addTag" class="fa-solid fa-plus-circle cursor-pointer"
                            :style="{ color: currentPalette.text }"></i>
                    </div>
                    <div>
                        <div v-for="(tag, index) in editedTags" :key="index"
                            class="flex items-center justify-center gap-2">
                            <input type="text" class="input-field" v-model.trim="editedTags[index]">
                            <i @click="removeTag(index)" class="fa-solid fa-minus-circle cursor-pointer"
                                :style="{ color: currentPalette.text }"></i>
                        </div>
                    </div>

                    <label class="text-center">Rules</label>
                    <textarea class="input-field" v-model.trim="community.rules"></textarea>

                    <label class="text-center">NSFW</label>
                    <input type="checkbox" v-model="community.nsfw">

                    <label class="text-center">Private</label>
                    <input type="checkbox" v-model="community.private">
                </div>

                <div class="flex w-full gap-2 justify-center">
                    <button @click="emit('close')" class="p-2 rounded-md mt-2"
                        :style="{ backgroundColor: currentPalette.buttonSecondary }">
                        Cancel
                    </button>
                    <button @click="updateCommunity" class="p-2 rounded-md mt-2"
                        :style="{ backgroundColor: currentPalette.buttonPrimary }">
                        Update Community
                    </button>
                </div>

                <div class="text-center text-red-500">
                    {{ errors }}
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import currentPalette from "~/vars/getColors";

const props = defineProps({
    showModal: Boolean,
    community: Object
});
const emit = defineEmits(["close"]);
const errors = ref("");
const editedTags = ref(props.community?.tags ? [...props.community.tags] : []);

watch(() => props.community?.tags, (newTags) => {
    editedTags.value = newTags ? [...newTags] : [];
}, { deep: true });

const addTag = () => editedTags.value.push("");
const removeTag = (index) => editedTags.value.splice(index, 1);

async function updateCommunity() {
    try {
        await axios.post(baseURL + "/api/community/edit", {
            token: Cookies.get("token"),
            changes: { ...props.community, tags: editedTags.value },
            communityId: props.community.id
        });
        emit("update");
    } catch (error) {
        console.error("Update failed:", error);

        errors.value = error.response.data.message;
        console.log(errors.response.data.errors)
    }
}
</script>

<style scoped>
.input-field {
    width: 100%;
    text-align: center;
    padding: 8px;
    border-radius: 8px;
    color: white;
    background-color: v-bind('currentPalette.bgSecondary');
    margin-top: 8px;
}

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
    animation: fadeOut 0.25s;
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>