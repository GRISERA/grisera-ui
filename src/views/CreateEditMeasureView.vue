<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12">
        <v-form
          ref="form"
          @submit.stop.prevent="validate()"
        >
          <v-text-field
            v-model="name"
            hide-details="auto"
            :rules="nameRules"
            label="Name"
            outlined
            required
          />
          <v-radio-group
            v-model="type"
            row
            @change="handleRadioChange"
          >
            <v-radio
              class="pl-5 pr-16 mr-16"
              label="Categorical"
              value="Categorical"
            />
            <v-radio
              label="Numeric"
              value="Numeric"
            />
          </v-radio-group>
          <v-select
            v-model="datatype"
            :rules="datatypeRules"
            :items="dataTypeList"
            :disabled="isCategorical"
            label="Select datatype"
            outlined
            required
          />
          <v-text-field
            ref="rangeStart"
            v-model="rangeStart"
            :rules="rangeRules"
            label="Range initial point"
            :disabled="isCategorical"
            outlined
            required
          />
          <v-text-field
            ref="rangeEnd"
            v-model="rangeEnd"
            :rules="rangeRules"
            label="Range final point "
            :disabled="isCategorical"
            outlined
            required
          />
          <v-text-field
            v-model="unit"
            :rules="unitRules"
            label="Unit"
            :disabled="isCategorical"
            outlined
            required
          />
          <v-col
            v-for="(definedValue, i) in definedValueList"
            :key="i"
            class="col-12"
          >
            <v-row class="d-flex align-items-center">
              <v-text-field
                v-model="definedValue.definedValue"
                :rules="definedValueRules"
                label="Defined value"
                :disabled="isNumeric"
                outlined
                required
              />
              <v-icon
                v-if="moreThanOneValue"
                ref="deleteIcon"
                class="ml-5 delete-icon"
                color="error"
                size="32"
                @click="deleteItemDefined(definedValue, $event)"
              >
                mdi-delete
              </v-icon>
            </v-row>
          </v-col>
          <v-btn
            class="mr-6"
            :outlined="true"
            @click="addAnotherValue"
          >
            Add another
          </v-btn>
          <v-btn
            :outlined="true"
            @click="$router.go(-1)"
          >
            Cancel
          </v-btn>
          <v-btn
            style="float: right;"
            label="Create new measure"
            color="#043865"
            type="submit"
          >
            <span style="color: white;">{{ isEditMode ? 'Update measure' : 'Create new measure' }}</span>
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MeasuresAPI from '@/api/MeasuresAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';

export default {
  name: 'CreateMeasureView',
  components: {
    InfoToolTipComponent, AppBreadcrumbs,
  },
  data: () => {
    return {
      id: undefined,
      isEditMode: false,
      dataTypeList: ['int', 'float'],
      name: '',
      datatype: undefined,
      type: 'Categorical',
      sex: '',
      rangeStart: undefined,
      rangeEnd: undefined,
      unit: '',
      definedValueList: [{ definedValue: '' }],
      nameRules: [
        n => !!n || 'Name is required',
      ],
      modal: false,
    };
  },
  computed: {
    moreThanOneValue() {
      return this.definedValueList.length > 1;
    },
    isCategorical() {
      return this.type == 'Categorical';
    },
    isNumeric() {
      return this.type == 'Numeric';
    },
    datatypeRules() {
      return [
        (s) => this.isCategorical || !!s || 'Datetype is required',
      ];
    },
    rangeRules() {
      return [
        (d) => this.isCategorical || (!!d && this.properType(d)) || 'Range point of corresponding datatype is required',
      ];
    },
    unitRules() {
      return [
        (s) => this.isCategorical || !!s || 'Unit is required',
      ];
    },
    definedValueRules() {
      return [
        (s) => this.isNumeric || !!s || 'User defined value is required',
      ];
    },
  },
  watch: {
    datatype(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.validateRangeFields();
      }
    },
  },
  created() {
    MeasuresAPI.index()
        .then(({ data }) => {
          var state = data.filter(state => {
            return state.id === ~~this.$route.params.id;
          });
          if (Array.isArray(state) && state.length > 0) {
            this.id = state[0].id;
            this.isEditMode = true;
            this.name = state[0].name;
            this.type = state[0].type;
            this.source = state[0].source;
            if (state[0].hasOwnProperty('datatype')) {
              this.datatype = state[0].datatype;
            }
            if (state[0].hasOwnProperty('rangeStart')) {
              this.rangeStart = state[0].rangeStart;
            }
            if (state[0].hasOwnProperty('rangeEnd')) {
              this.rangeEnd = state[0].rangeEnd;
            }
            if (state[0].hasOwnProperty('unit')) {
              this.unit = state[0].unit;
            }
            if (state[0].hasOwnProperty('definedValue')) {
              this.definedValueList = state[0].definedValue;
            }
          }
        });
  },
  methods: {
    validateRangeFields() {
      this.$refs.rangeStart.validate();
      this.$refs.rangeEnd.validate();
    },
    properType(n) {
      if (this.datatype === 'int') {
        return !isNaN(n) && Number.parseInt(n, 10) === Number(n);
      }
      if (this.datatype === 'float') {
        return !isNaN(n) && Number.parseFloat(n) === Number(n);
      }
      return true;
    },
    validate() {
      if (this.$refs.form.validate()) {
        var newMeasure;
        if (this.type == 'Categorical') {
          newMeasure = {
            ...(this.id != undefined && { id: this.id }),
            name: this.name,
            type: this.type,
            source: 'User defined',
            definedValue: this.definedValueList,
          };
        } else {
          newMeasure = {
            ...(this.id != undefined && { id: this.id }),
            name: this.name,
            type: this.type,
            datatype: this.datatype,
            rangeStart: this.rangeStart,
            rangeEnd: this.rangeEnd,
            unit: this.unit,
            source: 'User defined',
          };
        }


        const method = this.isEditMode ? 'update' : 'store';

        MeasuresAPI[method](newMeasure).then(() => {
          this.$router.push('/measures');
        });
      }
    },
    handleRadioChange() {
      this.$refs.form.resetValidation();
    },
    deleteItemDefined(value, event) {
      const index = this.definedValueList.indexOf(value);
      if (index > -1) {
        this.definedValueList.splice(index, 1);
      }
      event.target.blur();
    },
    addAnotherValue() {
      if (this.type == 'Numeric') return;
      this.definedValueList.push({ definedValue: '' });
    },
  },
};
</script>

<style scoped>

.delete-icon {
  height: 100%;
  transform: translateY(+35%);
}

</style>