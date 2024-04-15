<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12 headline font-weight-bold">
        Manage Participant "{{ participant.name }} {{ participant.surname }}" in Activity Execution "{{ item.name }}"              
      </v-col>
      <v-col class="col-12">
        <v-card>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"  
              @submit.stop.prevent="performAction"
              :disabled="isReadOnly"      
            >
              <v-expansion-panels
                multiple
                accordion
                popout
                focusable
                v-model="panel"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header>Personality models:</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-checkbox
                      v-model="selected.bigFive"
                      :label="`Big Five Model (min: ${bigFiveMin}, max: ${bigFiveMax})`"
                    />
                    <v-container>
                      <v-slider
                        v-for="(bigFiveItem, i) in bigFive"
                        :key="i"
                        v-model="bigFiveValues[i]"
                        class="align-center"
                        :max="bigFiveMax"
                        :min="bigFiveMin"
                        step="0.01"
                        hide-details
                      >
                        <template #append>
                          <span
                            style="display: inline-block;width: 160px;"
                          >{{ bigFiveItem.title }}
                          </span>
                          <v-text-field
                            v-model="bigFiveValues[i]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            :readonly="false"
                            step="0.01"
                            :max="bigFiveMax"
                            :min="bigFiveMin"
                            :rules="[
                              v => (v<=1 && v>=0) || 'This field is required'
                            ]"
                          />
                        </template>
                      </v-slider>
                    </v-container>
                    <v-checkbox
                      v-model="selected.panas"
                      :label="`PANAS Model (min: ${bigFiveMin}, max: ${bigFiveMax})`"
                    /> 
                    <v-container>
                      <v-slider
                        v-for="(panasItem, i) in panas"
                        :key="i"
                        v-model="panasValues[i]"
                        class="align-center"
                        :max="bigFiveMax"
                        :min="bigFiveMin"
                        step="0.01"
                        hide-details
                      >
                        <template #append>
                          <span
                            style="display: inline-block;width: 160px;"
                          >{{ panasItem.title }}
                          </span>
                          <v-text-field
                            v-model="panasValues[i]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            :readonly="false"
                            step="0.01"
                            :max="bigFiveMax"
                            :min="bigFiveMin"
                            :rules="[
                              v => (v<=1 && v>=0) || 'This field is required'
                            ]"
                          />
                        </template>
                      </v-slider>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Appearance models:</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-checkbox
                      v-model="selected.somatotype"
                      :label="`Appearance Somatotype Model (min: ${appearanceSomatotypeMin}, max: ${appearanceSomatotypeMax})`"
                    />
                    <v-container>
                      <v-slider
                        v-for="(appearanceSomatotypeItem, i) in apperanceSomatotype"
                        :key="i"
                        v-model="apperanceSomatotypeValues[i]"
                        class="align-center"
                        :max="appearanceSomatotypeMax"
                        :min="appearanceSomatotypeMin"
                        step="1"
                        hide-details
                      >
                        <template #append>
                          <span
                            style="display: inline-block;width: 160px;"
                          >{{ appearanceSomatotypeItem.title }}
                          </span>
                          <v-text-field
                            v-model="apperanceSomatotypeValues[i]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            :readonly="false"
                            step="1"
                            :max="appearanceSomatotypeMax"
                            :min="appearanceSomatotypeMin"
                            :filled="true"
                            :rules="[
                              v => (v<=7 && v>=1) || 'This field is required'
                            ]"
                          />
                        </template>
                      </v-slider>
                    </v-container>
                    <v-checkbox
                      v-model="selected.oclusion"
                      label="Appearance Oclusion Model"
                    />
                    <br>
                    <v-container>
                      <v-row
                        v-for="(appearanceOclusionItem, i) in appearanceOclusion"
                        :key="i"
                      >
                        <v-radio-group
                          v-model="appearanceOclusionItem.value"
                          class="ma-0 pa-0"
                        >
                          <template v-slot:label>
                            <div style="font-size: 16px;">{{ appearanceOclusionItem.name }}</div>
                          </template>
                          <div v-if="i < 2">
                            <v-radio
                              v-for="value in appearanceValues"
                              v-bind:key="value"
                              :label="value"
                              :value="value"
                            />
                          </div>
                          <div v-else>
                            <v-radio
                              label="yes"
                              :value="true"
                            />
                            <v-radio
                              label="no"
                              :value="false"
                            />
                          </div>
                        </v-radio-group>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Additional Parameters:</v-expansion-panel-header>
                  <br>
                  <v-expansion-panel-content>
                    <v-container>
                      <CustomParametersComponent
                        ref="apc"
                        :type="'participantState'"
                      />
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-divider />
              <v-card-actions class="pa-4">
                <v-btn
                  :outlined="true"
                  @click="$router.go(-1)"
                >
                  Cancel
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  type="submit" 
                  v-if="!isReadOnly"                 
                >
                  {{ isEditMode ? 'Update' : 'Create' }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ActivityExecutionsAPI from '@/api/ActivityExecutionsAPI';
import ParticipantsAPI from '@/api/ParticipantsAPI';
import ParticipantStatesAPI from '@/api/ParticipantStatesAPI';
import Models from '@/const/ActivityExecutionParticipantManagement.js';
import CustomParametersComponent from '../components/CustomParametersComponent.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AppearanceValues from '@/const/AppearanceValues';
import AccessRoles from '@/const/AccessRoles';
import { mapGetters } from 'vuex';

export default {
  name: 'ScenarioAddEditView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    CustomParametersComponent,
  },
  data() {
    return {
      panel: [0, 1, 2, 3, 4],
      selected: {
        bigFive: false,
        panas: false,
        somatotype: false,
        oclusion: false,
      },
      id: undefined,
      item: Object,
      participant: Object,
      valid: true,
      isEditMode: false,
      participants: [],
      bigFiveMin: 0,
      bigFiveMax: 1,
      bigFiveValues: [0.5, 0.5, 0.5, 0.5, 0.5],
      bigFive: Models.bigFive,
      panas: Models.panas,
      panasValues: [0.5, 0.5],
      apperanceSomatotype: Models.somatotype,
      apperanceSomatotypeValues: [3, 3, 3],
      appearanceSomatotypeMin: 1,
      appearanceSomatotypeMax: 7,
      appearanceOclusion: Models.appearanceOclusion,
      appearanceValues: [ AppearanceValues.APPEARANCE_NO, AppearanceValues.APPEARANCE_SOME, AppearanceValues.APPEARANCE_HEAVY ],
      additionalParameters: [
        {
          name: 'Age',
          value: '23',
        },
      ],
    };
  },
  watch: {
    '$route.params.activityExecution': {
      handler(newValue) {
        if (!newValue) {
          return;
        }

        ActivityExecutionsAPI.show(~~newValue)
            .then(({ data }) => {
              this.item = data;              
            });
      },
      immediate: true,
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          return;
        }

        ParticipantsAPI.show(~~newValue)
            .then(({ data }) => {
              this.participant = data;              
            });      
        
      },
      immediate: true,
    },
  },
  created() {   
    ParticipantsAPI.index()
        .then(({ data }) => {
          this.participants = data;
        });
    ParticipantStatesAPI.index()
    .then(({ data }) => {              
        var state = data.filter(state => {        
          return state.participant === ~~this.$route.params.id && state.activityExecution === ~~this.$route.params.activityExecution;
        });
        if(Array.isArray(state) && state.length > 0){
          this.id = state[0].id;
          this.isEditMode = true;
          this.appearanceOclusion = state[0].occlusion;
          if (state[0].hasOwnProperty('panasValues')) {
            this.selected.panas = true;
            this.panasValues = state[0].panasValues;
          }  
          if (state[0].hasOwnProperty('bigFiveValues')) {
            this.selected.bigFive = true;
            this.bigFiveValues = state[0].bigFiveValues;
          } 
          if (state[0].hasOwnProperty('somatotype')) {
            this.selected.somatotype = true;
            this.apperanceSomatotypeValues = state[0].somatotype;
          }
      }
    });
  },
  methods: {
    performAction() {
      if (!this.$refs.form.validate()) {
        return;
      }

      var newParticipantState = {        
        participant: ~~this.$route.params.id,
        activityExecution: ~~this.$route.params.activityExecution,
        ...(this.selected.bigFive && { bigFiveValues: this.bigFiveValues }),
        ...(this.id != undefined && { id: this.id }),
        ...(this.selected.panas && { panasValues: this.panasValues }),
        ...(this.selected.somatotype && { somatotype: this.apperanceSomatotypeValues }),
        occlusion: this.appearanceOclusion,
        additionalParameters: [],
      };
      this.$refs.apc.parameters.forEach(param => {
        if (param.selected) {
          newParticipantState.additionalParameters.push({
            key: param.properties.key,
            name: param.properties.name,
            value: param.value,
          });
          this.$refs.apc.updateParameter(param);
        }
      });      
      const method = this.isEditMode ? 'update' : 'store';

      ParticipantStatesAPI[method](newParticipantState).then(() => {        
        this.$router.go(-1);
      });       
      
    },
  },
  computed: {
    ...mapGetters({
      getPermission: 'getPermission',
    }),
    isReadOnly() {
      return this.getPermission.role == AccessRoles.READER;
    },
  },
};
</script>

<style scoped>
::v-deep .v-timeline-item__body {
  margin: auto;
}
</style>
  