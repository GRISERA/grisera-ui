<template>
  <v-container>
    <collapse-listing :data="lifeActivities">
      <template #listing-title>
        <slot name="activities-title">
          <v-row justify="space-between">
            <h1>Life activities</h1>
          </v-row>
        </slot>
      </template>
    </collapse-listing>
  </v-container>
</template>

<script>
import CollapseListing from '@/components/CollapseListing.vue';

export default {
  name: 'LifeActivitiesListingComponent',
  components: {
    CollapseListing,
  },
  props: {
    lifeActivities: Array,
  },
};
</script>
