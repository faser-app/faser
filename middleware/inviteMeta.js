import { useFetch } from '#app'
import { useRoute } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const runtimeConfig = useRuntimeConfig()
    const route = useRoute()

    const userAgent = process.server
        ? useRequestHeaders()['user-agent']
        : navigator.userAgent

    const isBot = /discordbot|facebookexternalhit|Twitterbot|Slackbot/i.test(
        userAgent
    )

    //   if (!isBot) {
    //     return;
    //   }

    const url = baseURL + '/api/community/getCommunityByInvite'
    const inviteCode = route.params.code

    const { data, error } = await useFetch(url, {
        method: 'POST',
        body: { inviteCode: inviteCode },
    })

    console.log(data.value)

    if (data.value) {
        useHead({
            title: data.value.community.name + ' - faser.app',
            meta: [
                {
                    hid: 'og-title',
                    property: 'og:title',
                    content:
                        'You have been invited to join the ' +
                        data.value.community.name +
                        ' community on faser.app',
                },
                {
                    hid: 'og-description',
                    property: 'og:description',
                    content: data.value.community.description,
                },
                {
                    hid: 'og-url',
                    property: 'og:url',
                    content: 'https://faser.app/community/invite/' + inviteCode,
                },
                {
                    hid: 'og-image',
                    property: 'og:image',
                    content:
                        'https://s3.faser.app/communityimages/' +
                        data.value.community.id +
                        '/image.png',
                },
            ],
        })
    }
})
