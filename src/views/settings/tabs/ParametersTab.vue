<template>
  <v-tab-item>
    <v-container class="parameters-settings">
      <!-- Header Section -->
      <div class="mb-6">
        <v-row
          align="center"
          class="mb-3"
        >
          <v-col cols="auto">
            <v-icon
              color="primary"
              large
            >
              mdi-tune-variant
            </v-icon>
          </v-col>
          <v-col>
            <h2 class="text-h5 font-weight-bold">
              Additional Parameters
            </h2>
            <p class="text-body-2 grey--text mb-0">
              Configure custom parameters that can be applied to different entity types in your studies.
              These parameters allow you to capture additional data fields specific to your research needs.
            </p>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <v-alert
          border="left"
          class="mb-4"
          color="info"
          colored-border
          elevation="2"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-3">
              mdi-information
            </v-icon>
            <div>
              <strong>How it works:</strong> Additional parameters are applied per dataset and can be used in forms
              for participants, activities, participant states, and activity executions. Once configured,
              they will appear as optional fields when creating or editing these entities.
            </div>
          </div>
        </v-alert>
      </div>

      <!-- Tabs Section -->
      <v-card
        v-if="parameters && types"
        class="parameters-card"
        elevation="2"
      >
        <v-tabs
          v-model="activeTab"
          background-color="grey lighten-4"
          color="primary"
          grow
          show-arrows
          slider-color="primary"
        >
          <v-tab
            v-for="type in types"
            :key="type"
            class="font-weight-medium"
          >
            <v-icon
              class="mr-2"
              left
            >
              {{ getTypeIcon(type) }}
            </v-icon>
            {{ transformParameterName(type) }}
            <v-chip
              v-if="getParameterCountForType(type) > 0"
              class="ml-2"
              color="primary"
              small
            >
              {{ getParameterCountForType(type) }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <v-tab-item
            v-for="type in types"
            :key="type"
          >
            <v-card-text class="pa-6">
              <div class="d-flex align-center justify-space-between mb-4">
                <div>
                  <h3 class="text-h6 font-weight-bold">
                    {{ transformParameterName(type) }} Parameters
                  </h3>
                  <p class="text-body-2 grey--text mb-0">
                    {{ getTypeDescription(type) }}
                  </p>
                </div>
              </div>

              <parameters-table-component
                v-if="parameters"
                :params="parameters"
                :type="type"
                @parameters-updated="onParametersUpdated"
              />
            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
      </v-card>

      <!-- Loading State -->
      <v-card
        v-else
        class="text-center pa-8"
        elevation="2"
      >
        <v-progress-circular
          class="mb-4"
          color="primary"
          indeterminate
          size="48"
        />
        <p class="text-body-1 grey--text">
          Loading parameters...
        </p>
      </v-card>
    </v-container>
  </v-tab-item>
</template>
<script>
import ParametersAPI from '@/api/ParametersAPI';
import ParametersTableComponent from '@/components/ParametersTableComponent.vue';
import DummyParametersTypes from '@/const/DummyParametersTypes';

export default {
  name: 'ParametersTab',
  components: {
    ParametersTableComponent,
  },
  data: () => {
    return {
      parameters: [],
      types: [],
      activeTab: 0,
    };
  },
  created() {
    this.getParameters();
    this.getParametersTypes();
  },
  methods: {
    getParameters() {
      ParametersAPI.index().then(({ data }) => {
        this.parameters = data;
      }).catch(() => {
        this.parameters = [];
      });
    },

    getParametersTypes() {
      this.types = Object.values(DummyParametersTypes);
    },

    transformParameterName(name) {
      return name.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());
    },

    getTypeIcon(type) {
      const iconMap = {
        participant: 'mdi-account-circle',
        activity: 'mdi-play-circle',
        participantState: 'mdi-account-heart',
        activityExecution: 'mdi-play-box',
      };
      return iconMap[type] || 'mdi-tune';
    },

    getTypeDescription(type) {
      const descriptionMap = {
        participant: 'Custom fields for participant information and demographics',
        activity: 'Additional properties for activities and experimental tasks',
        participantState: 'Extra parameters for participant states and conditions',
        activityExecution: 'Custom data fields for activity execution instances',
      };
      return descriptionMap[type] || 'Custom parameters for this entity type';
    },

    getParameterCountForType(type) {
      if (!this.parameters) {
        return 0;
      }
      return this.parameters.filter(param => param.type === type).length;
    },

    onParametersUpdated(updatedParameters) {
      this.parameters = [...updatedParameters];
    },
  },
};
</script>

<style scoped>
.parameters-settings {
  background-color: #f8f9fa;
}

.parameters-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.parameters-card .v-tabs {
  border-bottom: 1px solid #e0e0e0;
}

.parameters-card .v-tab {
  text-transform: none !important;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.parameters-card .v-tab--active {
  color: var(--v-primary-base) !important;
  font-weight: 600;
}

.parameters-card .v-tabs-slider {
  height: 3px !important;
}

.v-tab-item {
  min-height: 400px;
}

.v-chip.v-size--small {
  font-size: 10px !important;
  height: 18px !important;
  padding: 0 6px !important;
}

.v-alert {
  border-left-width: 4px !important;
}
</style>
