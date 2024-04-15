<template>
  <v-tab-item>
    <v-container class="container--fluid">
      <v-row>
        <v-col class="col-12">
          <v-simple-table>
            <tbody>
              <tr>
                <td>Date</td>
                <td>{{ experiment.created_at }}</td>
              </tr>
              <tr>
                <td>Author</td>
                <td>{{ experiment.creator }}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{{ experiment.description }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>
</template>

<script>
export default {
  name: 'OverviewTab',
  props: {
    experiment: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
