export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
      ],
      meta: [
        {
          property: "og:title",
          content: "faser – Weaving Conversations, One Thread at a Time.",
        },
        {
          property: "og:description",
          content:
            "Connect with others, share your thoughts, and become part of a network that weaves conversations into a global community.",
        },
        {
          property: "og:image",
          content: "_nuxt/assets/img/icon/logo.png",
        },
        { property: "og:url", content: "https://faser.app" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@faser_app" },
      ],
    },
  },
  server: {
    port: 3100,
  },
});
