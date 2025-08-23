<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    :large="true"
    class="pa-0"
  >
    <template #item="{ item }">
      <div
        :class="[
          'clear-link',
          item.disabled ? 'disabled' : '',
          item.href ? 'cursor-pointer': '',
        ]"
      >
        <a
          :href="item.href || undefined"
          style="line-height: 36px"
        >
          {{ item.text }}
        </a>
      </div>
    </template>
    <template #divider>
      <div class="px-1">
        /
      </div>
    </template>
  </v-breadcrumbs>
</template>

<script>

export default {
  name: 'AppBreadcrumbs',
  props: {
    items: {
      type: Object,
      default: () => (
        {}
      ),
    },
  },
  computed: {
    breadcrumbs() {
      return (
        this.$root.breadcrumbs || []
      ).map(config => {
        if (!config.replaceable) {
          return config;
        }

        const newText = this.items[config.entity]?.[config.key] ?? '';

        return {
          ...config,
          text: config.text.replace('[value]', newText ? `(${ newText })` : newText).trim(),
        };

        return config;
      });
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer !important;
}

.clear-link a {
  text-decoration: none;
}

.disabled {
  color: rgba(0, 0, 0, .7);
  pointer-events: none;
}

.disabled a {
  color: rgba(0, 0, 0, .7);
}
</style>