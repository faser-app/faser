<template>
  <BaseModalComponent :isOpen="showModal" @close="changeModal(false)"
    title="Are you sure you want to remove your profile picture?" icon="trash" iconBgColor="red-950"
    iconBorderColor="red-600" submitText="Submit" animationDirection="bottom" submitButtonClass="bg-red-500"
    @submit="deleteImage">
    <div class="flex justify-center text-center mt-2 text-gray-400">
      <div class="md:w-96 w-full">
        <p>When you delete your profile picture, you have to upload one again. If you want to replace your current
          profile picture, you can just select a file and upload it.</p>
      </div>
    </div>
  </BaseModalComponent>
</template>
<script setup>
import { watch } from "vue";
import { getModalState, changeModal } from "~/scripts/account/deletePhoto";
import BaseModalComponent from "~/components/ui/BaseModalComponent.vue";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();
const showModal = ref(false);
const runtimeConfig = useRuntimeConfig();

onMounted(() => {
  watch(getModalState(), (value) => {
    showModal.value = value;
  });
});

function deleteImage() {
  axios
    .post(baseURL + "/api/profile/removeProfilePhoto", {
      token: Cookies.get("token"),
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      changeModal(false);
      router.push("/profile");
    });
}
</script>
