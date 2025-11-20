<template>
  <v-card
    class="export-card elevation-2 d-flex flex-column"
    height="100%"
    hover
    rounded="lg"
  >
    <div class="card-header">
      <div class="export-icon">
        <v-icon
          color="primary"
          size="24"
        >
          {{ getExportIcon(getExportFormat(exportJob)) }}
        </v-icon>
      </div>
      <div class="export-info">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <h3
              class="export-title"
              v-bind="attrs"
              v-on="on"
            >
              {{ getExportDisplayName(exportJob) }}
            </h3>
          </template>
          <span>{{ getExportDisplayName(exportJob) }}</span>
        </v-tooltip>
        <div class="export-meta">
          <v-icon
            class="mr-1"
            small
          >
            mdi-calendar
          </v-icon>
          {{ formatDate(exportJob.created_at) }}
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
            @click="$emit('delete', exportJob.id)"
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
                Cancel Export
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
              mdi-identifier
            </v-icon>
            ID
          </div>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <div
                class="meta-value export-id-ellipsis"
                v-bind="attrs"
                v-on="on"
              >
                {{ exportJob.id }}
              </div>
            </template>
            <span>{{ exportJob.id }}</span>
          </v-tooltip>
        </div>
        <div class="meta-item">
          <div class="meta-label">
            <v-icon
              class="mr-1"
              small
            >
              mdi-file-document-outline
            </v-icon>
            Format
          </div>
          <div class="meta-value">
            {{ getExportFormat(exportJob) }}
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
              mdi-flag
            </v-icon>
            Status
          </div>
          <v-chip
            :color="getStatusColor(exportJob.status)"
            class="meta-chip"
            dark
            small
          >
            {{ exportJob.status }}
          </v-chip>
        </div>
        <div
          v-if="exportJob.processed_records > 0"
          class="meta-item"
        >
          <div class="meta-label">
            <v-icon
              class="mr-1"
              small
            >
              mdi-database
            </v-icon>
            Records
          </div>
          <div class="meta-value">
            {{ formatNumber(exportJob.processed_records) }}
          </div>
        </div>
      </div>
      <div class="meta-item description-item">
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
          {{ exportJob.description || 'N/A' }}
        </div>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-actions
      v-if="exportJob.status === 'pending' || exportJob.status === 'processing'"
      class="card-actions"
    >
      <v-btn
        :loading="isRefreshing"
        block
        class="action-btn"
        color="primary"
        large
        @click="$emit('refresh', exportJob)"
      >
        <v-icon left>
          mdi-refresh
        </v-icon>
        Refresh Status
      </v-btn>
    </v-card-actions>
    <v-card-actions
      v-if="exportJob.status === 'completed'"
      class="card-actions"
    >
      <v-btn
        block
        class="action-btn"
        color="success"
        large
        @click="$emit('download', exportJob)"
      >
        <v-icon left>
          mdi-download
        </v-icon>
        Download Export
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ExportCard',
  props: {
    exportJob: {
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
    getExportIcon(format) {
      switch (format) {
        case 'json':
          return 'mdi-code-json';
        case 'csv':
          return 'mdi-file-delimited-outline';
        case 'xml':
          return 'mdi-xml';
        default:
          return 'mdi-export';
      }
    },
    getExportDisplayName(exportJob) {
      const format = this.getExportFormat(exportJob);
      return `${ format.toUpperCase() } Export`;
    },
    getExportFormat(exportJob) {
      return exportJob.file_type || exportJob.export_format || 'json';
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
    formatNumber(number) {
      return new Intl.NumberFormat().format(number);
    },
  },
};
</script>

<style scoped>
.export-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.export-card:hover {
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

.export-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.export-info {
  flex: 1;
  min-width: 0;
}

.export-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.export-meta {
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

.export-card:hover .menu-btn {
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

.export-id-ellipsis {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.description-item {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
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