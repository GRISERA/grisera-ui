<template>
  <v-btn
    class="text-none font-weight-medium"
    color="primary"
    rounded
    @click="$emit('click', $event)"
  >
    <v-icon left>
      mdi-plus
    </v-icon>
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  name: 'CreateButton',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

