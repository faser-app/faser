import { useFetch, useHead } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  useHead({
    title: "faser.app",
    meta: [
      {
        hid: "keywords",
        name: "keywords",
        content:
          "faser app, social media app, microblogging, post short messages, online community, social network, app for short posts, social platform, microblogging platform, app for discussions, share trends, social media interactions, gain followers, create posts, social sharing, social networks, social media exchange, trending topics, user-generated content, social connection",
      },
    ],
  });
});
