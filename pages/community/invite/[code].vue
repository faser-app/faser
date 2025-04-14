<template>
    <div>
        <CommunityInvite :inviteCode="inviteCode" />
    </div>
</template>

<script setup>
import CommunityInvite from '~/components/communities/CommunityInviteComponent.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const inviteCode = route.params.code

definePageMeta({
    middleware: 'invite-meta',
})
</script>
