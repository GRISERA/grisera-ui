<template>
  <v-dialog
    :value="active"
    :persistent="true"
    :width="500"
    data-testid="delete-confirm-dialog"
  >
    <v-card>
      <v-card-title class="error white--text">
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
          data-testid="delete-cancel-button"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="error"
          data-testid="delete-submit-button"
          @click="$emit('submit')"
        >
          <v-icon left>
            mdi-delete
          </v-icon>
          Delete
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
