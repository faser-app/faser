import { useFetch, useHead } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const url = "https://api.faser.app/api/social/fetchPost";

  const postId = to.params.post;

  const headers = {
    postId: postId
  };

  const { data, error } = await useFetch(url, {
    headers: headers,
  });

  const postAuthor = await useFetch(
    "https://api.faser.app/api/profile/getPostProfile",
    {
      headers: headers,
    }
  );

  const authorUser = await useFetch(
    "https://api.faser.app/api/account/getProfile",
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
          content: data.value[0].content,
        },
        {
          hid: "og-image",
          property: "og:image",
          content: [
            "https://api.faser.app/api/social/getPostImage?postId=" +
              postId +
              "&imageId=1",
          ],
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
      title: "Loading...",
      meta: [],
    });
  }
});
