<template>
  <v-card
    class="dashboard-info-card elevation-2"
    height="100%"
    hover
    rounded="lg"
  >
    <!-- Header -->
    <div class="card-header">
      <div class="info-icon">
        <v-icon
          :color="getIconColor()"
          size="24"
        >
          {{ getIcon() }}
        </v-icon>
      </div>
      <div class="info-title">
        <h3 class="title-text">
          {{ title }}
        </h3>
      </div>
    </div>

    <v-card-text class="card-content text-center">
      <div class="score-display">
        <v-progress-circular
          v-if="loading"
          :size="48"
          :width="4"
          color="grey lighten-2"
          indeterminate
        />
        <template v-else>
          <h1 class="score-number">
            {{ formatScore(score) }}
          </h1>
          <div class="score-label">
            {{ score === 'Error' ? 'Error' : pluralizeEntries(score) }}
          </div>
        </template>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'DashboardInfoCard',
  props: {
    title: {
      type: String,
      default: undefined,
    },
    score: {
      type: [Number, String],
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatScore(num) {
      if (num >= 1000000) {
        return (
          num / 1000000
        ).toFixed(1) + 'M';
      }
      if (num >= 1000) {
        return (
          num / 1000
        ).toFixed(1) + 'K';
      }
      return num.toString();
    },
    getIcon() {
      if (this.title?.includes('experiment')) {
        return 'mdi-flask';
      }
      if (this.title?.includes('activities')) {
        return 'mdi-run';
      }
      if (this.title?.includes('participant')) {
        return 'mdi-account-group';
      }
      if (this.title?.includes('time series')) {
        return 'mdi-chart-line';
      }
      return 'mdi-information';
    },
    getIconColor() {
      if (this.title?.includes('experiment')) {
        return '#FF6B35';
      }
      if (this.title?.includes('activities')) {
        return '#4CAF50';
      }
      if (this.title?.includes('participant')) {
        return '#2196F3';
      }
      if (this.title?.includes('time series')) {
        return '#9C27B0';
      }
      return '#757575';
    },
    pluralizeEntries(num) {
      if (num === 'Error') {
        return 'entries';
      }
      const intNum = parseInt(num);
      return intNum === 1 ? 'entry' : 'entries';
    },
  },
};
</script>

<style scoped>
.dashboard-info-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.dashboard-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.card-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title-text {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
}

.card-content {
  padding: 2rem 1.25rem;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1;
}

.score-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }

  .card-content {
    padding: 1.5rem 1rem;
  }

  .score-number {
    font-size: 2.5rem;
  }
}
</style>
