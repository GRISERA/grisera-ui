<template>
  <v-navigation-drawer
    app
    color="primary"
    class="main-navigation-drawer white--text rounded-xl"
    :style="{
      width: collapse ? '64px' : 'auto !important',
    }"
    :mini-variant="collapse"
    :mini-variant-width="80"
    :width="216"
  >
    <template #default>
      <v-container class="main-navigation-drawer--content">
        <v-row style="display: flex; align-items: center">
          <v-col style="height: 50vh">
            <main-navigation-list
              :collapse="collapse"
              :hide-filters.sync="localHideFilters"
              :show-button="showButton"
            />
          </v-col>
          <template v-if="!collapse && !localHideFilters">
            <template
              v-for="filter in activeFilters"
            >
              <vertical-divider
                :key="`active_filters_divider_${ filter.type }`"
              />
              <component
                :is="filter.component"
                :key="`active_filters_filter_${ filter.type }`"
                :selected.sync="filter.selected"
                @delete:filter="removeAdditionalFilter($event)"
              />
            </template>
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
        style="height: 10vh; width: 200px"
        class="text-center pb-4"
      >
        <v-btn
          :outlined="true"
          color="white"
          @click="logout()"
        >
          <v-icon
            left
            class="ma-auto"
          >
            mdi-arrow-left
          </v-icon>
          LOG OUT
        </v-btn>
        <div class="pt-8 navbar-copyrights">
          &copy; PARDS 2022
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

.main-navigation-drawer--content {
  overflow-y: hidden;
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
