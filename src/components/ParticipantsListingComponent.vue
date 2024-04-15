<template>
  <v-container>
    <collapse-listing :data="participants">
      <template #listing-title>
        <v-row justify="space-between">
          <h1>Participants</h1>
          <v-btn @click="createParticipant()">
            + Add
          </v-btn>
        </v-row>
      </template>
      <template #panel-header="{ item, index }">
        <slot
          name="panel-header"
          :item="item"
        >
          Participant {{ index + 1 }}
        </slot>
      </template>
      <template #panel-content="{ item }">
        <v-simple-table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{{ item.name }}</td>
            </tr>
            <tr>
              <td>Surname</td>
              <td>{{ item.surname }}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>{{ item.age }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </template>
    </collapse-listing>
  </v-container>
</template>

<script>
import CollapseListing from '@/components/CollapseListing.vue';

export default {
  name: 'ParticipantsListingComponent',
  components: {
    CollapseListing,
  },
  props: {
    participants: Array,
  },
  methods: {
    createParticipant() {
      this.$router.push({ name: 'participant-creation' });
    },
  },
};
</script>
