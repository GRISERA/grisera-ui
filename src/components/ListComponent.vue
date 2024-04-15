<template>
  <v-list>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
    >
      <v-list-item-content>
        <v-list-item-title v-text="item.header" />
      </v-list-item-content>
      <v-list-item-action>
        <div>
          <slot name="item-action">
            <v-btn icon>
              <v-icon color="blue lighten-1">
                mdi-plus
              </v-icon>
            </v-btn>
          </slot>
        </div>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
    name: 'ListComponent',
    props: {
        items: Array,
    },
};
</script>