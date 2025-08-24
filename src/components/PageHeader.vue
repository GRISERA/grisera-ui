<template>
  <div
    class="header-section"
    v-bind="$attrs"
  >
    <div class="header-content">
      <div class="header-left">
        <div class="page-title-row">
          <h1
            class="page-title"
            data-testid="page-title"
          >
            {{ title }}
          </h1>
        </div>
        <p
          v-if="description"
          class="page-description"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.actions || actionText"
        class="header-actions"
      >
        <slot name="actions">
          <v-btn
            v-if="actionText"
            class="create-btn"
            color="primary"
            data-testid="page-header-action-btn"
            elevation="2"
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
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
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
.header-section {
  margin-bottom: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 12px;
  margin: -1rem -1rem 1rem -1rem;
  padding: 2rem 2rem 1.5rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.page-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

.page-description {
  font-size: 1rem;
  color: #718096;
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.create-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.025em;
  padding: 0 1.5rem;
  height: 48px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    margin: -1rem -0.5rem 1rem -0.5rem;
    padding: 1.5rem 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .header-actions {
    justify-content: stretch;
  }

  .create-btn {
    width: 100%;
  }
}
</style>