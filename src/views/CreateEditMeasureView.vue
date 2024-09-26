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
    if(this.$route.params.id){
      MeasuresAPI.show(this.$route.params.id)
        .then(({ data }) => {
          this.id = data.id;
          this.isEditMode = true;
          this.name = data.name;
          this.type = data.type;
          this.source = data.source;
          this.measure_name_id = data.measure_name_id;
          if (data.hasOwnProperty('datatype')) {
            this.datatype = data.datatype;
          }
          if (data.hasOwnProperty('rangeStart')) {
            this.rangeStart = data.rangeStart;
          }
          if (data.hasOwnProperty('rangeEnd')) {
            this.rangeEnd = data.rangeEnd;
          }
          if (data.hasOwnProperty('unit')) {
            this.unit = data.unit;
          }
          if (data.hasOwnProperty('definedValue')) {
            this.definedValueList = data.definedValue;
          }
        });
    }
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
            datatype: 'string',
            definedValue: this.definedValueList,
            measure_name_id: this.measure_name_id,
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
            measure_name_id: this.measure_name_id,
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