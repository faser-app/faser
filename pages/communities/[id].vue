<template>
    <div>
        <GetCommunityComponent :communityId="communityId" />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import GetCommunityComponent from '~/components/communities/GetCommunityComponent.vue';

const route = useRoute();

const communityId = route.params.id;

</script>