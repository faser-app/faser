// middleware/profileMeta.js
import { useFetch, useHead } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const runtimeConfig = useRuntimeConfig()

    const username = to.params.user.replace('@', '')
    const url = baseURL + '/api/account/getProfile/'

    const headers = {
        username: username,
    }

    const { data, error } = await useFetch(url, {
        headers: headers,
    })

    if (data.value && data.value.length > 0) {
        useHead({
            title: data.value[0].displayName + ' - faser.app',
            meta: [
                {
                    hid: 'og-title',
                    property: 'og:title',
                    content: data.value[0].displayName,
                },
                {
                    hid: 'og-description',
                    property: 'og:description',
                    content: data.value[0].bio,
                },
                {
                    hid: 'og-image',
                    property: 'og:image',
                    content:
                        'https://s3.faser.app/profilepictures/' +
                        data.value[0].id +
                        '/image.png' +
                        '?t=' +
                        new Date().getTime(),
                },
            ],
        })
    } else {
        useHead({
            title: 'faser.app',
            meta: [],
        })
    }
})
