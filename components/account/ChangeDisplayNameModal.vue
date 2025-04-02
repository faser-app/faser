<template>
  <BaseModalComponent :isOpen="showModal" @close="changeDisplayNameModal(false)" title="Change display name"
    icon="id-card" iconBgColor="blue-950" iconBorderColor="blue-600" :error="error" submitText="Submit"
    animationDirection="bottom" submitButtonClass="bg-blue-500" @submit="changeDisplayName">
    <div class="flex justify-center text-center mt-2 text-gray-400">
      <div class="md:w-96 w-full">
        <p>Note: You can change your display name as often as you want.</p>
        <input type="text" class="w-full p-2 rounded-md bg-gray-800 text-white mt-2" v-model="newUsername"
          placeholder="New Display Name" @input="error = ''" />
        <p class="mt-2 text-red-500" v-if="error">{{ error }}</p>
      </div>
    </div>
  </BaseModalComponent>
</template>
<script setup>
import { watch } from "vue";
import {
  getModalState,
  changeDisplayNameModal,
} from "~/scripts/account/changeDisplayName";
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

function changeDisplayName() {
  axios
    .post(baseURL + "/api/profile/changeDisplayName", {
      token: Cookies.get("token"),
      newDisplayName: newUsername.value,
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      changeDisplayNameModal(false);
      router.push("/profile");
    })
    .catch((err) => {
      error.value = err.response.data.message;
    });
}
</script>
