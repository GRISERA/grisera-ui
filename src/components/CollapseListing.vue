<template>
  <div>
    <slot name="listing-title" />
    <v-row justify="center">
      <v-expansion-panels accordion>
        <v-expansion-panel
          v-for="(item,i) in data"
          :key="i"
        >
          <v-expansion-panel-header>
            <slot
              name="panel-header"
              :item="item"
              :index="i"
            >
              {{ item.name }}
            </slot>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <slot
              name="panel-content"
              :item="item"
            >
              {{ item.description }}
            </slot>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'CollapseListing',
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>
