<template>
  <collapse-listing :data="scenarios">
    <template #listing-title="{ title }">
      <v-row>
        <h1>{{ title }}</h1>
      </v-row>
    </template>
    <template 
      #panel-header="{ item }"
      v-if="canPerformActions"
    >
      <div class="my-auto font-weight-bold d-flex">
        <div class="my-auto">
          {{ item.name }}
        </div>
        <v-spacer />
        <v-icon
          class="mr-2"
          color="primary"
          @click.stop.prevent="$emit('scenario:edit', item)"
        >
          mdi-pen
        </v-icon>
        <!-- Right now deleting scenario is disabled
        <v-icon
          color="error"
          @click.stop.prevent="$emit('scenario:delete', item)"
        >
          mdi-delete
        </v-icon> -->
      </div>
    </template>
    <template #panel-content="{ item }">
      <div class="caption grey--text">
        Description
      </div>
      <div class="subtitle-1 font-weight-bold">
        {{ item.description }}
      </div>
      <template v-if="item?.activities?.length">
        <v-divider class="mb-4" />
        <v-timeline :dense="true">
          <v-timeline-item
            v-for="activity in item.activities"
            :key="activity.id"
          >
            <div
              style="cursor: pointer;"
              @click="previewActivity(item.id, activity.id)"
            >
              {{ activity.name }}
            </div>
            <v-chip
              :x-small="true"
              color="primary"
            >
              {{ activity.type }}
            </v-chip>
          </v-timeline-item>
        </v-timeline>
      </template>
    </template>
  </collapse-listing>
</template>

<script>
import CollapseListing from '@/components/CollapseListing.vue';

export default {
  name: 'ScenariosListingComponent',
  components: {
    CollapseListing,
  },
  props: {
    scenarios: {
      type: Array,
      default: () => ([]),
    },
    canPerformActions: Boolean,
  },
  methods: {
    previewActivity(scenarioId, activityId) {
      const currentPath = this.$router.currentRoute.path;
      const append = `/scenarios/${scenarioId}/activities/${activityId}`;

      this.$router.push(currentPath + append);
    },
  },
};
</script>

<style scoped>
::v-deep .v-timeline-item__body {
  margin: auto;
}
</style>
