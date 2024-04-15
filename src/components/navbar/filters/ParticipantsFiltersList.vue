<template>
  <navigation-filters-list
    type="participants"
    :items="participants"
    :selected="selected"
    @update:selected="$emit('update:selected', $event)"
    @delete:filter="$emit('delete:filter', $event)"
  >
    <template #label="{ item }">
      {{ item.name }} {{ item.surname }}
    </template>
  </navigation-filters-list>
</template>

<script>
import ParticipantsAPI from '@/api/ParticipantsAPI';
import NavigationFiltersList from '@/components/navbar/NavigationFiltersList.vue';

export default {
  name: 'ParticipantsFiltersList',
  components: {
    NavigationFiltersList,
  },
  props: {
    selected: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
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
