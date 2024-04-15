<template>
  <v-col
    class="col-auto"
    style="overflow-y: scroll; height: 70vh"
  >
    <v-container
      class="container--fluid"
      :style="{
        height: collapse ? '20vh' : 'auto'
      }"
      @click="collapse = !collapse"
    >
      <v-row class="row-wrap">
        <v-col class="px-0 mx-1">
          <div :class="collapse ? 'title-collapse' : ''">
            {{ type.toUpperCase() }}
          </div>
        </v-col>
        <v-spacer />
        <filters-counter-badge
          v-if="!collapse"
          :count="selected.length"
        />
        <v-icon
          v-if="!collapse && type !== $route.name"
          color="white"
          @click.stop="$emit('delete:filter', type)"
        >
          mdi-delete
        </v-icon>
      </v-row>
    </v-container>
    <v-spacer />
    <filters-counter-badge
      v-if="collapse"
      :count="selected.length"
    />
    <template v-if="!collapse">
      <horizontal-divider />
      <div
        v-for="item in items"
        :key="`${ type }_${ item.id }`"
        :class="getActiveClass(item)"
      >
        <v-checkbox
          :label="item.name"
          :dark="true"
          :value="item.id"
          :input-value="selected"
          :hide-details="true"
          class="my-2 pa-2"
          @change="$emit('update:selected', $event)"
        >
          <template #label>
            <slot
              name="label"
              :item="item"
            >
              {{ item.name }}
            </slot>
          </template>
        </v-checkbox>
      </div>
    </template>
  </v-col>
</template>

<script>
import HorizontalDivider from '@/components/divider/HorizontalDivider.vue';
import FiltersCounterBadge from '@/components/navbar/badge/FiltersCounterBadge.vue';

export default {
  name: 'NavigationFiltersList',
  components: {
    FiltersCounterBadge,
    HorizontalDivider,
  },
  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      required: true,
    },
    selected: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      collapse: false,
    };
  },
  methods: {
    getActiveClass(item) {
      return this.selected.includes(item.id) ? 'active' : 'disabled';
    },
  },
};
</script>

<style scoped>
.active {
  background-color: #043865;
  box-shadow: 0 0 8px 2px #FFFFFF;
  border-radius: 6px;
}

.disabled {
  opacity: .75;
}

.title-collapse {
  writing-mode: vertical-rl;
  text-orientation: sideways;
  text-align: center;
}
</style>
