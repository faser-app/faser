<template>
    <div>
        <CommunitiesGetCommunity :communityId="communityId" />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const communityId = route.params.id;

</script>