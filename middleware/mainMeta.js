import { useFetch, useHead } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  useHead({
    title: "faser.app",
  });
});
