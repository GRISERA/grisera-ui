<template>
  <v-tab-item>
    <v-container class="container--fluid">
      <v-row>
        <v-col class="col-12 text-right">
          <v-row justify="end">
            <add-existing-participant-dialog
              ref="addDialog"
              :can-add-participant="!isReadOnly"
              :experiment="experiment"
              @participant:added="onParticipantAdded"
            />
          </v-row>
        </v-col>
        <v-col class="col-12 pa-6">
          <!-- Loading State -->
          <v-skeleton-loader
            v-if="loading"
            class="mx-auto"
            type="table"
          />

          <!-- Empty State -->
          <empty-state
            v-else-if="localParticipants.length === 0 && !loading"
            :show-action="!isReadOnly"
            action-icon="mdi-account-plus"
            action-text="Add First Participant"
            description="No participants have been assigned to this experiment yet. Add participants to start collecting data."
            icon="mdi-account-group-outline"
            title="No Participants Assigned"
            @action="openAddDialog"
          />

          <!-- Participants Table -->
          <base-table
            v-else
            :headers="headers"
            :items="localParticipants"
          >
            <template #[`item.sex`]="{ item }">
              <v-chip
                v-if="item.sex"
                :small="true"
                color="primary"
              >
                {{ item.sex }}
              </v-chip>
              <span v-else>-</span>
            </template>
          </base-table>
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>
</template>

<script>
import ParticipantsAPI from '@/api/ParticipantsAPI';
import AddExistingParticipantDialog from '@/components/AddExistingParticipantDialog.vue';
import BaseTable from '@/components/base/BaseTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import AccessRoles from '@/const/AccessRoles';
import { mapGetters } from 'vuex';

export default {
  name: 'ParticipantsTab',
  components: {
    AddExistingParticipantDialog,
    BaseTable,
    EmptyState,
  },
  props: {
    experiment: {
      type: Object,
      default: () => (
        {}
      ),
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headers: [
        { text: 'External ID', value: 'external_id', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Surname', value: 'surname' },
        { text: 'Birth date', value: 'birthDate' },
        { text: 'Sex', value: 'sex' },
      ],
      localParticipants: [],
      loading: false,
      hasLoaded: false,
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
  watch: {
    active: {
      immediate: true,
      handler(isActive) {
        if (isActive && !this.hasLoaded) {
          this.fetchParticipants();
        }
      },
    },
    'experiment.participants_ids': {
      handler(newIds, oldIds) {
        if (this.active && this.hasLoaded && JSON.stringify(newIds) !== JSON.stringify(oldIds)) {
          this.fetchParticipants();
        }
      },
    },
  },
  methods: {
    async fetchParticipants() {
      if (!this.experiment?.participants_ids?.length) {
        this.localParticipants = [];
        this.hasLoaded = true;
        return;
      }

      this.loading = true;
      try {
        const participants = await Promise.all(
          this.experiment.participants_ids.map(async (participantId) => {
            const { data } = await ParticipantsAPI.show(participantId);
            return data;
          }),
        );
        this.localParticipants = participants;
        this.hasLoaded = true;
      } catch (error) {
        console.error('Error fetching participants:', error);
        this.localParticipants = [];
      } finally {
        this.loading = false;
      }
    },

    onParticipantAdded() {
      this.$emit('participant:added');
    },

    openAddDialog() {
      this.$refs.addDialog.dialog = true;
    },
  },
};
</script>
