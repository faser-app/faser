<template>
    <div
        v-if="!mobile"
        class="h-[4.5rem] flex top-0 fixed backdrop-blur-sm text-white w-full z-100"
        :style="{ backgroundColor: currentPalette.bg }"
    >
        <RouterLink to="/">
            <div
                class="flex h-full w-full justify-center md:justify-start fixed pointer-events-none"
            >
                <div
                    v-if="currentPalette.name !== 'normal'"
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
                    }"
                    class="h-14 w-14 ml-2 my-2 rounded-full cursor-pointer absolute pointer-events-auto"
                />
                <img
                    v-else
                    src="/assets/img/icon/logo.png"
                    alt="Logo"
                    class="h-14 ml-2 my-2 rounded-full cursor-pointer border border-[#96969627] bg-[#1118276c] absolute pointer-events-auto"
                />
            </div>
        </RouterLink>
        <div @click="expanded = !expanded">
            <div
                class="flex h-full w-14 justify-center items-center cursor-pointer md:hidden"
            >
                <i class="fa-solid fa-bars text-2xl"></i>
            </div>
        </div>
        <div
            class="flex h-full top-10 self-center justify-end flex-1 w-full mr-4"
        >
            <div
                class="hidden opacity-0 self-center items-center sm:opacity-100 gap-5 mr-5 md:flex"
            >
                <SearchUserComponent />
                <div
                    v-for="link in links"
                    :key="link.name"
                    class="cursor-pointer"
                >
                    <RouterLink
                        :to="link.href"
                        class="text-white hover:scale"
                        >{{ link.name }}</RouterLink
                    >
                </div>
            </div>
            <div class="h-full flex items-center">
                <div
                    class="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer"
                    :style="{ backgroundColor: currentPalette.bgSecondary }"
                    @click="openUserMessages"
                >
                    <i class="fa-solid fa-bell text-xl"></i>
                    <div
                        v-if="messages.length > 0"
                        class="absolute mt-8 ml-8 h-6 w-6 text-sm flex items-center justify-center bg-red-700 rounded-full"
                    >
                        <div v-if="messages.length > 100">99+</div>
                        <div v-else>
                            {{ messages.length }}
                        </div>
                    </div>
                </div>
                <!-- <RouterLink to="/profile" class="ml-4">
          <div
            class="border w-12 h-12 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer">
            <img v-if="haveProfilePicture && loaded" @error="haveProfilePicture = false"
              :src="'https://s3.faser.app/profilepictures/' + id + '/image.png' + '?t=' + new Date().getTime()"
              class="rounded-full w-12 h-12 object-cover" />
            <i v-else-if="!haveProfilePicture" class="fa-solid fa-user rounded-full text-3xl"></i>
          </div>
        </RouterLink> -->
                <Menu as="div" class="relative inline-block text-left z-2">
                    <div>
                        <MenuButton
                            class="inline-flex w-full justify-center rounded-md pl-4 py-2 text-sm font-medium text-white"
                        >
                            <div
                                class="border w-12 h-12 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer"
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
                                    class="ph-no-capture rounded-full w-12 h-12 object-cover"
                                />
                                <i
                                    v-else
                                    class="fa-solid fa-user rounded-full text-3xl"
                                ></i>
                            </div>
                        </MenuButton>
                    </div>

                    <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <MenuItems
                            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-hidden"
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
    <div
        v-if="mobile"
        class="fixed z-100 bottom-0 h-20 pb-5 backdrop-blur-xl w-full"
    >
        <div
            class="grid grid-cols-5 text-center items-center h-full text-white"
        >
            <div>
                <RouterLink to="/">
                    <div class="text-center">
                        <div class="flex items-center h-8 justify-center">
                            <i class="fa-solid fa-home"></i>
                        </div>
                    </div>
                </RouterLink>
            </div>
            <div class="text-center">
                <RouterLink to="/search">
                    <div class="flex items-center h-8 justify-center">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </RouterLink>
            </div>
            <div class="text-center">
                <RouterLink to="/messages">
                    <div class="flex items-center h-8 justify-center">
                        <i class="fa-solid fa-message"></i>
                    </div>
                </RouterLink>
            </div>
            <div class="text-center">
                <RouterLink to="/notifications">
                    <div class="flex items-center h-8 justify-center">
                        <i class="fa-solid fa-bell"></i>
                    </div>
                    <div
                        v-if="messages.length > 0"
                        class="absolute -mt-5 ml-[11%] h-6 w-6 text-sm flex items-center justify-center bg-red-700 rounded-full"
                    >
                        <div v-if="messages.length > 100">99+</div>
                        <div v-else>
                            {{ messages.length }}
                        </div>
                    </div>
                </RouterLink>
            </div>
            <div class="flex justify-center">
                <Menu as="div" class="relative inline-block text-left z-2">
                    <div>
                        <MenuButton
                            class="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white"
                        >
                            <div class="flex justify-center flex-wrap">
                                <div
                                    class="border w-8 h-8 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer"
                                >
                                    <i
                                        v-if="!haveProfilePicture"
                                        class="fa-solid fa-user rounded-full"
                                    ></i>
                                    <img
                                        v-else-if="haveProfilePicture && loaded"
                                        :src="
                                            'https://s3.faser.app/profilepictures/' +
                                            id +
                                            '/image.png' +
                                            '?t=' +
                                            new Date().getTime()
                                        "
                                        class="ph-no-capture rounded-full w-8 h-8 object-cover"
                                    />
                                </div>
                            </div>
                        </MenuButton>
                    </div>

                    <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <MenuItems
                            class="absolute right-0 bottom-full mb-2 w-56 origin-bottom-right divide-y divide-gray-100 rounded-md bg-gray-900 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
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
    <div
        class="fixed z-20 backdrop-blur-sm top-[4.5rem] bg-[#0206176c] w-full md:hidden z-100"
    >
        <div class="backdrop-blur-sm w-full">
            <div :class="{ 'expandable-content': true, expanded: expanded }">
                <SearchUserComponent />
                <div
                    v-for="link in links"
                    :key="link.name"
                    class="w-full py-3 backdrop-blur-sm"
                >
                    <RouterLink
                        @click="expanded = false"
                        :to="link.href"
                        class="text-white w-full my-2 ml-3 backdrop-blur-sm"
                    >
                        {{ link.name }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>

    <div
        v-if="!accepted"
        class="w-screen h-screen bg-opacity-80 flex items-center justify-center fixed top-0 left-0 z-100"
    >
        <div
            class="max-w-[90rem] bg-gray-800 p-4 rounded-md w-fit flex flex-col items-center justify-center"
        >
            <div class="">
                <h1 class="font-bold text-2xl">Oh, good to see you.</h1>
                <p>
                    We have to tell you, that we've changed our Privacy Policy.
                    Please take a look at the changes.
                </p>
                <p>
                    <RouterLink to="/privacy#m263" class="underline"
                        >Privacy Policy</RouterLink
                    >
                </p>
                <div class="w-full justify-center">
                    <button
                        class="bg-gray-700 text-white py-1 px-4 rounded-sm mt-2"
                        @click="acceptPrivacy"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    </div>

    <Transition name="fade" @leave="leave" @enter="open">
        <div
            class="fixed top-0 w-screen h-screen backdrop-blur-lg z-50 flex items-center justify-center"
            v-if="expandedSearch"
            @click.self="toggleSearch"
        >
            <div
                class="max-w-[90rem] md:w-[80svw] w-[95svw] text-white max-h-[70svh] overflow-auto p-2 rounded-md"
                :style="{ backgroundColor: currentPalette.bgSecondary }"
            >
                <div
                    class="w-full flex items-center justify-between text-2xl font-bold"
                >
                    <div class="w-full text-center">
                        <h1>Search</h1>
                    </div>
                    <i
                        class="fa-solid fa-xmark mr-2 cursor-pointer text-xl"
                        @click="toggleSearch"
                    ></i>
                </div>
                <SearchUserComponent />
            </div>
        </div>
    </Transition>

    <Transition name="fade" @leave="leave" @enter="open">
        <div
            class="fixed top-0 left-0 w-screen h-screen backdrop-blur-lg z-50 flex items-center justify-center"
            @click.self="closeUserMessages"
            v-if="openMessages"
        >
            <MessagesComponent
                :standalone="mobile"
                :messages="messages"
                @close-messages="closeUserMessages"
                @clear-messages="clearMessages"
            />
        </div>
    </Transition>

    <div
        v-if="!mobile"
        class="h-20"
        :style="{ backgroundColor: currentPalette.bg }"
    ></div>
    <div
        v-if="showBanner"
        class="w-full flex justify-center mb-2 p-5 text-white items-center bg-linear-to-tr from-[#24c7ce] to-[#1ed794]"
    >
        <div class="text-center">
            <p>You'll get a better experience using the web app of faser.</p>
            <h2 class="font-bold text-2xl mt-2">How to get the web app</h2>
            <p class="inline">
                To get the web app, tap on share
                <img class="inline" src="/assets/svg/ios-share.svg" />, select
                "Add to Home Screen" and click add
            </p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import currentPalette from '~/vars/getColors'

const expanded = ref(false)
const username = ref('')
const loaded = ref(false)
const haveProfilePicture = ref(true)
const messages = ref([])
const showBanner = ref(false)
const mobile = ref(false)
const expandedSearch = ref(false)
const openMessages = ref(false)
const id = ref(0)
const accepted = ref(true)
const runtimeConfig = useRuntimeConfig()
const imageUrl = '/icon/logo.png'
const baseURLString = ref(baseURL)

const router = useRouter()

const links = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Communities',
        href: '/communities',
    },
    {
        name: 'Messages',
        href: '/messages',
    },
    {
        name: 'Support',
        href: '/faq#support',
    },
    {
        name: 'Advanced',
        href: '/faq#advanced',
    },
]

