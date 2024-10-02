// middleware/profileMeta.js
import { useFetch, useHead } from "#app";
import { useRoute } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const url = "https://api.faser.app/api/social/fetchPost";

  const postId = useRoute().params.post;

  const headers = {
    postId: postId,
  };

  const { data, error } = await useFetch(url, {
    headers: headers,
  });

  console.log(postId);

  console.log(data.value);

  if (data.value && data.value.length > 0) {
    useHead({
      meta: [
        {
          hid: "og-title",
          property: "og:title",
          content: "faser.app",
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
            "https://api.faser.app/api/social/getPostImage?postId=" +
              postId +
              "&imageId=2",
            "https://api.faser.app/api/social/getPostImage?postId=" +
              postId +
              "&imageId=3",
            "https://api.faser.app/api/social/getPostImage?postId=" +
              postId +
              "&imageId=4",
          ],
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
