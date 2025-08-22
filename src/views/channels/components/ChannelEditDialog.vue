<template>
  <v-dialog 
    v-model="dialog" 
    max-width="800"
    @close="$emit('close')"
  >
    <v-card v-if="channel">
      <v-card-title class="headline primary white--text pa-4">
        <v-icon
          color="white"
          left
        >
          mdi-layers-edit
        </v-icon>
        Edit Channel
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form
          ref="channelForm"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="channel.name"
                label="Name"
                prepend-icon="mdi-layers"
              />
            </v-col>
            
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="channel.description"
                label="Description"
                prepend-icon="mdi-text"
              />
            </v-col>
          </v-row>

          <v-row 
            v-if="channel.additionalParameters && channel.additionalParameters.length > 0" 
            class="mt-2"
          >
            <v-col cols="12">
              <v-subheader>Additional Parameters</v-subheader>
              <v-divider />
            </v-col>
            <v-col
              v-for="(param, index) in channel.additionalParameters"
              :key="index"
              cols="12"
              md="6"
              class="pa-2"
            >
              <v-text-field
                v-model="param.value"
                :label="param.name"
                :prepend-icon="'mdi-tag'"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="secondary"
          text
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="submitChannel"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ChannelsAPI from '@/api/ChannelsAPI';

export default {
  name: 'ChannelEditDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    channelData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      channel: null,
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  watch: {
    channelData: {
      immediate: true,
      handler(newData) {
        this.channel = { ...newData };
      },
    },
  },
  methods: {
    submitChannel() {
      const apiData = ChannelsAPI.dTOFrontToAPI(this.channel);
      ChannelsAPI.update({ ...this.channel, ...apiData })
        .then(() => {
          this.$emit('saved', this.channel);
          this.$emit('input', false);
          this.showSuccessNotification('Channel data has been updated');
        })
        .catch(error => {
          console.error('Error updating channel', error);
          this.showErrorNotification('Failed to update channel data');
        });
    },
    showSuccessNotification(message) {
      this.$emit('notification', {
        type: 'success',
        message: message,
      });
    },
    showErrorNotification(message) {
      this.$emit('notification', {
        type: 'error',
        message: message,
      });
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>