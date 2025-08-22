<template>
  <div>
    <base-table
      :headers="headers"
      :items="channels"
    >
      <template #actions="{ item }">
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
      v-model="editDialog"
      :channel-data="selectedChannel"
      @saved="onChannelSaved"
      @close="editDialog = false"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import ChannelsAPI from '@/api/ChannelsAPI';
import ChannelEditDialog from './ChannelEditDialog.vue';

export default {
  name: 'ChannelsTable',
  components: {
    BaseTable,
    ChannelEditDialog,
  },
  data() {
    return {
      headers: [
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