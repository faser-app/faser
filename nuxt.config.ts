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
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "faser.app",
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
        {
          rel: "manifest",
          href: "/manifest/manifest.json",
        },
        {
          rel: "apple-touch-icon",
          href: "/icon/logo.png",
        },
      ],
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content:
            "faser app, social media app, microblogging, post short messages, online community, social network, app for short posts, social platform, microblogging platform, app for discussions, share trends, social media interactions, gain followers, create posts, social sharing, social networks, social media exchange, trending topics, user-generated content, social connection",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black",
        },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/ldrs/dist/auto/lineWobble.js",
          type: "module",
        },
        {
          src: "https://cdn.jsdelivr.net/npm/ldrs/dist/auto/zoomies.js",
          type: "module",
        },
      ],
    },
  },

  server: {
    port: 3100,
  },
});
