<template>
  <base-table
    :headers="headers"
    :items="participants"
    :show-expand="true"
  >
    <template #[`item.sex`]="{ item }">
      <v-chip
        color="primary"
        :small="true"
      >
        {{ item.sex }}
      </v-chip>
    </template>
    <template #expanded-item="{ item }">
      <td :colspan="6">
        <horizontal-text-divider text="Additional parameters" />
        <v-col
          v-for="additionalParameter in item.additionalParameters"
          :key="`participant_${item.id}_additional_parameter_${additionalParameter.key}`"
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
      </td>
    </template>
  </base-table>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';
import ParticipantsAPI from '@/api/ParticipantsAPI';

export default {
  name: 'ParticipantsTable',
  components: {
    HorizontalTextDivider,
    BaseTable,
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', sortable: false, width: '5%' },
        { text: 'Name', value: 'name' },
        { text: 'Surname', value: 'surname' },
        { text: 'Birth date', value: 'birthDate' },
        { text: 'Sex', value: 'sex' },
      ],
      participants: [],
    };
  },
  created() {
    ParticipantsAPI.index()
        .then(({ data }) => {
          this.participants = data;
        });
  },
};
</script>
