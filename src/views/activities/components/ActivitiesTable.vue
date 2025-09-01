<template>
  <div>
    <!-- Empty State -->
    <empty-state
      v-if="activities.length === 0"
      action-icon="mdi-plus"
      action-text="Create Your First Activity"
      description="There are no activities in the system yet. Create your first activity to get started with activity management."
      icon="mdi-run"
      title="No Activities Found"
      @action="createActivity"
    />

    <!-- Activities Table -->
    <base-table
      v-else
      :headers="headers"
      :items="activities"
      :show-expand="true"
    >
      <template #[`item.type`]="{ item }">
        <td>
          <activity-type-chip :activity="item" />
        </td>
      </template>
      <template #expanded-item="{ item }">
        <td :colspan="5">
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
              <template v-if="item.additionalParameters">
                <horizontal-text-divider
                  class="col-12"
                  text="Additional parameters"
                />
                <v-col
                  v-for="additionalParameter in item.additionalParameters"
                  :key="`activity_${item.id}_additional_parameter_${additionalParameter.key}`"
                  class="col-3"
                >
                  <div
                    class="caption font-weight-bold"
                    style="color: rgb(0,0,0, .6)"
                  >
                    {{ additionalParameter.name }}
                  </div>
                  {{ additionalParameter.value }}
                </v-col>
              </template>
            </v-row>
          </v-container>
        </td>
      </template>
      <template #actions="{ item }">
        <v-btn
          outlined
          small
          @click="$router.push(`activities/${item.id}`);"
        >
          Go to details
        </v-btn>
      </template>
    </base-table>
  </div>
</template>

<script>
import ActivitiesAPI from '@/api/ActivitiesAPI';
import BaseTable from '@/components/base/BaseTable.vue';
import ActivityTypeChip from '@/components/chips/ActivityTypeChip.vue';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';
import EmptyState from '@/components/EmptyState.vue';

export default {
  name: 'ActivitiesTable',
  components: {
    ActivityTypeChip,
    BaseTable,
    EmptyState,
    HorizontalTextDivider,
  },
  data() {
    return {
      headers: [
        { text: 'External ID', value: 'external_id', sortable: false },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Type', value: 'type', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      activities: [],
    };
  },
  created() {
    ActivitiesAPI.index()
      .then(({ data }) => {
        this.activities = data;
      });
  },
  methods: {
    createActivity() {
      this.$router.push({ name: 'activity-creation' });
    },
  },
};
</script>
