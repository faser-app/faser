<template>
    <Menu as="div" class="relative w-full inline-block text-left z-[2]">
        <div>
            <MenuButton class="group flex w-full text-red-500 items-center rounded-md text-sm">
                <i class="fa-solid fa-users mr-2"></i>
                Accounts
            </MenuButton>
        </div>

        <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems class="">
                <div class="px-1 py-1">

                    <MenuItem v-for="(account, index) in accountList" :key="account" v-slot="{ active }">
                    <button @click="switchAccount(tokenList[index])" :class="[
                    active ? 'bg-gray-600 text-white' : 'text-gray-200',
                    'group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm',
                    ]">
                        <i class="fa-solid fa-user mr-2"></i>
                        {{ account.displayName }}
                    </button>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                    <button @click="addAccount" :class="[
                    active ? 'bg-gray-600' : 'text-gray-400',
                    'group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm',
                    ]">
                        <i class="fa-solid fa-plus"></i>
                        Add Account
                    </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <button @click="logout" :class="[
                  active ? 'bg-gray-600' : 'text-red-500',
                  'group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm',
                ]">
                        <i class="fa-solid fa-right-to-bracket"></i>
                        Logout
                    </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router';
import axios from 'axios'

const router = useRouter()

const accountList = ref([])
const tokenList = ref({})

function filterTokenList() {
    const filteredTokenList = tokenList.value.filter(item => item !== null);

    filteredTokenList.forEach((item, index) => {
        if (item === undefined) {
            filteredTokenList.splice(index, 1);
        }
    });

    tokenList.value = filteredTokenList;

    Cookies.set('tokenList', JSON.stringify(filteredTokenList), { expires: 365 });

    return filteredTokenList;
}

function logout() {
    const token = Cookies.get('token');
    // const tokenList = Cookies.get('tokenList');

    if (tokenList) {
        try {
            const newTokenList = tokenList.value;

            const index = newTokenList.indexOf(token);

            if (index > -1) {
                newTokenList.splice(index, 1);

                if (accountList.value && index < accountList.value.length) {
                    accountList.value.splice(index, 1);
                }
            }

            tokenList.value = newTokenList;

            console.log(newTokenList)

            Cookies.set('tokenList', JSON.stringify(filterTokenList()), { expires: 365 });
        } catch (error) {
            console.error('Error processing tokenList:', error);
        }
    }

    Cookies.remove('token');
    router.push('/login');
}


function addAccount() {
    router.push('/login')
}

function switchAccount(account) {
    Cookies.set('token', account)
    router.go()
}

onMounted(() => {
    const token = Cookies.get('token')


    if (Cookies.get('tokenList')) {
        tokenList.value = JSON.parse(Cookies.get('tokenList'))

        if (!tokenList.value.includes(token)) {
            const newTokenList = tokenList.value
            newTokenList.push(token)
            Cookies.set('tokenList', JSON.stringify(newTokenList), { expires: 365 })
        }

        filterTokenList()

        getProfile(tokenList.value[0], 0)

    } else {
        if (token !== undefined) {
            Cookies.set('tokenList', JSON.stringify([token]), { expires: 365 })
        } else {
            Cookies.set('tokenList', JSON.stringify([]), { expires: 365 })
        }
    }
})

function getProfile(token, index) {
    axios.get('https://api.faser.app/api/account/getOwnProfile', {
        headers: {
            token: token
        }
    }).then((response) => {
        accountList.value.push(response.data[0])

        if (index < tokenList.value.length - 1) {
            console.log('next')
            getProfile(tokenList.value[index + 1], index + 1)
        }
    })
        .catch(() => {
            console.error('Error getting profile')
            tokenList.value.splice(index, 1)
            filterTokenList()

            if (index < tokenList.value.length) {
                getProfile(tokenList.value[index], index)
            }
        })
}
</script>