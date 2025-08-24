<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col
        v-if="!isReadOnly"
        class="text-right"
      >
        <v-btn
          class="text-none font-weight-medium"
          color="primary"
          rounded
          @click.prevent.stop="createParticipant()"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Create New Participant
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <participants-table />
      </v-col>
    </v-row>

    <participant-create-dialog
      v-model="showCreateDialog"
      @participant-created="onParticipantCreated"
    />
  </v-container>
</template>

<script>
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import ParticipantCreateDialog from '@/components/ParticipantCreateDialog.vue';
import AccessRoles from '@/const/AccessRoles';
import ParticipantsTable from '@/views/participants/components/ParticipantsTable.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'ParticipantsView',
  components: {
    ParticipantsTable,
    InfoToolTipComponent,
    AppBreadcrumbs,
    ParticipantCreateDialog,
  },
  data() {
    return {
      showCreateDialog: false,
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
  methods: {
    createParticipant() {
      this.showCreateDialog = true;
    },
    onParticipantCreated() {
      this.showCreateDialog = false;
    },
  },
};
</script>