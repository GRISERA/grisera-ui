<template>
  <v-navigation-drawer
    :mini-variant="collapse && !mobile"
    :mini-variant-width="80"
    :style="{
      width: collapse && !mobile ? '64px' : 'auto !important',
    }"
    :width="216"
    :temporary="mobile"
    :value="mobile ? drawer : true"
    app
    class="main-navigation-drawer white--text rounded-xl"
    color="primary"
    @input="$emit('update:drawer', $event)"
  >
    <template #default>
      <v-container class="main-navigation-drawer--content">
        <v-row style="display: flex; align-items: center">
          <v-col class="scrollable-navigation">
            <main-navigation-list
              :collapse="collapse"
              :hide-filters.sync="localHideFilters"
              :show-button="showButton"
            />
          </v-col>
          <template v-if="!collapse && !localHideFilters">
            <div
              v-for="filter in activeFilters"
              :key="`active_filter_item_${filter.type}`"
              style="display: contents;"
            >
              <vertical-divider />
              <component
                :is="filter.component"
                :selected.sync="filter.selected"
                @delete:filter="removeAdditionalFilter($event)"
              />
            </div>
            <template v-if="availableFilters.length">
              <vertical-divider />
              <additional-filters-list
                :available-filters="availableFilters"
                @select:filter="appendAdditionalFilter($event)"
              />
            </template>
          </template>
        </v-row>
      </v-container>
    </template>
    <template #append>
      <div
        v-if="!collapse"
        class="text-center pb-4"
        style="height: 10vh; width: 200px"
      >
        <v-btn
          :outlined="true"
          color="white"
          @click="logout()"
        >
          <v-icon
            class="ma-auto"
            left
          >
            mdi-arrow-left
          </v-icon>
          LOG OUT
        </v-btn>
        <div class="pt-8 navbar-copyrights">
          &copy; GRISERA 2025
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import VerticalDivider from '@/components/divider/VerticalDivider.vue';
import AdditionalFiltersList from '@/components/navbar/AdditionalFiltersList.vue';
import ActivitiesFiltersList from '@/components/navbar/filters/ActivitiesFiltersList.vue';
import ChannelsFiltersList from '@/components/navbar/filters/ChannelsFiltersList.vue';
import ExperimentsFiltersList from '@/components/navbar/filters/ExperimentsFiltersList.vue';
import ParticipantsFiltersList from '@/components/navbar/filters/ParticipantsFiltersList.vue';
import MainNavigationList from '@/components/navbar/MainNavigationList.vue';
import NavigationFiltersList from '@/components/navbar/NavigationFiltersList.vue';
import PossibleFilters from '@/const/PossibleFilters.js';
import AuthService from '@/services/AuthService';

export default {
  name: 'MainNavigationDrawer',
  components: {
    ActivitiesFiltersList,
    ChannelsFiltersList,
    AdditionalFiltersList,
    ParticipantsFiltersList,
    ExperimentsFiltersList,
    NavigationFiltersList,
    VerticalDivider,
    MainNavigationList,
  },
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
    drawer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeFilters: [],
      possibleFilters: PossibleFilters,
      showButton: true,
      localHideFilters: true,
    };
  },
  computed: {
    activeFiltersNames() {
      const activeFiltersNames = [];

      for (const filter of this.activeFilters) {
        activeFiltersNames.push(filter.name);
      }

      return [...activeFiltersNames];
    },
    availableFilters() {
      return this.possibleFilters.filter(f => !this.activeFiltersNames.includes(f.name));
    },
  },
  watch: {
    '$route': {
      handler(route) {
        this.activeFilters = [];
        this.appendAdditionalFilter(route.name);
      },
      immediate: true,
    },
    '$route.meta.hideFilters': {
      handler(newValue) {
        this.showButton = !newValue;
        this.localHideFilters = true;
      },
      immediate: true,
    },
  },
  methods: {
    getPossibleFilterByType(type) {
      return this.possibleFilters.find(f => f.type === type);
    },
    appendAdditionalFilter(type) {
      if (!type) {
        return;
      }

      this.activeFilters.push({ ...this.getPossibleFilterByType(type) });
    },
    removeAdditionalFilter(type) {
      this.activeFilters = this.activeFilters.filter(f => f.type !== type);
    },
    logout() {
      AuthService.logout();
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
::v-deep .v-navigation-drawer__border {
  display: none;
}

::v-deep .v-list-item--active {
  background-color: #043865;
  box-shadow: 0 0 8px 2px #FFFFFF;
  border-radius: 6px;
}

.main-navigation-drawer {
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
  0 16px 24px 2px rgba(0, 0, 0, 0.14),
  0 6px 30px 5px rgba(0, 0, 0, 0.12);
  height: calc(100vh - 16px) !important;
  margin: 8px !important;
}

/* Mobile specific styles */
@media (max-width: 599px) {
  .main-navigation-drawer {
    margin: 0 !important;
    height: 100vh !important;
    border-radius: 0 !important;
  }
}

.main-navigation-drawer--content {
  display: flex;
  align-items: center;
  height: 100%;
}

.navbar-copyrights {
  font-size: .75rem;
}

.collapse-button-wrapper {
  margin-top: 200px;
  text-align: right;
}

.collapse-button {
  margin-right: 4px;
}
</style>
