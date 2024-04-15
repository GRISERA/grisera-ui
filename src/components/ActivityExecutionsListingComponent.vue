<template>
  <base-table
    :headers="headers"
    :items="activityExecutions"
    :show-expand="true"
  >
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
                text="Additional parameters"
                class="col-12"
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
        <template v-if="item?.participants?.length">
          <activity-executions-participant-table-component
            :execution-id="item.id"
            :participants="item.participants"
          />
        </template>
      </td>
    </template>
    <template 
      #actions="{ item }"
      v-if="canEditActivityExecution"
    >
      <v-icon
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
  import BaseTable from '@/components/base/BaseTable.vue';
  import ActivityExecutionsParticipantTableComponent from '@/components/ActivityExecutionsParticipantTableComponent.vue';
  
  export default {
    name: 'ActivityExecutionsListingComponent',
    components: {
      BaseTable,
      ActivityExecutionsParticipantTableComponent,
    },
    props: {
      activityExecutions: {
        type: Array,
        default: () => ([]),
      },
      canEditActivityExecution: Boolean,
    },
    data() {
      return {
        activityExecutionNames: {},
        headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Type', value: 'type', sortable: true },
      ],
      };
    },
    created() {
      if(this.canEditActivityExecution) {
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
  