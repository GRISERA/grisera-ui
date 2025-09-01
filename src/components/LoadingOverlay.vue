<template>
  <div
    v-if="visible"
    class="loading-overlay"
    :class="{ 'loading-overlay--fullscreen': fullscreen }"
    v-bind="$attrs"
  >
    <div class="loading-backdrop" />
    <div class="loading-content">
      <div class="loading-spinner">
        <v-progress-circular
          :color="color"
          :size="size"
          :width="width"
          indeterminate
          data-testid="loading-spinner"
        />
      </div>
      <h3
        v-if="title"
        class="loading-title"
        data-testid="loading-title"
      >
        {{ title }}
      </h3>
      <p
        v-if="description"
        class="loading-description"
        data-testid="loading-description"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    size: {
      type: [String, Number],
      default: 60,
    },
    width: {
      type: [String, Number],
      default: 4,
    },
    title: {
      type: String,
      default: 'Loading...',
    },
    description: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-overlay--fullscreen {
  position: fixed;
  z-index: 2000;
}

.loading-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
}

.loading-content {
  position: relative;
  text-align: center;
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.loading-spinner {
  margin-bottom: 1.5rem;
}

.loading-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.loading-description {
  font-size: 0.875rem;
  color: #718096;
  line-height: 1.5;
  margin: 0;
}

/* Dark theme support */
.theme--dark .loading-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

.theme--dark .loading-content {
  background-color: rgba(30, 30, 30, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme--dark .loading-title {
  color: #f7fafc;
}

.theme--dark .loading-description {
  color: #a0aec0;
}
</style>