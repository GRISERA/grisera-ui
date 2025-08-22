<template>
  <v-dialog 
    v-model="dialog" 
    max-width="800"
    @close="$emit('close')"
  >
    <v-card v-if="modality">
      <v-card-title class="headline primary white--text pa-4">
        <v-icon
          color="white"
          left
        >
          mdi-pencil
        </v-icon>
        Edit Modality
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form
          ref="modalityForm"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="modality.name"
                label="Name"
                prepend-icon="mdi-text"
              />
            </v-col>
            
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="modality.description"
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
          @click="submitModality"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ModalitiesAPI from '@/api/ModalitiesAPI';

export default {
  name: 'ModalityEditDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    modalityData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      modality: null,
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
    modalityData: {
      immediate: true,
      handler(newData) {
        this.modality = { ...newData };
      },
    },
  },
  methods: {
    submitModality() {
      const apiData = ModalitiesAPI.dTOFrontToAPI(this.modality);
      ModalitiesAPI.update({ ...this.modality, ...apiData })
        .then(() => {
          this.$emit('saved', this.modality);
          this.$emit('input', false);
        })
        .catch(error => {
          console.error('Error updating modality', error);
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