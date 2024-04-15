<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="col-12">
        <app-breadcrumbs :breadcrumbs="breadcrumbs" />
      </v-col>
      <v-col class="col-12">
        <v-container>
          <scenarios-listing-component :scenarios="scenarios" />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import ScenariosListingComponent from '@/components/ScenariosListingComponent.vue';

export default {
  name: 'ScenariosView',
  components: {
    ScenariosListingComponent,
    AppBreadcrumbs,
  },
  data: () => {
    return {
      scenarios: [
        {
          header: 'Scenario 1',
          header2: 'normal execution',
          activities: [
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
          ],
        }, {
          header: 'Scenario 2',
          header2: 'faster execution',
          activities: [
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
            {
              name: 'Activity name',
              description: 'Activity description',
            },
          ],
        },
      ],
      allActivities: [
        {
          name: 'Activity name',
          description: 'Activity description',
        },
        {
          name: 'Activity name',
          description: 'Activity description',
        },
        {
          name: 'Activity name',
          description: 'Activity description',
        },
        {
          name: 'Activity name',
          description: 'Activity description',
        },
      ],
    };
  },
  created() {
    this.breadcrumbs = [
      {
        text: 'Experiments',
        disabled: false,
        href: '/experiments',
      },
      {
        text: this.$route.params.header,
        disabled: true,
        href: '/experiments/',
      },
      {
        text: 'Scenarios',
        disabled: true,
        href: '/scenarios',
      },
    ];
  },
};
</script>
