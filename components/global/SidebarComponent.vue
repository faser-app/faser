<template>
    <div
        class="sidebar-container h-screen fixed left-0 top-0 flex flex-col"
        :style="{ backgroundColor: currentPalette.bgSecondary }"
    >
        <!-- Logo -->
        <RouterLink
            to="/"
            class="px-3 py-4 flex items-center justify-center md:justify-start"
        >
            <div
                class="h-10 w-10 flex items-center justify-center rounded-full"
            >
                <div
                    v-if="currentPalette.name !== 'normal'"
                    class="rounded-full"
                    :style="{
                        WebkitMaskImage: `url('${imageUrl}')`,
                        maskImage: `url('${imageUrl}')`,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                        background:
                            'linear-gradient(45deg, ' +
                            currentPalette.bg +
                            ', ' +
                            currentPalette.bgSecondary +
                            ')',
                        filter: 'brightness(4)',
                        width: '40px',
                        height: '40px',
                    }"
                />
                <img
                    v-else
                    src="/assets/img/icon/logo.png"
                    alt="Logo"
                    class="h-10 rounded-full border border-[#96969627] bg-[#1118276c]"
                />
            </div>
            <span class="hidden md:block text-xl font-bold ml-4 text-white"
                >faser</span
            >
        </RouterLink>

        <!-- Navigation links -->
        <div class="mt-4 flex flex-col flex-1">
            <nav>
                <div v-for="navItem in navigationItems" :key="navItem.name">
                    <RouterLink
                        :to="navItem.href"
                        class="nav-link"
                        :class="{ active: isActive(navItem.href) }"
                    >
                        <div
                            class="flex items-center p-3 hover:bg-gray-800 rounded-full transition-colors md:px-4 md:mx-2"
                        >
                            <i :class="['fa-solid text-xl', navItem.icon]"></i>
                            <span class="hidden md:block ml-4">{{
                                navItem.name
                            }}</span>
                        </div>
                    </RouterLink>
                </div>
            </nav>

            <div class="mt-auto mb-4 px-3">
                <!-- User profile button -->
                <Menu as="div" class="relative w-full">
                    <MenuButton class="w-full">
                        <div
                            class="user-profile flex items-center p-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <div
                                class="avatar-container h-10 w-10 flex items-center justify-center rounded-full overflow-hidden"
                            >
                                <img
                                    v-if="haveProfilePicture && loaded"
                                    @error="haveProfilePicture = false"
                                    :src="
                                        'https://s3.faser.app/profilepictures/' +
                                        id +
                                        '/image.png' +
                                        '?t=' +
                                        new Date().getTime()
                                    "
                                    class="h-10 w-10 object-cover"
                                />
                                <i
                                    v-else
                                    class="fa-solid fa-user text-white"
                                ></i>
                            </div>
                            <div class="hidden md:block ml-3 text-left">
                                <p
                                    class="text-white font-medium text-sm truncate max-w-[100px]"
                                >
                                    {{ displayName }}
                                </p>
                                <p
                                    class="text-gray-400 text-xs truncate max-w-[100px]"
                                >
                                    @{{ username }}
                                </p>
                            </div>
                            <i
                                class="hidden md:block fa-solid fa-ellipsis-h text-gray-400 ml-auto"
                            ></i>
                        </div>
                    </MenuButton>

                    <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <MenuItems
                            class="absolute bottom-full mb-2 w-56 origin-bottom-left divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                            :style="{
                                backgroundColor: currentPalette.bgSecondary,
                            }"
                        >
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                    <button
                                        @click="changePage('/profile')"
                                        :class="[
                                            active
                                                ? 'bg-gray-600 text-white'
                                                : 'text-gray-200',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                        ]"
                                    >
                                        <i class="fa-solid fa-user mr-2"></i>
                                        Profile
                                    </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <button
                                        @click="changePage('/account/settings')"
                                        :class="[
                                            active
                                                ? 'bg-gray-600 text-white'
                                                : 'text-gray-200',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                        ]"
                                    >
                                        <i class="fa-solid fa-gear mr-2"></i>
                                        Settings
                                    </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <button
                                        @click="changePage('/saved')"
                                        :class="[
                                            active
                                                ? 'bg-gray-600 text-white'
                                                : 'text-gray-200',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                        ]"
                                    >
                                        <i
                                            class="fa-solid fa-bookmark mr-2"
                                        ></i>
                                        Saved Posts
                                    </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <button
                                        @click="changePage('/likes')"
                                        :class="[
                                            active
                                                ? 'bg-gray-600 text-white'
                                                : 'text-gray-200',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                        ]"
                                    >
                                        <i class="fa-solid fa-heart mr-2"></i>
                                        Liked Posts
                                    </button>
                                </MenuItem>
                                <div class="px-2 py-1">
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
        <div
            v-if="showPostModal"
            @click.self="showPostModal = false"
            class="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
            <div
                class="w-full max-w-lg p-4 rounded-xl shadow-lg"
                :style="{ backgroundColor: currentPalette.bg }"
            >
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-white">Create Post</h2>
                    <button
                        @click="showPostModal = false"
                        class="text-gray-300 hover:text-white"
                    >
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                <PostCreatePostComponent
                    @post-created="closePostModal"
                    text="Post"
                    :mobile="false"
                    :own-profile="ownProfileData"
                />
            </div>
        </div>
    </transition>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useRouter, useRoute } from 'vue-router'
import currentPalette from '~/vars/getColors'

const router = useRouter()
const route = useRoute()

const id = ref(0)
const username = ref('')
const displayName = ref('')
const loaded = ref(false)
const haveProfilePicture = ref(true)
const ownProfileData = ref({})
const showPostModal = ref(false)
const imageUrl = '/icon/logo.png'

const navigationItems = [
    {
        name: 'Home',
        href: '/',
        icon: 'fa-home',
    },
    {
        name: 'Search',
        href: '/search',
        icon: 'fa-magnifying-glass',
    },
    {
        name: 'Communities',
        href: '/communities',
        icon: 'fa-users',
    },
    {
        name: 'Notifications',
        href: '/notifications',
        icon: 'fa-bell',
    },
    {
        name: 'Messages',
        href: '/messages',
        icon: 'fa-envelope',
    },
]

function changePage(page) {
    router.push(page)
}

function isActive(path) {
    // Handle home route
    if (path === '/' && route.path === '/') return true

    // Handle other routes
    if (path !== '/') {
        return route.path.startsWith(path)
    }

    return false
}

function openPostModal() {
    showPostModal.value = true
}

function closePostModal() {
    showPostModal.value = false
}

onMounted(() => {
    const url = baseURL + '/api/account/getOwnProfile'

    if (Cookies.get('token')) {
        axios
            .get(url, {
                headers: {
                    token: Cookies.get('token'),
                },
            })
            .then((response) => {
                username.value = response.data[1].username
                displayName.value = response.data[0].displayName
                id.value = response.data[0].id
                ownProfileData.value = response.data[0]
                loaded.value = true
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error)
            })
    }
})
</script>

<style scoped>
.sidebar-container {
    width: 70px;
    z-index: 10;
    overflow-y: auto;
    border-right: 1px solid rgba(47, 51, 54, 0.8);
}

@media (min-width: 768px) {
    .sidebar-container {
        width: 280px;
    }
}

.nav-link.active div {
    font-weight: bold;
    background-color: rgba(128, 128, 128, 0.2);
}

.post-btn:hover {
    filter: brightness(0.9);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
