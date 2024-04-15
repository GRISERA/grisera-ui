<template>
  <collapse-listing :data="scenarioExecutions.slice().reverse()">
    <template #listing-title="{ title }">
      <v-row>
        <h1>{{ title }}</h1>
      </v-row>
    </template>
    <template #panel-header="{ item }">
      <div class="my-auto font-weight-bold d-flex">
        <div class="my-auto">
          {{ item.name }}
        </div>
        <v-spacer />
        <v-icon
          v-if="canPerformActions"
          color="error"
          @click.stop.prevent="$emit('scenario-executions:delete', item)"
        >
          mdi-delete
        </v-icon>
      </div>
    </template>
    <template #panel-content="{ item }">
      <div class="caption grey--text">
        Scenario
      </div>
      <div class="subtitle-1 font-weight-bold">
        {{ item.scenario }}
      </div>
      <br>
      <activity-executions-listing-component
        :activity-executions="item.activityExecutions"
        @activity-execution:edit="editActivityExecution"
        :canEditActivityExecution="canPerformActions"
      />           
    </template>
  </collapse-listing>
</template>
    
    <script>
    import CollapseListing from '@/components/CollapseListing.vue';
    import ActivityExecutionsListingComponent from '@/components/ActivityExecutionsListingComponent.vue';
    
    export default {
      name: 'ScenarioExecutionsListingComponent',
      components: {
        CollapseListing,
        ActivityExecutionsListingComponent,
      },
      props: {
        scenarioExecutions: {
          type: Array,
          default: () => ([]),
        },
        canPerformActions: Boolean,
      },
      methods:{
        editActivityExecution(item){
            this.$emit('activity-execution:edit', item);
        },
      },
    };
    </script>
    
    <style scoped>
    ::v-deep .v-timeline-item__body {
      margin: auto;
    }
    </style>
    