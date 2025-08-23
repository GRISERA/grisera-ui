<template>
  <v-container fluid class="parameters-view">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap">
          <div class="d-flex align-center mb-3 mb-md-0">
            <v-icon large color="primary" class="mr-3">
              mdi-tune-variant
            </v-icon>
            <div>
              <h1 class="text-h4 text-md-h4 text-sm-h5 font-weight-bold primary--text">
                Parameters Management
              </h1>
              <p class="text-subtitle-1 text-sm-body-2 mb-0 grey--text">
                Configure custom parameters for different entity types
              </p>
            </div>
          </div>
          <v-chip
            color="primary"
            outlined
            class="font-weight-medium"
            small
          >
            {{ totalParametersCount }} Total Parameters
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- Tabs Section -->
    <v-card elevation="2" class="parameters-card">
      <v-tabs
        v-model="activeTab"
        background-color="grey lighten-4"
        color="primary"
        slider-color="primary"
        grow
        show-arrows
      >
        <v-tab
          v-for="type in types"
          :key="type.name"
          class="font-weight-medium"
        >
          <v-icon left class="mr-2">
            {{ getTypeIcon(type.name) }}
          </v-icon>
          {{ transformParameterName(type.name) }}
          <v-chip
            v-if="getParameterCountForType(type.name) > 0"
            small
            color="primary"
            class="ml-2"
          >
            {{ getParameterCountForType(type.name) }}
          </v-chip>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <v-tab-item
          v-for="type in types"
          :key="type.name"
        >
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-4">
              <div>
                <h3 class="text-h6 font-weight-bold">
                  {{ transformParameterName(type.name) }} Parameters
                </h3>
                <p class="text-body-2 grey--text mb-0">
                  {{ getTypeDescription(type.name) }}
                </p>
              </div>
            </div>
            
            <parameters-table-component
              :params="parameters"
              :type="type.name"
              @parameters-updated="onParametersUpdated"
            />
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>
<script>
import ParametersTableComponent from '@/components/ParametersTableComponent.vue';
import DummyParametersTypes from '@/const/DummyParametersTypes';
import ParametersAPI from '@/api/ParametersAPI';

export default {
  name: 'ParametersView',
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
  computed: {
    totalParametersCount() {
      return this.parameters ? this.parameters.length : 0;
    },
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
      this.types = Object.values(DummyParametersTypes).map(e => ({ name: e }));
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
        participant: 'Parameters related to study participants and their demographics',
        activity: 'Parameters for different types of activities and tasks',
        participantState: 'Parameters describing participant states and conditions',
        activityExecution: 'Parameters for activity execution instances and sessions',
      };
      return descriptionMap[type] || 'Custom parameters for this entity type';
    },

    getParameterCountForType(type) {
      if (!this.parameters) return 0;
      return this.parameters.filter(param => param.type === type).length;
    },

    onParametersUpdated(updatedParameters) {
      this.parameters = updatedParameters;
    },
  },
};
</script>

<style scoped>
.parameters-view {
  background-color: #f5f5f5;
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

/* Responsive improvements */
@media (max-width: 960px) {
  .parameters-card .v-tab {
    font-size: 0.875rem !important;
    min-width: auto !important;
    padding: 0 12px !important;
  }
  
  .parameters-card .v-tab .v-icon {
    font-size: 18px !important;
  }
}

@media (max-width: 600px) {
  .parameters-view {
    padding: 12px !important;
  }
  
  .parameters-card .v-tab {
    font-size: 0.75rem !important;
    padding: 0 8px !important;
  }
  
  .parameters-card .v-tab .v-chip {
    display: none;
  }
  
  .v-tab-item {
    min-height: 300px;
  }
}
</style>