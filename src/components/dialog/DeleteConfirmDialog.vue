<template>
  <v-dialog
    :value="active"
    :persistent="true"
    :width="500"
  >
    <v-card>
      <v-card-title class="primary white--text">
        {{ title }}
        <v-spacer />
        <v-icon
          color="white"
          @click="$emit('update:active', false)"
        >
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text class="py-0">
        <slot
          name="default"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          :text="true"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          class="primary"
          @click="$emit('submit')"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteConfirmDialog',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
