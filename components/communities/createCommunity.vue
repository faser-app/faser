<template>
    <div class="min-h-screen text-white">
        <div class="w-full flex justify-center">
            <span class="text-gray-400">This feature is only available with Beta access</span>
        </div>
        <div class="w-full flex justify-center">
            <h1 class="text-2xl font-bold">Create a Community</h1>
        </div>

        <div class="w-full flex flex-col justify-center mt-4 items-center px-2">
            <div class="md:w-1/2 w-full text-left">
                <span class="text-sm text-gray-300">Community Name</span>
            </div>
            <input v-model="community.communityName" type="text" class="md:w-1/2 w-full p-2 bg-gray-800 rounded-lg">
        </div>

        <div class="w-full flex flex-col justify-center mt-4 items-center px-2">
            <div class="md:w-3/4 w-full text-left">
                <span class="text-sm text-gray-300">Community Description</span>
            </div>
            <textarea v-model="community.description" class="md:w-3/4 h-44 w-full p-2 bg-gray-800 rounded-lg"
                maxlength="2000"></textarea>
        </div>

        <div class="w-full flex flex-col justify-center mt-4 items-center px-2">
            <div class="md:w-3/4 w-full text-left">
                <span class="text-sm text-gray-300">Community Rules (Markdown enabled)</span>
            </div>
            <textarea v-model="community.rules" class="md:w-3/4 h-44 w-full p-2 bg-gray-800 rounded-lg"
                maxlength="2000"></textarea>
        </div>

        <div class="w-full flex flex-col justify-center mt-4 items-center px-2">
            <div class="md:w-3/4 w-full text-left">
                <span class="text-sm text-gray-300">Community Tags (press enter to add a Tag)</span>
            </div>
            <input @keyup.enter="saveTag" maxlength="28" @input="errors = []" v-model="tag" type="text"
                class="md:w-3/4 mb-2 w-full p-2 bg-gray-800 rounded-lg">

            <div v-if="errors.length > 0" class="w-full flex justify-center mt-2">
                <p class="text-red-500">{{ errors[0].message }}</p>
            </div>


            <div class="flex gap-2 flex-wrap mt-2 justify-center">
                <div v-for="(tag, index) in community.tags" :key="tag" class="flex">
                    <div class="bg-gray-800 px-4 p-2 min-w-24 text-center rounded-lg">
                        <p>{{ tag }}</p>
                    </div>

                    <button @click="community.tags.splice(index, 1)" class="absolute -mt-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="flex items-center">
            <div class="w-full flex justify-center items-center mt-4">
                <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" v-model="community.nsfw">
                    <div
                        class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500">
                    </div>
                    <p class="ms-3 select-none text-sm font-medium dark:text-gray-300">NSFW <i
                            class="fa-solid fa-triangle-exclamation"></i></p>
                </label>
            </div>
            <div class="w-full flex justify-center items-center mt-4">
                <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" v-model="community.private">
                    <div
                        class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500">
                    </div>
                    <p class="ms-3 select-none text-sm font-medium dark:text-gray-300">Private <i
                            class="fa-solid fa-lock"></i></p>
                </label>
            </div>
        </div>


        <div class="w-full flex justify-center mt-4">
            <button @click="createCommunity" class="bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] p-2 rounded-lg">Create
                Community</button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import Cookies from "js-cookie"

const community = ref({
    communityName: "",
    description: "",
    rules: "",
    tags: [],
    nsfw: false,
    private: false
})
const tag = ref('')

const errors = ref([])

function saveTag() {
    if (community.value.tags.includes(tag.value)) {
        errors.value.push({
            message: "Tag already exists",
            part: "tag"
        })
        return
    }
    if (tag.value.length > 28) {
        errors.value.push({
            message: "Tag is too long",
            part: "tag"
        })
        return
    }
    if (tag.value.length < 3) {
        errors.value.push({
            message: "Tag is too short",
            part: "tag"
        })
        return
    }
    if (community.value.tags.length > 6) {
        errors.value.push({
            message: "You can only have 6 tags",
            part: "tag"
        })
        return
    }
    community.value.tags.push(tag.value)
    tag.value = ""
}

function createCommunity() {
    axios.post("https://api.faser.app/api/community/createCommunity", {
        token: Cookies.get("token"),
        communityName: community.value.communityName,
        description: community.value.description,
        rules: community.value.rules,
        tags: community.value.tags,
        nsfw: community.value.nsfw,
        private: community.value.private
    }).then((response) => {
        if (response.data.error) {
            errors.value.push({
                message: response.data.error,
                part: "community"
            })
        } else {
            window.location.href = "/communities/" + response.data.community.id
        }
    })
}
</script>