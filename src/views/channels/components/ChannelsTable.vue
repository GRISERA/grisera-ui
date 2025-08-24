<template>
  <div>
    <base-table
      :headers="headers"
      :items="channels"
    >
      <template
        v-if="aclCan(aclName.CHANNEL.EDIT)"
        #actions="{ item }"
      >
        <v-icon
          class="mr-2"
          color="primary"
          @click.stop.prevent="openEditDialog(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </base-table>

    <channel-edit-dialog
      v-if="selectedChannel"
      v-model="editDialog"
      :channel-data="selectedChannel"
      @close="editDialog = false"
      @saved="onChannelSaved"
    />
  </div>
</template>

<script>
import ChannelsAPI from '@/api/ChannelsAPI';
import BaseTable from '@/components/base/BaseTable.vue';
import aclMixin from '@/mixins/acl-mixin';
import ChannelEditDialog from './ChannelEditDialog.vue';

export default {
  name: 'ChannelsTable',
  components: {
    BaseTable,
    ChannelEditDialog,
  },
  mixins: [
    aclMixin,
  ],
  data() {
    return {
      headers: [
        { text: 'External ID', value: 'external_id', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      channels: [],
      editDialog: false,
      selectedChannel: null,
    };
  },
  created() {
    this.fetchChannels();
  },
  methods: {
    fetchChannels() {
      ChannelsAPI.index()
        .then(({ data }) => {
          this.channels = data;
        });
    },
    openEditDialog(channel) {
      this.selectedChannel = { ...channel };
      this.editDialog = true;
    },
    onChannelSaved(updatedChannel) {
      const index = this.channels.findIndex(c => c.id === updatedChannel.id);
      if (index !== -1) {
        this.$set(this.channels, index, updatedChannel);
      }
    },
  },
};
</script>