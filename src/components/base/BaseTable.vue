<template>
  <div>
    <v-data-table
      :headers="localHeaders"
      :items="items"
      :expanded.sync="expanded"
      :single-expand="true"
      :show-expand="showExpand"
      :hide-default-footer="hideFooter"
      @click:row="toggleExpanded"
    >
      <template #[`body.prepend`]>
        <tr class="body-prepend-spacer">
          <td :colspan="localHeaders.length" />
        </tr>
      </template>
      <template
        v-for="header in headers"
        #[`item.${header.value}`]="{ item }"
      >
        <slot
          :name="`item.${ header.value }`"
          :item="item"
        >
          {{ item[header.value] }}
        </slot>
      </template>
      <template #expanded-item="{ item }">
        <slot
          name="expanded-item"
          :item="item"
        />
      </template>
      <template #[`item.actions`]="{ item }">
        <slot
          name="actions"
          :item="item"
        />
      </template>
      <template #[`item.participants`]="{ item }">
        <slot
          name="participants"
          :item="item"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
    headers: {
      type: Array,
      default: () => ([]),
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: [],
    };
  },
  computed: {
    localHeaders() {
      const showExpand = this.showExpand
        ? [{ text: '', value: 'data-table-expand' }]
        : [];

      return [
        ...this.headers,
        ...showExpand,
      ];
    },
  },
  methods: {
    toggleExpanded(item, config) {
      this.expanded = config.isExpanded ? [] : [item];
    },
  },
};
</script>

<style scoped>
::v-deep .v-data-table__expanded__content {
    box-shadow: none !important;
}

::v-deep .v-data-table-header {
    background-color: #f5f5f5;
}

::v-deep .v-data-table-header tr th {
    border-bottom: none !important;
}

.body-prepend-spacer {
    background-color: #f5f5f5;
}

.body-prepend-spacer td:hover {
    background-color: #f5f5f5;
    cursor: default;
}

.body-prepend-spacer td {
    border-bottom: none !important;
    height: 8px !important;
}
</style>
