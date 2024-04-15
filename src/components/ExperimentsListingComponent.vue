<template>
  <v-container>
    <collapse-listing :data="experiments">
      <template #listing-title>
        <v-row justify="space-between">
          <h1>Experiments</h1>
          <v-btn
            :outlined="true"
            @click="createExperiment()"
          >
            Create
          </v-btn>
        </v-row>
      </template>
      <template #panel-content="{ item }">
        <v-simple-table>
          <tbody>
            <tr>
              <td>Date</td>
              <td>{{ item.created_at }}</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>{{ item.creator }}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{{ item.description }}</td>
            </tr>
            <tr>
              <td>Details</td>
              <td>
                <v-btn
                  outlined
                  small
                  @click="goToDetails(item.id)"
                >
                  Go to details
                </v-btn>
              </td>
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
  name: 'ExperimentsListingComponent',
  components: {
    CollapseListing,
  },
  props: {
    experiments: Array,
  },
  methods: {
    createExperiment() {
      this.$router.push({ name: 'experiment-creation' });
    },
    goToDetails(id) {
      this.$router.push({ name: 'experiment-detailed', params: { id } });
    },
  },
};
</script>