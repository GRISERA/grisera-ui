<template>
  <base-table
    :headers="headers"
    :items="activityExecutions"
    :show-expand="true"
  >
    <template #[`item.name`]="{ item }">
      <div
        :test-data="item.name"
        test-title-data="activity-execution-title"
      >
        {{ item.name }}
      </div>
    </template>
    <template #[`item.type`]="{ item }">
      <td>
        <v-chip
          :color="getActivityTypeChipColor(item.activity.type)"
          :small="true"
        >
          {{ item.activity.type }}
        </v-chip>
      </td>
    </template>
    <template #[`item._participants_count`]="{ item }">
      <td>
        <v-badge
          :content="item?.participants?.length || '0'"
          inline
        />
      </td>
    </template>
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
            <template v-if="item.additionalParameters">
              <horizontal-text-divider
                class="col-12"
                text="Additional parameters"
              />
              <v-col
                v-for="additionalParameter in item.additionalParameters.filter(key => key === 'scenarioExecutionName')"
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
        <template v-if="item?.participants?.length">
          <activity-executions-participant-table-component
            :execution-id="item.id"
            :participants="item.participants"
          />
        </template>
      </td>
    </template>
    <template
      v-if="canEditActivityExecution"
      #actions="{ item }"
    >
      <v-icon
        :data-testid="'edit-activity-execution'"
        class="mr-2"
        color="primary"
        @click.stop.prevent="$emit('activity-execution:edit', item)"
      >
        mdi-pen
      </v-icon>
    </template>
  </base-table>
</template>

<script>
import ActivityExecutionsParticipantTableComponent from '@/components/ActivityExecutionsParticipantTableComponent.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';

export default {
  name: 'ActivityExecutionsListingComponent',
  components: {
    HorizontalTextDivider,
    BaseTable,
    ActivityExecutionsParticipantTableComponent,
  },
  props: {
    activityExecutions: {
      type: Array,
      default: () => (
        []
      ),
    },
    canEditActivityExecution: Boolean,
  },
  data() {
    return {
      activityExecutionNames: {},
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Type', value: 'type', sortable: true },
        { text: 'Participants', value: '_participants_count', sortable: true },
      ],
    };
  },
  created() {
    if (this.canEditActivityExecution) {
      this.headers.push({ text: 'Actions', value: 'actions', sortable: false });
    }
  },
  methods: {
    getActivityTypeChipColor(type) {
      return {
        ['Individual']: 'accent',
        ['Two persons activity']: 'primary',
        ['Group activity']: 'success',
      }[type];
    },
  },
};
</script>

<style scoped>
::v-deep .v-timeline-item__body {
  margin: auto;
}
</style>
  