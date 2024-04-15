<template>
  <div class="d-flex">
    <v-divider class="my-auto mr-2" />
    {{ text }}
    <v-divider class="my-auto ml-2" />
  </div>
</template>

<script>
export default {
  name: 'HorizontalTextDivider',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
