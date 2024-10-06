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
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/ldrs/dist/auto/lineWobble.js",
          type: "module",
        },
      ],
    },
  },

  server: {
    port: 3100,
  },

  modules: ["nuxt-gtag"],

  gtag: {
    id: "G-WY5FW4MTNC",
    initCommands: [
      [
        "consent",
        "default",
        {
          ad_user_data: "denied",
          ad_personalization: "denied",
          ad_storage: "denied",
          analytics_storage: "denied",
          wait_for_update: 500,
        },
      ],
    ],
  },
});
