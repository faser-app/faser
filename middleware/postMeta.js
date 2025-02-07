import { useFetch, useHead } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const runtimeConfig = useRuntimeConfig();

  const userAgent = process.server
    ? useRequestHeaders()["user-agent"]
    : navigator.userAgent;

  const isBot = /discordbot|facebookexternalhit|Twitterbot|Slackbot|/i.test(
    userAgent
  );

  if (!isBot) {
    return;
  }

  const url =
    "https://" + runtimeConfig.public.apiUrlServer + "/api/social/fetchPost";
  const postId = to.params.post;

  const headers = {
    postId: postId,
  };

  const { data, error } = await useFetch(url, {
    headers: headers,
  });

  const postAuthor = await useFetch(
    "https://" +
      runtimeConfig.public.apiUrlServer +
      "/api/profile/getPostProfile",
    {
      headers: headers,
    }
  );

  const authorUser = await useFetch(
    "https://" + runtimeConfig.public.apiUrlServer + "/api/account/getProfile",
    {
      headers: {
        userid: postAuthor.data.value[0].id,
      },
    }
  );

  if (data.value && data.value.length > 0) {
    useHead({
      meta: [
        {
          hid: "og-title",
          property: "og:title",
          content:
            postAuthor.data.value[0].displayName +
            " (@" +
            authorUser.data.value[0].username +
            ") - faser.app",
        },
        {
          hid: "og-description",
          property: "og:description",
          content:
            data.value[0].nsfw === false
              ? data.value[0].content
              : "This content is not available due to the NSFW filter.",
        },
        {
          hid: "og-image",
          property: "og:image",
          content:
            data.value[0].nsfw === false
              ? [
                  "https://s3.faser.app/postimages/" +
                    postAuthor.data.value[0].id +
                    "/" +
                    postId +
                    "/1.png",
                ]
              : [""],
        },
        {
          hid: "og-url",
          property: "og:url",
          content: "https://faser.app/post/" + postId,
        },
      ],
    });
  } else {
    useHead({
      title: "faser.app",
      meta: [],
    });
  }
});
