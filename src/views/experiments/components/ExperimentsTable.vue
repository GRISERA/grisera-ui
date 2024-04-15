<template>
  <base-table
    :headers="headers"
    :items="experiments"
    :show-expand="true"
  >
    <template #expanded-item="{ item }">
      <td :colspan="6">
        <v-container class="container--fluid px-0">
          <v-row>
            <v-col class="col-12">
              <div
                class="caption font-weight-bold"
                style="color: rgb(0,0,0, .6)"
              >
                Description
              </div>
              {{ item.description }}
            </v-col>
          </v-row>
        </v-container>
      </td>
    </template>
    <template #actions="{ item }">
      <v-btn
        outlined
        small
        @click.stop.prevent="goToDetails(item.id)"
      >
        Go to details
      </v-btn>
    </template>
  </base-table>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import ExperimentsAPI from '@/api/ExperimentsAPI';

export default {
  name: 'ExperimentsTable',
  components: {
    BaseTable,
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', sortable: false, width: '5%' },
        { text: 'Name', value: 'name' },
        { text: 'Date', value: 'created_at' },
        { text: 'Author', value: 'creator' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      experiments: [],
    };
  },
  created() {
    ExperimentsAPI.index()
        .then(({ data }) => {
          this.experiments = data;
        });
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: 'experiment-detailed', params: { id } });
    },
  },
};
</script>
  