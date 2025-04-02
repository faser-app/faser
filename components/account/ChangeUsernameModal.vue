<template>
  <BaseModalComponent :isOpen="showModal" @close="changeUsernameModal(false)" title="Change Username" icon="id-card"
    iconBgColor="blue-950" iconBorderColor="blue-600" :error="error" submitText="Submit" animationDirection="bottom"
    submitButtonClass="bg-blue-500" @submit="submitUsernameChange">
    <div class="flex justify-center text-center mt-2 text-gray-400">
      <div class="md:w-96 w-full">
        <p>Note: You can only change your username every 30 Days.</p>
        <input type="text" class="w-full p-2 rounded-md bg-gray-800 text-white mt-2" v-model="newUsername"
          placeholder="New Username" @input="error = ''" />
        <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
      </div>
    </div>
  </BaseModalComponent>
</template>
<script setup>
import { watch } from "vue";
import {
  getModalState,
  changeUsernameModal,
} from "~/scripts/account/changeUsername";
import BaseModalComponent from "~/components/ui/BaseModalComponent.vue";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();
const showModal = ref(false);
const newUsername = ref("");
const error = ref("");

const runtimeConfig = useRuntimeConfig()

onMounted(() => {
  watch(getModalState(), (value) => {
    showModal.value = value;
  });
});

function submitUsernameChange() {
  axios
    .post(baseURL + "/api/account/changeUsername", {
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
