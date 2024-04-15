<template>
  <v-card
    :elevation="8"
    class="rounded-xl"
  >
    <v-card-title v-if="title">
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-container class="container--fluid">
        <v-row>
          <v-col class="col-6">
            <div class="caption">
              Name
            </div>
            <div class="subtitle-1 font-weight-bold">
              {{ dataset?.name }}
            </div>
          </v-col>
          <v-col class="col-6">
            <div class="caption">
              Creator
            </div>
            <div class="subtitle-1 font-weight-bold">
              {{ dataset?.creator }}
            </div>
          </v-col>
          <v-col class="col-6">
            <div class="caption">
              Rights
            </div>
            <div class="subtitle-1 font-weight-bold">
              <v-chip
                v-if="dataset?.rights"
                small
                color="primary"
                class="mr-1"
              >
                {{ dataset?.rights }}
              </v-chip>
            </div>
          </v-col>
          <v-col class="col-6">
            <div class="caption">
              Creation date
            </div>
            <div class="subtitle-1 font-weight-bold">
              {{ dataset?.date }}
            </div>
          </v-col>
          <v-col>
            <div class="caption">
              Description
            </div>
            <div class="subtitle-1 font-weight-bold">
              {{ dataset?.description }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DatasetCard',
  props: {
    title: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    ...mapState({
      dataset: state => state.dataset,
    }),
  },
};
</script>
