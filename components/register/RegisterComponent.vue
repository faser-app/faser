<template>
  <div class="min-h-screen pl-2 bg-black text-white">
    <div class="flex flex-col h-svh justify-center items-center">
      <h1 class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold">
        faser register
      </h1>

      <div class="flex flex-col mt-8 w-56">
        <input type="username" class="p-3 pl-4 bg-transparent text-white border border-gray-800 rounded-lg"
          placeholder="username" @input="error = ''" v-model="username" />
        <input type="email" class="p-3 pl-4 mt-2 bg-transparent text-white border border-gray-800 rounded-lg"
          placeholder="email" @input="error = ''" v-model="email" />
        <input type="password" class="p-3 pl-4 mt-2 bg-transparent text-white border border-gray-800 rounded-lg"
          placeholder="password" v-model="password" @input="error = ''" />
        <button class="p-2 mt-2 border border-gray-700 bg-transparent rounded-lg" @click="login">
          register
        </button>

        <p class="text-sm text-center text-gray-500 mb-2">By creating an account, you agree to our <RouterLink to="/tos"
            class="underline">Terms of Service</RouterLink> and <RouterLink to="/privacy" class="underline">Privacy
            Policy</RouterLink>.</p>

        <RouterLink to="/login" class="mt-2 text-center text-gray-500">
          If you already have an account, login
          <div class="underline inline-block">here</div>
        </RouterLink>

        <div class="mt-12">
          <div v-show="error" class="bg-[#220000] border border-red-700 rounded-xl w-56 text-center py-8">
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

const username = ref("");
const email = ref("");
const password = ref("");

const error = ref("");
const runtimeConfig = useRuntimeConfig()


function login() {
  const url = "https://" + runtimeConfig.public.apiUrlServer + "/api/account/createAccount";

  axios
    .post(url, {
      username: username.value,
      email: email.value,
      password: password.value,
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      Cookies.set("token", response.data.token, { expires: 365 });
      router.push("/verify");
    })
    .catch((err) => {
      error.value = err.response.data.message;
    });
}
</script>
