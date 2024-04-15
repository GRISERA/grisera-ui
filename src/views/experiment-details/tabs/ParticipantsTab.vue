<template>
  <v-tab-item>
    <v-container class="container--fluid">
      <v-row>
        <v-col class="col-12 text-right">
          <v-row justify="end">
            <add-existing-participant-dialog
              :added-participants="participants"
              :experiment="experiment"
              :can-add-participant="!isReadOnly"
              @participant:added="$emit('participant:added')"
            />
          </v-row>
        </v-col>
        <v-col class="col-12 pa-6">
          <base-table
            :headers="headers"
            :items="participants"
          >
            <template #[`item.sex`]="{ item }">
              <v-chip
                color="primary"
                :small="true"
              >
                {{ item.sex }}
              </v-chip>
            </template>
          </base-table>
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import AddExistingParticipantDialog from '@/components/AddExistingParticipantDialog.vue';
import { mapGetters } from 'vuex';
import AccessRoles from '@/const/AccessRoles';

export default {
  name: 'ParticipantsTab',
  components: {
    AddExistingParticipantDialog,
    BaseTable,
  },
  props: ['participants', 'experiment'],
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Surname', value: 'surname' },
        { text: 'Birth date', value: 'birthDate' },
        { text: 'Sex', value: 'sex' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getPermission: 'getPermission',
    }),
    isReadOnly() {
      return this.getPermission.role == AccessRoles.READER;
    },
  },
};
</script>
