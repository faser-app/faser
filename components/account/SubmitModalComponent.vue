<template>
  <transition name="fade" @leave="leave">
    <div v-if="showModal" :class="{ animation: showModal, fadeOut: !showModal }" @click.self="changeModal(false)"
      class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 backdrop-blur">
      <div class="bg-gray-900 p-5 rounded-xl m-3 md:w-auto w-full">
        <div class="w-full flex justify-center">
          <div class="bg-red-950 border border-red-600 h-14 w-14 rounded-full flex justify-center items-center">
            <i class="fa-solid fa-trash text-xl"></i>
          </div>
        </div>
        <h2 class="text-center font-bold mt-2">
          Are you sure you want to remove your profile picture?
        </h2>
        <div class="flex justify-center text-center mt-2 text-gray-400">
          <div class="md:w-96 w-full">
            <p>When you delete your profile picture, you have to upload one again. If you want to replace your current
              profile picture, you can just select a file and upload it.</p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-center gap-2 mt-4">
          <button @click="changeModal(false)" class="md:w-2/3 bg-gray-700 p-2 rounded-xl">
            Cancel
          </button>
          <button @click="deleteImage" class="md:w-1/3 bg-red-500 p-2 rounded-xl">
            Submit
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { watch } from "vue";
import { getModalState, changeModal } from "~/scripts/account/deletePhoto";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();
const showModal = ref(false);

onMounted(() => {
  watch(getModalState(), (value) => {
    showModal.value = value;
  });
});

function deleteImage() {
  axios
    .post("https://api.faser.app/api/profile/removeProfilePhoto", {
      token: Cookies.get("token"),
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      changeModal(false);
      router.push("/profile");
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
