<template>
  <v-card
    class="import-card elevation-2 d-flex flex-column"
    height="100%"
    hover
    rounded="lg"
  >
    <div class="card-header">
      <div class="import-icon">
        <v-icon
          color="primary"
          size="24"
        >
          {{ getFileIcon(importJob.file_name) }}
        </v-icon>
      </div>
      <div class="import-info flex-grow-1">
        <h3 class="import-title">
          {{ importJob.file_name }}
        </h3>
        <div class="import-meta">
          <v-icon
            class="mr-1"
            small
          >
            mdi-calendar
          </v-icon>
          {{ formatDate(importJob.created_at) }}
        </div>
      </div>
      <v-menu
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
            class="menu-item delete-item"
            @click="$emit('delete', importJob.id)"
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
                Cancel Import
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-card-text class="card-content flex-grow-1">
      <div class="metadata-row">
        <div class="meta-item">
          <div class="meta-label">
            <v-icon
              class="mr-1"
              small
            >
              mdi-text
            </v-icon>
            Description
          </div>
          <div class="meta-value">
            {{ importJob.description || 'N/A' }}
          </div>
        </div>
        <div class="meta-item">
          <div class="meta-label">
            <v-icon
              class="mr-1"
              small
            >
              mdi-flag
            </v-icon>
            Status
          </div>
          <v-chip
            :color="getStatusColor(importJob.status)"
            class="meta-chip"
            dark
            small
          >
            {{ importJob.status }}
          </v-chip>
        </div>
      </div>
      <div
        v-if="importJob.additional_data?.total_time_series && (importJob.status === 'pending' || importJob.status === 'processing')"
        class="progress-section"
      >
        <div class="meta-label mb-1">
          TimeSeries Progress: {{
            formatNumber(importJob.additional_data.time_series_count || 0)
          }}/{{ formatNumber(importJob.additional_data.total_time_series) }} 
          ({{ getProgressPercentage(importJob).toFixed(2) }}%)
        </div>
        <v-progress-linear
          :value="getProgressPercentage(importJob)"
          color="primary"
          height="8"
          rounded
        />
      </div>
    </v-card-text>
    <v-divider />
    <v-card-actions
      v-if="importJob.status === 'pending' || importJob.status === 'processing'"
      class="card-actions"
    >
      <v-btn
        :loading="isRefreshing"
        block
        class="action-btn"
        color="primary"
        large
        @click="$emit('refresh', importJob)"
      >
        <v-icon left>
          mdi-refresh
        </v-icon>
        Refresh Status
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ImportCard',
  props: {
    importJob: {
      type: Object,
      required: true,
    },
    isRefreshing: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'pending':
          return 'orange';
        case 'processing':
          return 'blue';
        case 'completed':
          return 'green';
        case 'failed':
          return 'red';
        default:
          return 'grey';
      }
    },
    getFileIcon(fileName) {
      if (!fileName) {
        return 'mdi-file';
      }
      const ext = fileName.split('.').pop().toLowerCase();
      if (ext === 'owl') {
        return 'mdi-owl';
      }
      if (ext === 'json') {
        return 'mdi-code-json';
      }
      return 'mdi-file-document-outline';
    },
    formatDate(dateString) {
      if (!dateString) {
        return '-';
      }
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
        return dateString;
      }
    },
    getProgressPercentage(importJob) {
      const current = importJob.additional_data?.time_series_count || 0;
      const total = importJob.additional_data?.total_time_series || 0;
      return total > 0 ? (current / total) * 100 : 0;
    },
    formatNumber(number) {
      return new Intl.NumberFormat().format(number);
    },
  },
};
</script>

<style scoped>
.import-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.import-card:hover {
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

.import-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.import-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.import-meta {
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

.import-card:hover .menu-btn {
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

.progress-section {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 1rem;
  margin-top: 1rem;
}

.card-actions {
  padding: 1rem 1.25rem;
  background: #fafafa;
}

.action-btn {
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