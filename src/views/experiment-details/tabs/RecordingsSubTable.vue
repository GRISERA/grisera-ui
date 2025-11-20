<template>
  <base-table
    :headers="headers"
    :hide-footer="true"
    :items="usefulData"
    :show-expand="false"
  >
    <template #participants="{ item }">
      <v-chip-group column>
        <v-chip
          v-for="(person, index) in item.participants"
          :key="index"
        >
          {{ person.name }} {{ person.surname }}
        </v-chip>
      </v-chip-group>
    </template>
  </base-table>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import randomHash from '@/procedures/random-hash';

export default {
  name: 'RecordingsSubTable',
  components: {
    BaseTable,
  },
  props: {
    dataToDisplay: {
      type: Object,
      default: () => (
        {}
      ),
    },
  },
  data() {
    return {
      usefulData: [],
      headers: [
        { text: 'Channel', value: 'channel_name', sortable: false },
        { text: 'Participants', value: 'participants', sortable: false },
      ],
    };
  },
  watch: {
    dataToDisplay: {
      immediate: true,
      handler(newValue) {
        this.onCreation(newValue);
      },
    },
  },
  created() {
    this.onCreation();
  },
  methods: {
    onCreation() {
      var filteredData = [];
      this.dataToDisplay.data.forEach(obj => {
        filteredData.push({
          ...obj,
          id: this.dataToDisplay.id?.[0] || randomHash(),
          channel_name: obj.channel.name,
        });
      });
      this.usefulData = filteredData;
    },
  },
};
</script>
