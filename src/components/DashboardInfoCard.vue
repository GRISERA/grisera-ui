<template>
  <v-card
    :elevation="8"
    class="rounded-xl"
  >
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text class="text-center">
      <h1 class="display-3 font-weight-bold">
        {{ score }}
      </h1>
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
      type: Number,
      default: 0,
    },
  },
};
</script>
