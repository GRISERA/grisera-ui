<template>
  <div>
    <div class="button-toggle-filter">
      <v-btn
        v-if="showButton"
        :fab="true"
        :x-small="true"
        class="collapse-button mb-2"
        @click="$emit('update:hide-filters', !hideFilters)"
      >
        <v-icon>
          {{ collapseIcon }}
        </v-icon>
      </v-btn>
    </div>
    <v-list>
      <v-list-item
        v-for="route in routes"
        :key="route.name"
        :to="route.path"
      >
        <v-list-item-icon :class="collapse ? 'mx-0' : ''">
          <v-icon color="white">
            {{ route.meta?.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title style="color: white">
          {{ route.meta?.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'MainNavigationList',
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
    hideFilters: {
      type: Boolean,
      default: false,
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    collapseIcon() {
      return this.hideFilters ? 'mdi-arrow-right' : 'mdi-arrow-left';
    },
    routes() {
      return this.$router.options.routes
          .filter(r => r.meta?.icon)
          .sort((a, b) => (b.meta.order || 0) - (a.meta.order || 0));
    },
  },
};
</script>

<style scoped>
.button-toggle-filter {
  text-align: right;
  height: 40px;
}
</style>
