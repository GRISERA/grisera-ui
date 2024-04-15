<template>
  <v-breadcrumbs
    class="pa-0"
    :items="breadcrumbs"
    :large="true"
  >
    <template #item="{item}">
      <div
        :class="[
          'clear-link',
          item.disabled ? 'disabled' : '',
          item.href ? 'cursor-pointer': '',
        ]"
      >
        <a
          style="line-height: 36px"
          :href="item.href || undefined"
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
  computed: {
    breadcrumbs() {
      return this.$root.breadcrumbs;
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