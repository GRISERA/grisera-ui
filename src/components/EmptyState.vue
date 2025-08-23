<template>
  <div
    class="empty-state"
    v-bind="$attrs"
  >
    <div class="empty-state-content">
      <v-icon
        :color="iconColor"
        :size="iconSize"
        class="empty-icon"
        data-testid="empty-state-icon"
      >
        {{ icon }}
      </v-icon>
      <h2
        class="empty-title"
        data-testid="empty-state-title"
      >
        {{ title }}
      </h2>
      <p
        class="empty-description"
        data-testid="empty-state-description"
      >
        {{ description }}
      </p>
      <v-btn
        v-if="actionText"
        class="empty-action-btn"
        color="primary"
        data-testid="empty-state-action-btn"
        large
        rounded
        @click="$emit('action')"
      >
        <v-icon
          v-if="actionIcon"
          left
        >
          {{ actionIcon }}
        </v-icon>
        {{ actionText }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  inheritAttrs: false,
  props: {
    icon: {
      type: String,
      default: 'mdi-inbox',
    },
    iconSize: {
      type: [String, Number],
      default: 80,
    },
    iconColor: {
      type: String,
      default: '#cbd5e0',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    actionText: {
      type: String,
      default: null,
    },
    actionIcon: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped>
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  width: 100%;
  padding: 3rem 1rem;
}

.empty-state-content {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.empty-icon {
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.empty-description {
  font-size: 1rem;
  color: #718096;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.empty-action-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.025em;
  padding: 0 2rem;
}
</style>