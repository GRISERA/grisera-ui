<template>
  <v-container>
    <collapse-listing :data="activities">
      <template #listing-title>
        <slot name="activities-title">
          <v-row
            v-if="!hideTitle"
            justify="space-between"
          >
            <h1>Activities</h1>
            <v-btn @click="createActivity()">
              + Add
            </v-btn>
          </v-row>
        </slot>
      </template>
      <template #panel-header="{ index }">
        <slot
          name="panel-header"
          :index="index"
        >
          Activity {{ index + 1 }}
        </slot>
      </template>
      <template #panel-content="{ item }">
        <v-simple-table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{{ item.description }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </template>
    </collapse-listing>
  </v-container>
</template>

<script>
import CollapseListing from '@/components/CollapseListing.vue';

export default {
  name: 'ActivitiesListingComponent',
  components: {
    CollapseListing,
  },
  props: {
    activities: Array,
    hideTitle: {
      type: Boolean,
      default: undefined,
    },
  },
  methods: {
    createActivity() {
      this.$router.push({ name: 'activity-creation' });
    },
  },
};
</script>