import { useFetch, useHead } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  useHead({
    title: "faser.app",
    meta: [
      {
        hid: "description",
        name: "description",
        content: "faser.app",
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "faser.app",
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "faser.app",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://faser.app/icon/logo.png",
      },
      {
        hid: "og:image:width",
        property: "og:image:width",
        content: "1200",
      },
      {
        hid: "og:image:height",
        property: "og:image:height",
        content: "630",
      },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://faser.app",
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: "faser.app",
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: "faser.app",
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "https://faser.app/icon/logo.png",
      },
    ],
  });
});
