<template>
  <base-table
    :headers="headers"
    :items="activities"
    :show-expand="true"
  >
    <template #[`item.type`]="{ item }">
      <td>
        <v-chip
          :color="getActivityTypeChipColor(item.type)"
          :small="true"
        >
          {{ item.type }}
        </v-chip>
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
</template>

<script>
import ActivitiesAPI from '@/api/ActivitiesAPI';
import BaseTable from '@/components/base/BaseTable.vue';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';

export default {
  name: 'ActivitiesTable',
  components: {
    BaseTable,
    HorizontalTextDivider,
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', sortable: false, width: '5%' },
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
