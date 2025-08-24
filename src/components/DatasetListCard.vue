<template>
  <v-card
    class="dataset-card elevation-2 d-flex flex-column"
    height="100%"
    hover
    rounded="lg"
    v-bind="$attrs"
  >
    <!-- Header -->
    <div class="card-header">
      <div class="dataset-icon">
        <v-icon
          color="primary"
          size="24"
        >
          mdi-database
        </v-icon>
      </div>
      <div class="dataset-info flex-grow-1">
        <h3
          class="dataset-title"
          data-testid="dataset-name"
        >
          {{ dataset.name }}
        </h3>
        <div class="dataset-meta">
          <v-icon
            class="mr-1"
            small
          >
            mdi-account
          </v-icon>
          {{ dataset.creator || 'Unknown' }}
        </div>
      </div>
      <v-menu
        v-if="canEdit"
        bottom
        left
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="menu-btn"
            icon
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list
          class="custom-menu"
          dense
        >
          <v-list-item
            class="menu-item"
            data-testid="dataset-edit-btn"
            @click="$emit('edit', dataset)"
          >
            <v-list-item-icon class="menu-icon">
              <v-icon
                color="primary"
                size="20"
              >
                mdi-pencil
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                Edit Dataset
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="my-1" />
          <v-list-item
            class="menu-item delete-item"
            data-testid="dataset-delete-btn"
            @click="$emit('delete', dataset)"
          >
            <v-list-item-icon class="menu-icon">
              <v-icon
                color="error"
                size="20"
              >
                mdi-delete
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-text">
                Delete Dataset
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-card-text class="card-content flex-grow-1">
      <!-- Metadata Row -->
      <div class="metadata-row">
        <div class="meta-item">
          <div class="meta-label">
            <v-icon
              class="mr-1"
              small
            >
              mdi-calendar
            </v-icon>
            Created
          </div>
          <div class="meta-value">
            {{ formatDate(dataset.date) }}
          </div>
        </div>

        <div class="meta-item">
          <div class="meta-label">
            <v-icon
              class="mr-1"
              small
            >
              mdi-shield-account
            </v-icon>
            Rights
          </div>
          <v-chip
            :color="getRightsColor(dataset.rights)"
            class="meta-chip"
            dark
            small
          >
            {{ dataset.rights || 'N/A' }}
          </v-chip>
        </div>
      </div>

      <!-- Description -->
      <div
        v-if="dataset.description"
        class="description-section"
      >
        <div class="meta-label mb-2">
          <v-icon
            class="mr-1"
            small
          >
            mdi-text
          </v-icon>
          Description
        </div>
        <div class="description-container">
          <div class="description-text">
            {{ dataset.description }}
          </div>
          <v-btn
            v-if="isDescriptionTruncated(dataset.description)"
            class="expand-btn"
            icon
            small
            data-testid="dataset-description-expand-btn"
            @click="$emit('show-description', dataset)"
          >
            <v-icon size="16">
              mdi-arrow-expand
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-actions class="card-actions">
      <v-btn
        block
        class="select-btn"
        color="primary"
        large
        data-testid="dataset-select-btn"
        @click="$emit('select', dataset)"
      >
        <v-icon left>
          mdi-check-circle
        </v-icon>
        Select and Proceed
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DatasetListCard',
  inheritAttrs: false,
  props: {
    dataset: {
      type: Object,
      required: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) {
        return 'N/A';
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    },
    getRightsColor(rights) {
      const colorMap = {
        'public': '#4CAF50',
        'private': '#FF9800',
        'restricted': '#F44336',
        'admin': '#2196F3',
        'read-only': '#9E9E9E',
        'full': '#4CAF50',
      };
      return colorMap[rights?.toLowerCase()] || '#757575';
    },
    isDescriptionTruncated(description) {
      if (!description) {
        return false;
      }
      return description.length > 120;
    },
  },
};
</script>

<style scoped>
.dataset-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.dataset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.card-header {
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.dataset-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dataset-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dataset-meta {
  color: #718096;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

.menu-btn {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.dataset-card:hover .menu-btn {
  opacity: 1;
}

.card-content {
  padding: 1.25rem;
}

.metadata-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  min-width: 0;
}

.meta-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.meta-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
}

.meta-chip {
  font-size: 0.75rem;
  font-weight: 600;
  height: 22px;
}

.description-section {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 1rem;
}

.description-text {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  padding: 1rem 1.25rem;
  background: #fafafa;
}

.select-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.025em;
  height: 44px;
}

/* Menu Styling */
.custom-menu {
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 180px;
}

.menu-item {
  min-height: 40px;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.delete-item:hover {
  background-color: rgba(244, 67, 54, 0.04);
}

.menu-icon {
  margin-right: 0.75rem;
  min-width: 24px;
}

.menu-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d3748;
}

.delete-item .menu-text {
  color: #f44336;
}

/* Description Styling */
.description-container {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.expand-btn {
  flex-shrink: 0;
  margin-top: -2px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.expand-btn:hover {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .metadata-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .card-header {
    padding: 1rem;
  }

  .card-content {
    padding: 1rem;
  }
}
</style>
