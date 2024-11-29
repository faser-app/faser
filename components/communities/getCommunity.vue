<template>
    <div class="min-h-screen">
        <div class="w-full bg-gray-700 py-12" v-if="loaded">
            <div class="flex justify-end w-full h-0 px-3">
                <p class="-translate-y-10">
                <Menu as="div" class="relative inline-block text-left">
                    <div>
                        <MenuButton
                            class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </MenuButton>
                    </div>

                    <transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <MenuItems
                            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-950 shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                <button :class="[
                                    active ? 'bg-gray-600 text-white' : 'text-gray-200',
                                    'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                ]" @click="showRulesModal = true">
                                    Rules
                                </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
                </p>
            </div>
            <div class="flex justify-center w-full h-24">
                <img class="rounded-full w-24 h-24 object-cover border border-gray-400"
                    src="https://static.wikia.nocookie.net/amogus/images/c/cc/Amogbob.png">
            </div>
            <div class="flex justify-center w-full mt-2 text-3xl font-bold">
                <h1>{{ displayName }}</h1>
            </div>
            <div class="flex justify-center w-full mt-2">
                <h1>{{ description }}</h1>
            </div>

            <div class="flex w-full justify-center gap-4 mt-4">
                <div class="flex flex-col items-center">
                    <span class="text-gray-400">Members</span>
                    <span class="text-white">{{ members }}</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-gray-400">Moderators</span>
                    <span class="text-white">{{ moderators.length }}</span>
                </div>
            </div>
        </div>
    </div>

    <ViewRulesModal :showModal="showRulesModal" :rules="rules" @close="showRulesModal = false" />
</template>

<script setup>
import axios from 'axios';
import Cookie from "js-cookie"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import ViewRulesModal from './viewRulesModal.vue';

const props = defineProps({
    communityId: {
        type: String,
        required: true
    }
})

const displayName = ref("")
const description = ref("")
const members = ref("")
const moderators = ref([])
const rules = ref("")
const showRulesModal = ref(false)
const loaded = ref(false)

onMounted(() => {
    axios.post("https://api.faser.app/api/community/getCommunity", {
        token: Cookie.get("token"),
        communityId: props.communityId
    }).then(response => {
        displayName.value = response.data.community.displayName
        description.value = response.data.community.description
        members.value = response.data.community.members
        moderators.value = response.data.community.moderators
        rules.value = response.data.community.rules

        loaded.value = true
    })
})

</script>
