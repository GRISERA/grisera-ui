<template>
  <v-tooltip
    bottom
  >
    <template #activator="{ on, attrs }">
      <v-icon
        :outline="true"
        v-bind="attrs"
        size="x-large"
        class="ma-1"
        v-on="on"
      >
        mdi-help-circle-outline
      </v-icon>
    </template>
    <span>{{ infoMessage }}</span>
  </v-tooltip>
</template>
<script>
export default {
  name: 'InfoToolTipComponent',
  props: {
    infoMessage: {
        type: String,
        default: '',
    },
  },
};
</script>