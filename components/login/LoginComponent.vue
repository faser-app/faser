<template>
  <div class="min-h-[calc(100vh-4.5rem)] pl-2 bg-black text-white">
    <div class="flex flex-col h-svh justify-center items-center">
      <h1 class="text-3xl text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold">
        faser login
      </h1>

      <div class="flex flex-col mt-8 w-56">
        <input type="email" class="p-3 pl-4 bg-transparent text-white border border-gray-800 rounded-lg"
          placeholder="email" @input="error = ''" v-model="email" />
        <input type="password" class="p-3 pl-4 mt-2 bg-transparent text-white border border-gray-800 rounded-lg"
          placeholder="password" v-model="password" @input="error = ''" />
        <button class="p-2 mt-2 border border-gray-700 bg-transparent rounded-lg" @click="login">
          login
        </button>

        <RouterLink to="/register" class="mt-2 text-center text-gray-500">
          You don't have an account yet? Create one
          <div class="underline inline-block">here</div>
        </RouterLink>

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
const email = ref("");
const password = ref("");
const error = ref("");
const runtimeConfig = useRuntimeConfig()


function login() {
  const url = baseURL + "/api/account/login";

  axios
    .post(url, {
      email: email.value,
      password: password.value,
      lang: navigator.language || navigator.userLanguage,
    })
    .then((response) => {
      Cookies.set("token", response.data.token, { expires: 365 });
      const tokenList = Cookies.get("tokenList");
      if (tokenList) {
        if (tokenList.includes(response.data.token)) {
          console.log("Token already in list");
        } else {
          const newTokenList = JSON.parse(tokenList);
          newTokenList.push(response.data.token);
          Cookies.set("tokenList", JSON.stringify(newTokenList), { expires: 365 });
        }
      } else {
        Cookies.set("tokenList", JSON.stringify([response.data.token]), { expires: 365 });
      }
      router.push("/profile");
    })
    .catch((err) => {
      error.value = err.response.data.message;
    });
}
</script>
