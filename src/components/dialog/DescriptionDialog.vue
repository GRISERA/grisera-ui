<template>
  <v-dialog
    :value="show"
    max-width="600px"
    @input="$emit('update:show', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="primary white--text pa-4">
        <v-icon
          color="white"
          left
        >
          mdi-text-box
        </v-icon>
        Dataset Description
        <v-spacer />
        <v-btn
          icon
          @click="$emit('update:show', false)"
        >
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-6">
        <div
          v-if="dataset"
          class="mb-4"
        >
          <h3 class="text-h6 mb-2">
            {{ dataset.name }}
          </h3>
          <div class="description-full-text">
            {{ dataset.description }}
          </div>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          @click="$emit('update:show', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DescriptionDialog',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    dataset: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped>
.description-full-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4a5568;
  white-space: pre-wrap;
}
</style>
