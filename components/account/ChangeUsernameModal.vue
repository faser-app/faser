<template>
  <transition name="fade" @leave="leave">
    <div v-if="showModal" :class="{ animation: showModal, fadeOut: !showModal }"
      @click.self="changeUsernameModal(false)"
      class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur">
      <div class="bg-gray-900 p-5 rounded-xl m-3 md:w-auto w-full">
        <div class="w-full flex justify-center">
          <div class="bg-blue-950 border border-blue-600 h-14 w-14 rounded-full flex justify-center items-center">
            <i class="fa-solid fa-id-card text-xl"></i>
          </div>
        </div>
        <h2 class="text-center font-bold mt-2">Change Username</h2>
        <div class="flex justify-center text-center mt-2 text-gray-400">
          <div class="md:w-96 w-full">
            <p>Note: You can only change your username every 30 Days.</p>
            <input type="text" class="w-full p-2 rounded-xl bg-gray-800 text-white mt-2" v-model="newUsername"
              placeholder="New Username" @input="error = ''" />
            <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
          <button @click="changeUsernameModal(false)" class="md:w-2/3 bg-gray-700 p-2 rounded-xl">
            Cancel
          </button>
          <button @click="deleteImage" class="md:w-1/3 bg-blue-500 p-2 rounded-xl">
            Submit
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { watch } from "vue";
import {
  getModalState,
  changeUsernameModal,
} from "~/scripts/account/changeUsername";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();
const showModal = ref(false);
const newUsername = ref("");
const error = ref("");

const runtimeConfig = useRuntimeConfig()


let scrollpos = window.scrollY;

onMounted(() => {
  watch(getModalState(), (value) => {
    showModal.value = value;

    if (value) {
      scrollpos = window.scrollY;

      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = "-" + scrollpos + "px";
      document.body.classList.add("overflow-hidden")
    }
    else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.classList.remove("overflow-hidden")
      window.scrollTo(0, scrollpos);
    }
  });
});

function deleteImage() {
  axios
    .post("https://" + runtimeConfig.public.apiUrlServer + "/api/account/changeUsername", {
      token: Cookies.get("token"),
      newUsername: newUsername.value,
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      changeUsernameModal(false);
      router.push("/profile");
    })
    .catch((err) => {
      error.value = err.response.data.message;
    });
}
</script>

<style scoped>
.animation {
  animation: fadeIn 0.25s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
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