function changePage(page) {
    router.push(page)
}

function acceptPrivacy() {
    axios
        .post(baseURL + '/api/account/accept', {
            token: Cookies.get('token'),
        })
        .then(() => {
            accepted.value = true
        })
}

onMounted(() => {
    const url = baseURL + '/api/account/getOwnProfile'

    axios
        .get(url, {
            headers: {
                token: Cookies.get('token'),
            },
        })
        .then((response) => {
            username.value = response.data[1].username
            id.value = response.data[0].id

            if (!response.data[1].accepted) {
                Cookies.remove('accepted')
                Cookies.remove('essential')
            }
            accepted.value = response.data[1].accepted

            loaded.value = true
        })

    getUserMessages()
})

function getUserMessages() {
    axios
        .post(baseURL + '/api/profile/getUserMessages', {
            token: Cookies.get('token'),
        })
        .then((response) => {
            messages.value = response.data.messages
        })
}

let scrollpos = window.scrollY

function logout() {
    Cookies.remove('token')
    window.location.href = '/login'
}

function clearMessages() {
    messages.value = []
}

function openUserMessages() {
    openMessages.value = true

    // scrollpos = window.scrollY;

    // document.body.style.position = 'fixed';
    // document.body.style.width = '100%';
    // document.body.style.top = "-" + scrollpos + "px";
    // document.body.classList.add("overflow-hidden")
    // document.body.classList.add("max-w-screen")

    if (openMessages.value) {
        getUserMessages()
    }
}

