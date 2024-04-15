<template>
  <v-container>
    <collapse-listing :data="channels">
      <template #listing-title>
        <slot name="activities-title">
          <v-row justify="space-between">
            <h1>Channels</h1>
          </v-row>
        </slot>
      </template>
    </collapse-listing>
  </v-container>
</template>
    
<script>
import CollapseListing from '@/components/CollapseListing.vue';

export default {
    name: 'ChannelsListingComponent',
    components: {
        CollapseListing,
    },
    props: {
        channels: Array,
    },
};
</script>
