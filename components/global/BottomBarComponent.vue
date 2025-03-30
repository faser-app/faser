<template>
    <div class="bottom-bar-container fixed bottom-0 w-full z-50 pb-6"
        :style="{ backgroundColor: currentPalette.bgSecondary }">
        <div class="grid grid-cols-5">
            <!-- Home -->
            <RouterLink to="/" class="nav-item" :class="{ 'active': isActive('/') }">
                <div class="flex flex-col items-center justify-center h-full">
                    <i class="fa-solid fa-home text-xl"></i>
                    <span class="text-xs mt-1">Home</span>
                </div>
            </RouterLink>

            <!-- Search -->
            <RouterLink to="/search" class="nav-item" :class="{ 'active': isActive('/search') }">
                <div class="flex flex-col items-center justify-center h-full">
                    <i class="fa-solid fa-magnifying-glass text-xl"></i>
                    <span class="text-xs mt-1">Search</span>
                </div>
            </RouterLink>

            <!-- New Post Button -->
            <div class="nav-item new-post-btn" @click="openPostModal">
                <div class="flex flex-col items-center justify-center h-full">
                    <div class="h-12 w-12 rounded-full flex items-center justify-center"
                        :style="{ backgroundColor: currentPalette.buttonDanger }">
                        <i class="fa-solid fa-plus text-xl"></i>
                    </div>
                </div>
            </div>

            <!-- Notifications -->
            <RouterLink to="/notifications" class="nav-item" :class="{ 'active': isActive('/notifications') }">
                <div class="flex flex-col items-center justify-center h-full relative">
                    <i class="fa-solid fa-bell text-xl"></i>
                    <span class="text-xs mt-1">Alerts</span>
                    <div v-if="messages.length > 0"
                        class="absolute top-1 right-5 h-5 w-5 text-xs flex items-center justify-center bg-red-600 rounded-full">
                        <span v-if="messages.length > 99">99+</span>
                        <span v-else>{{ messages.length }}</span>
                    </div>
                </div>
            </RouterLink>

            <!-- Profile/Menu -->
            <div class="nav-item">
                <Menu as="div" class="relative h-full w-full">
                    <MenuButton class="h-full w-full">
                        <div class="flex flex-col items-center justify-center h-full">
                            <div
                                class="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center border border-[#96969627] bg-[#1118276c]">
                                <img v-if="haveProfilePicture && loaded" @error="haveProfilePicture = false"
                                    :src="'https://s3.faser.app/profilepictures/' + id + '/image.png' + '?t=' + new Date().getTime()"
                                    class="h-full w-full object-cover" />
                                <i v-else class="fa-solid fa-user"></i>
                            </div>
                            <span class="text-xs mt-1">Profile</span>
                        </div>
                    </MenuButton>

                    <transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <MenuItems
                            class="absolute right-0 bottom-full mb-2 w-56 origin-bottom-right rounded-md shadow-lg divide-y divide-gray-700 focus:outline-hidden"
                            :style="{ backgroundColor: currentPalette.bg }">
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                <button @click="navigateTo('/profile')" :class="[
                    active ? 'bg-gray-700' : '',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-white'
                  ]">
                                    <i class="fa-solid fa-user mr-2"></i>
                                    Profile
                                </button>
                                </MenuItem>

                                <MenuItem v-slot="{ active }">
                                <button @click="navigateTo('/account/settings')" :class="[
                    active ? 'bg-gray-700' : '',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-white'
                  ]">
                                    <i class="fa-solid fa-gear mr-2"></i>
                                    Settings
                                </button>
                                </MenuItem>

                                <MenuItem v-slot="{ active }">
                                <button @click="navigateTo('/saved')" :class="[
                    active ? 'bg-gray-700' : '',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-white'
                  ]">
                                    <i class="fa-solid fa-bookmark mr-2"></i>
                                    Saved Posts
                                </button>
                                </MenuItem>

                                <MenuItem v-slot="{ active }">
                                <button @click="navigateTo('/likes')" :class="[
                    active ? 'bg-gray-700' : '',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-white'
                  ]">
                                    <i class="fa-solid fa-heart mr-2"></i>
                                    Liked Posts
                                </button>
                                </MenuItem>

                                <MenuItem v-slot="{ active }">
                                <button @click="navigateTo('/communities')" :class="[
                    active ? 'bg-gray-700' : '',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-white'
                  ]">
                                    <i class="fa-solid fa-users mr-2"></i>
                                    Communities
                                </button>
                                </MenuItem>

                                <MenuItem v-slot="{ active }">
                                <button @click="navigateTo('/messages')" :class="[
                    active ? 'bg-gray-700' : '',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-white'
                  ]">
                                    <i class="fa-solid fa-envelope mr-2"></i>
                                    Messages
                                </button>
                                </MenuItem>

                                <div class="border-t border-gray-700 my-1 pt-1">
                                    <HeaderAccountsComponent />
                                </div>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
        </div>
    </div>

    <!-- Create Post Modal -->
    <transition name="fade">
        <div v-if="showPostModal" @click.self="showPostModal = false"
            class="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="w-full max-w-lg mx-4 p-4 rounded-xl shadow-lg" :style="{ backgroundColor: currentPalette.bg }">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-white">Create Post</h2>
                    <button @click="showPostModal = false" class="text-gray-300 hover:text-white">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                <CompactCreatePostComponent @post-created="closePostModal" />
            </div>
        </div>
    </transition>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { useRouter, useRoute } from "vue-router";
import currentPalette from "~/vars/getColors";
import CompactCreatePostComponent from "../post/CompactCreatePostComponent.vue";

const router = useRouter();
const route = useRoute();
const id = ref(0);
const username = ref("");
const displayName = ref("");
const loaded = ref(false);
const haveProfilePicture = ref(true);
const messages = ref([]);
const showPostModal = ref(false);

function isActive(path) {
    // Handle home route specifically
    if (path === '/' && route.path === '/') return true;
    // Handle other routes
    return route.path.startsWith(path);
}

function navigateTo(path) {
    router.push(path);
}

function openPostModal() {
    showPostModal.value = true;
    document.body.style.overflow = 'hidden';
}

function closePostModal() {
    showPostModal.value = false;
    document.body.style.overflow = '';
}

function getUserMessages() {
    if (!Cookies.get("token")) return;

    axios.post(baseURL + "/api/profile/getUserMessages", {
        token: Cookies.get("token")
    })
        .then((response) => {
            messages.value = response.data.messages;
        })
        .catch((error) => {
            console.error("Error fetching user messages:", error);
        });
}

onMounted(() => {
    if (Cookies.get("token")) {
        const url = baseURL + "/api/account/getOwnProfile";

        axios.get(url, {
            headers: {
                token: Cookies.get("token"),
            },
        })
            .then((response) => {
                username.value = response.data[1].username;
                displayName.value = response.data[0].displayName;
                id.value = response.data[0].id;
                loaded.value = true;
            })
            .catch((error) => {
                console.error("Error fetching profile data:", error);
            });

        // Get notifications
        getUserMessages();
    }
});
</script>

<style scoped>
.bottom-bar-container {
    border-top: 1px solid rgba(47, 51, 54, 0.8);
}

/* .nav-item {
  @apply text-gray-300;
} */

/* .nav-item.active {
  @apply text-white font-semibold;
}

.nav-item.active i {
  @apply text-white;
}

.new-post-btn {
  @apply cursor-pointer;
} */

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>