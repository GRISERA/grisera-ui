<template>
  <v-container>
    <collapse-listing :data="modalities">
      <template #listing-title>
        <slot name="activities-title">
          <v-row justify="space-between">
            <h1>Modalities</h1>
          </v-row>
        </slot>
      </template>
    </collapse-listing>
  </v-container>
</template>

<script>
import CollapseListing from '@/components/CollapseListing.vue';

export default {
  name: 'ModalitiesListingComponent',
  components: {
    CollapseListing,
  },
  props: {
    modalities: Array,
  },
};
</script>
    