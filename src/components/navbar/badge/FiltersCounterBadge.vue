<template>
  <v-col
    class="px-0 mx-0"
    style="display: flex; align-items: center; justify-content: space-around"
  >
    <v-badge
      :content="count || '0'"
      inline
      color="accent"
    />
  </v-col>
</template>

<script>
export default {
  name: 'FiltersCounterBadge',
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
};
</script>
