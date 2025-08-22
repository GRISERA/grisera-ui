<template>
  <v-dialog 
    v-model="dialog" 
    max-width="800"
    @close="$emit('close')"
  >
    <v-card v-if="lifeActivity">
      <v-card-title class="headline primary white--text pa-4">
        <v-icon
          color="white"
          left
        >
          mdi-pencil
        </v-icon>
        Edit Life Activity
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form
          ref="lifeActivityForm"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="lifeActivity.name"
                label="Name"
                prepend-icon="mdi-text"
              />
            </v-col>
            
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="lifeActivity.description"
                label="Description"
                prepend-icon="mdi-text-box-outline"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="secondary"
          text
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="submitLifeActivity"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LifeActivitiesAPI from '@/api/LifeActivitiesAPI';

export default {
  name: 'LifeActivityEditDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    lifeActivityData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      lifeActivity: null,
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  watch: {
    lifeActivityData: {
      immediate: true,
      handler(newData) {
        this.lifeActivity = { ...newData };
      },
    },
  },
  methods: {
    submitLifeActivity() {
      const apiData = LifeActivitiesAPI.dTOFrontToAPI(this.lifeActivity);
      LifeActivitiesAPI.update({ ...this.lifeActivity, ...apiData })
        .then(() => {
          this.$emit('saved', this.lifeActivity);
          this.$emit('input', false);
        })
        .catch(error => {
          console.error('Error updating life activity', error);
        });
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>