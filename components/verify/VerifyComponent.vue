<template>
  <div class="min-h-screen pl-2 bg-black text-white">
    <div class="flex flex-col h-svh justify-center items-center">
      <h1 class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold">
        verify email
      </h1>
      <p class="text-gray-500">{{ email }}</p>

      <div class="flex flex-col mt-8 w-56">
        <input type="code" class="p-3 pl-4 bg-transparent text-white border border-gray-800 rounded-lg"
          placeholder="code" @input="error = ''" v-model="code" />
        <button class="p-2 mt-2 border border-gray-700 bg-transparent rounded-lg" @click="verify">
          verify
        </button>
        <button class="mt-2 text-gray-500" @click="resend">Resend email</button>

        <div class="mt-12">
          <div v-show="error" class="bg-[#220000] border border-red-700 rounded-md w-56 text-center py-8">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const code = ref("");
const error = ref("");
const runtimeConfig = useRuntimeConfig()


function verify() {
  const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/account/verifyEmail";

  axios
    .post(url, {
      code: code.value,
      token: Cookies.get("token"),
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      router.push("/");
    })
    .catch((err) => {
      error.value = err.response.data.message;
    });
}

function resend() {
  const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/account/resendEmail";

  axios
    .post(url, {
      token: Cookies.get("token"),
      lang: navigator.language || navigator.userLanguage,
    })
    .then()
    .catch((err) => {
      error.value = err.response.data.message;
      setTimeout(() => {
        error.value = "";
      }, 5000);
    });
}

onMounted(() => {
  if (Cookies.get("token")) {
    const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/account/getOwnProfile";

    axios
      .get(url, {
        headers: {
          token: Cookies.get("token"),
        },
      })
      .then((response) => {
        if (response.data[1].emailConfirmed) {
          router.push("/account");
        }
      })
      .catch((error) => {
        if (error.response.data.status === "error") {
          router.push("/login");
        }
      });
  } else {
    router.push("/login");
  }
});
</script>
