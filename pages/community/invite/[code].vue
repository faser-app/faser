<template>
    <div>
        <CommunityInvite :inviteCode="inviteCode" />
    </div>
</template>

<script setup>
import CommunityInvite from '~/components/communities/CommunityInvite.vue';

import { useRoute } from 'vue-router';

const route = useRoute();

const inviteCode = route.params.code;
</script>
