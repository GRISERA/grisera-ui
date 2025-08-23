<script lang="js">
export default {
  name: 'ActivityTypeChip',
  props: {
    activity: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    computedColor() {
      return {
        ['Individual']: 'accent',
        ['Two persons activity']: 'primary',
        ['Group activity']: 'success',
      }[this.activity?.type];
    },
  },
};
</script>

<template>
  <v-chip
    :color="computedColor"
    :small="true"
  >
    {{ activity.type }}
  </v-chip>
</template>
