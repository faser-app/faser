<template>
    <Transition name="fade" @leave="leave">
        <div v-if="props.showModal" @click.self="$emit('close')"
            class="fixed top-0 left-0 backdrop-blur z-[100] w-screen h-screen flex items-center justify-center">
            <div class="p-5 rounded-xl m-3 md:w-auto w-full min-w-[50svw]" :style="{ backgroundColor: currentPalette.bg }">
                <h2 class="text-center font-bold">Create Invite Link</h2>
                <div class="flex break-all justify-center text-center mt-2 text-gray-400">
                    <p>Invite people to join this community by sharing this link</p>
                </div>
                <div class="w-full grid grid-cols-2 gap-2 mt-4">
                    <p class="text-center">Expiration Date</p>

                    <p class="text-center">Uses</p>
                </div>
                <div class="w-full grid grid-cols-2 gap-2">
                    <select ref="expirationDate" class="w-full text-center p-2 rounded-xl text-white mt-2" :style="{ backgroundColor: currentPalette.bgSecondary }">
                        <option value="-1">No Expiration</option>
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="4">4 Days</option>
                        <option value="5">5 Days</option>
                        <option value="6">6 Days</option>
                        <option value="7">7 Days</option>
                        <option value="14">14 Days</option>
                        <option value="30">30 Days</option>
                    </select>

                    <div class="flex justify-between items-center">
                        <button @click="changeUses('subtract')" class="p-2 rounded-xl">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <p v-if="uses > 0">{{ uses }}</p>
                        <p v-else>infinite</p>
                        <button @click="changeUses('add')" class="p-2">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>

                </div>
                <div v-if="!inviteLink" class="flex w-full justify-center">
                    <button @click="generateInviteLink" class="p-2 rounded-xl mt-2" :style="{ backgroundColor: currentPalette.buttonPrimary }">Generate Invite
                        Link</button>
                </div>
                <div v-else class="bg-neutral-900 font-mono p-2 mt-2 flex justify-between items-center rounded-sm"
                    @click="copyToClipboard">
                    <p class="w-full text-center truncate">{{ inviteLink }}</p>
                    <i v-if="!copiedToClipboard" class="fa-solid fa-copy"></i>
                    <i v-else class="fa-solid fa-check"></i>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import axios from "axios"
import Cookies from "js-cookie"
import currentPalette from "~/vars/getColors"

const props = defineProps({
    showModal: Boolean,
    communityId: String
})

const runtimeConfig = useRuntimeConfig()


const uses = ref(0)
const expirationDate = ref("")
const inviteLink = ref("")
const copiedToClipboard = ref(false)

function changeUses(act) {
    if (inviteLink.value === "") {
        if (act === "add") {
            uses.value++
        } else {
            if (uses.value > 0) {
                uses.value--
            }
        }
    }
}

function generateInviteLink() {
    if (uses.value === 0) {
        uses.value = -1
    }
    axios.post("https://" + runtimeConfig.public.apiUrlServer + "/api/community/createInvite", {
        token: Cookies.get("token"),
        communityId: props.communityId,
        expDate: expirationDate.value.value,
        uses: uses.value
    })
        .then(res => {
            inviteLink.value = "https://faser.app/community/invite/" + res.data.inviteCode
        })
}

function copyToClipboard() {
    copiedToClipboard.value = true
    navigator.clipboard.writeText(inviteLink.value)
}
</script>

<style scoped>
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
    animation: faceOut 0.25s;
}

@keyframes faceOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>