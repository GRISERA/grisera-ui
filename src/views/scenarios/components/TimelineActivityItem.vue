<template>
  <v-timeline-item>
    <div class="d-flex">
      <div
        v-if="isMovable"
        class="d-flex flex-column"
      >
        <v-icon
          :disabled="isFirst"
          color="primary"
          @click="$emit('move:up', index)"
        >
          mdi-chevron-up
        </v-icon>
        <v-icon
          :disabled="isLast"
          color="primary"
          @click="$emit('move:down', index)"
        >
          mdi-chevron-down
        </v-icon>
      </div>
      <v-icon
        class="mx-2"
        :small="true"
        color="error"
        @click.stop.prevent="$emit('remove', index)"
      >
        mdi-delete
      </v-icon>
      <v-divider
        :vertical="true"
        class="mr-2"
      />
      <div class="d-flex align-center">
        {{ activity.name }}
      </div>
    </div>
  </v-timeline-item>
</template>

<script>
export default {
  name: 'TimelineActivityItem',
  props: {
    activity: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: undefined,
    },
    isFirst: {
      type: Boolean,
      default: false,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    isMovable: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'move:up',
    'move:down',
    'remove',
  ],
};
</script>
