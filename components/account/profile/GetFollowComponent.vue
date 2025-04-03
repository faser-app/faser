<template>
    <RouterLink :to="'/' + user.username">
        <div class="flex min-w-[80svw] items-center">
            <img v-if="user.hasProfilePicture" @error="user.hasProfilePicture = false"
                :src="'https://s3.faser.app/profilepictures/' + user.id + '/image.png' + '?t=' + new Date().getTime()"
                class="h-12 w-12 bg-cover object-cover" :class="{
                    'rounded-full': !user.businessAccount,
                    'rounded-lg': user.businessAccount
                }" />
            <div v-else
                class="rounded-full h-12 w-12 flex border justify-center items-center border-[#96969627] bg-[#1118276c]">
                <i class="fa-solid fa-user rounded-full"></i>
            </div>
            <div class="grid grid-rows-2 ml-2">
                <div class="flex">
                    <p class="text-lg">{{ user.displayName }}</p>
                    <div class="ml-2">
                        <div v-if="user.businessAccount">
                            <div
                                class="flex mt-1 justify-center text-xs items-center bg-yellow-600 border w-5 h-5 border-yellow-300 rounded-full">
                                <i class="fa-solid text-[10px] verifiedBadge fa-check"></i>
                            </div>
                        </div>
                        <div v-else-if="user.verifiedAccount">
                            <div
                                class="flex mt-1 justify-center text-xs items-center bg-sky-600 border w-5 h-5 border-sky-300 rounded-full">
                                <i class="fa-solid text-[10px] verifiedBadge fa-check"></i>
                            </div>
                        </div>
                        <div v-if="user.privateAccount">
                            <i class="fa-solid text-gray-300 fa-lock"></i>
                        </div>
                    </div>
                </div>
                <p class="text-sm text-gray-400">@{{ user.username }}</p>
            </div>
        </div>
    </RouterLink>
</template>

<script setup>
import axios from "axios"

const user = ref({})

const props = defineProps({
    id: Number,
})

const runtimeConfig = useRuntimeConfig()


onMounted(async () => {
    const response = await axios.get(baseURL + "/api/account/getProfile", {
        headers: {
            userId: props.id
        }
    })

    user.value = response.data[0]

    user.value.hasProfilePicture = true
})

</script>