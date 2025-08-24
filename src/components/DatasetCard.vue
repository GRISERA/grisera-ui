<template>
  <v-card
    class="dataset-card elevation-2"
    hover
    rounded="lg"
  >
    <!-- Header -->
    <div
      v-if="title"
      class="card-header"
    >
      <div class="dataset-icon">
        <v-icon
          color="primary"
          size="24"
        >
          mdi-database
        </v-icon>
      </div>
      <div class="dataset-info flex-grow-1">
        <h3 class="dataset-title">
          {{ title }}
        </h3>
      </div>
    </div>

    <v-card-text class="card-content">
      <div
        v-if="dataset"
        class="dataset-details"
      >
        <!-- Metadata Row -->
        <div class="metadata-row">
          <div class="meta-item">
            <div class="meta-label">
              <v-icon
                class="mr-1"
                small
              >
                mdi-text
              </v-icon>
              Name
            </div>
            <div class="meta-value">
              {{ dataset.name || 'N/A' }}
            </div>
          </div>

          <div class="meta-item">
            <div class="meta-label">
              <v-icon
                class="mr-1"
                small
              >
                mdi-account
              </v-icon>
              Creator
            </div>
            <div class="meta-value">
              {{ dataset.creator || 'N/A' }}
            </div>
          </div>
        </div>

        <div class="metadata-row">
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
              v-if="dataset.rights"
              :color="getRightsColor(dataset.rights)"
              class="meta-chip"
              dark
              small
            >
              {{ dataset.rights }}
            </v-chip>
            <div
              v-else
              class="meta-value"
            >
              N/A
            </div>
          </div>

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
        </div>

        <!-- Description Section -->
        <div
          v-if="dataset.description"
          class="description-section"
        >
          <div class="meta-label mb-2">
            <v-icon
              class="mr-1"
              small
            >
              mdi-information-outline
            </v-icon>
            Description
          </div>
          <div class="description-text">
            {{ dataset.description }}
          </div>
        </div>
      </div>

      <div
        v-else
        class="no-dataset"
      >
        <v-icon
          class="no-dataset-icon"
          color="grey"
          size="48"
        >
          mdi-database-off
        </v-icon>
        <div class="no-dataset-text">
          No dataset selected
        </div>
        <div class="no-dataset-subtitle">
          Select a dataset to view its details
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DatasetCard',
  props: {
    title: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    ...mapState({
      dataset: state => state.dataset,
    }),
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
  },
};
</script>

<style scoped>
.dataset-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.dataset-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
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

.metadata-row:last-child {
  margin-bottom: 0;
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
  margin-top: 1rem;
}

.description-text {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
}

.no-dataset {
  text-align: center;
  padding: 2rem 1rem;
}

.no-dataset-icon {
  margin-bottom: 1rem;
}

.no-dataset-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.no-dataset-subtitle {
  font-size: 0.875rem;
  color: #718096;
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