function closeUserMessages() {
    openMessages.value = false

    // document.body.style.position = '';
    // document.body.style.top = '';
    // document.body.classList.remove("overflow-hidden")
    // document.body.classList.remove("max-w-screen")
    // window.scrollTo(0, scrollpos);
}

function toggleSearch() {
    expandedSearch.value = !expandedSearch.value

    if (expandedSearch.value && !mobile) {
        scrollpos = window.scrollY

        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.top = '-' + scrollpos + 'px'
        document.body.classList.add('overflow-hidden')
        document.body.classList.add('max-w-screen')
    } else if (!expandedSearch.value && !mobile) {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.classList.remove('overflow-hidden')
        document.body.classList.remove('max-w-screen')
        window.scrollTo(0, scrollpos)
    }
}

if (
    !window.navigator.standalone &&
    window.navigator.userAgent.match(/(iPhone|iPod|iPad)/i)
) {
    showBanner.value = true
}

if (window.navigator.standalone) {
    mobile.value = true
}
</script>

<style scoped>
.expandable-content {
    transition: max-height 0.5s ease;
    overflow: hidden;
    height: 0;
}

.expandable-content.expanded {
    height: 100svh;
}

.z-100 {
    z-index: 100;
}

.fade-enter-active {
    animation: fadeIn 0.25s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        z-index: 10;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        z-index: 10;
        transform: translateY(0);
    }
}

.fade-leave-active {
    animation: faceOut 0.25s;
}

@keyframes faceOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(5px);
    }
}

.like-enter-active {
    animation: likeIn 0.25s ease;
}
</style>
