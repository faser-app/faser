import { useFetch } from "#app";
import { useRoute } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();

  const userAgent = process.server
    ? useRequestHeaders()["user-agent"]
    : navigator.userAgent;

  const isBot = /discordbot|facebookexternalhit|Twitterbot|Slackbot/i.test(
    userAgent
  );

  if (!isBot) {
    return;
  }

  const url = baseURL + "/api/community/getCommunity";
  const communityId = route.params.id;

  const { data, error } = await useFetch(url, {
    method: "POST",
    body: { communityId: communityId },
  });

  console.log(data.value.community.description);

  if (data.value) {
    useHead({
      title: data.value.community.name + " - faser.app",
      meta: [
        {
          hid: "og-title",
          property: "og:title",
          content: data.value.community.name,
        },
        {
          hid: "og-description",
          property: "og:description",
          content: data.value.community.description,
        },
        {
          hid: "og-url",
          property: "og:url",
          content: "https://faser.app/communities/" + data.value.community.id,
        },
      ],
    });
  }
});
