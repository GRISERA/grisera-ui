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
                          v-model="appearanceOclusionValues[i]"
                          class="ma-0 pa-0"
                        >
                          <template v-slot:label>
                            <div style="font-size: 16px;">{{ appearanceOclusionItem.title }}</div>
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
import PersonatitiesAPI from '@/api/PersonatitiesAPI';
import ApperancesAPI from '@/api/ApperancesAPI';

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
      isEditMode: true,
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
      appearanceOclusionValues: ['some', 'heavy', false],
      appearanceValues: [ AppearanceValues.APPEARANCE_NO, AppearanceValues.APPEARANCE_SOME, AppearanceValues.APPEARANCE_HEAVY ],
      participantState: Object,
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

        this.getActivityExecution(newValue);
      },
      immediate: false,
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          return;
        }

        this.getParticipant(newValue);
      },
      immediate: true,
    },
  },
  created() { 
    this.getActivityExecution(this.$route.params.activityExecution).then(data => {
      this.participantState = data.participantStates.find(participantState => participantState.participantId === this.$route.params.id);
      this.id = this.participantState.id;
      console.log(this.participantState);
      
      this.participantState.personalities?.forEach(personality => {
        if(personality.bigFiveValues){
          this.bigFiveValues = personality.bigFiveValues;
          this.selected.bigFive = true;
        }
        if(personality.panasValues){
          this.panasValues = personality.panasValues;
          this.selected.panas = true;
        }
      });
      this.participantState.appearances?.forEach(apperance => {
        if(apperance.appearanceOclusionValues){
          this.appearanceOclusionValues = apperance.appearanceOclusionValues;
          this.selected.oclusion = true;
        }
        if(apperance.apperanceSomatotypeValues){
          this.apperanceSomatotypeValues = apperance.apperanceSomatotypeValues;
          this.selected.somatotype = true;
        }
      });
    });
  },
  methods: {
    getActivityExecution(id){
      return ActivityExecutionsAPI.show(id, 4)
        .then(({ data }) => {
          this.item = data;
          return data;              
        });
    },
    getParticipant(id){
      return ParticipantsAPI.show(id)
        .then(({ data }) => {
          this.participant = data;
          return data;              
        });
    },
    performAction() {
      if (!this.$refs.form.validate()) {
        return;
      }

      console.log('is it working');
      

      var appearances = [];
      var personalities = [];

      if(this.selected.bigFive){
        var personalityAdded = false;
        for(var personality of (this.participantState.personalities || [])){
          if(personality.bigFiveValues){
            personality.bigFiveValues = this.bigFiveValues;
            personalities.push(PersonatitiesAPI.update(personality));
            personalityAdded = true;
          }
        }
        if(!personalityAdded){
          personalities.push(PersonatitiesAPI.store({ bigFiveValues: this.bigFiveValues }));
        }
      }
      if(this.selected.panas){
        var personalityAdded = false;
        for(var personality of (this.participantState.personalities || [])){
          if(personality.panasValues){
            personality.panasValues = this.panasValues;
            personalities.push(PersonatitiesAPI.update(personality));
            personalityAdded = true;
          }
        }
        if(!personalityAdded){
          personalities.push(PersonatitiesAPI.store({ panasValues: this.panasValues }));
        }
      }

      if(this.selected.somatotype){
        var appearanceAdded = false;
        for(var appearance of this.participantState.appearances || []){
          if(appearance.panasValues){
            appearance.apperanceSomatotypeValues = this.apperanceSomatotypeValues;
            appearances.push(ApperancesAPI.update(appearance));
            appearanceAdded = true;
          }
        }
        if(!appearanceAdded){
          appearances.push(ApperancesAPI.store({ apperanceSomatotypeValues: this.apperanceSomatotypeValues }));
        }
      }
      if(this.selected.oclusion){
        console.log('this.selected.oclusion', this.appearanceOclusionValues);
        var appearanceAdded = false;
        for(var appearance of this.participantState.appearances || []){
          if(appearance.appearanceOclusionValues){
            console.log('oclusion update');
            appearance.appearanceOclusionValues = this.appearanceOclusionValues;
            appearances.push(ApperancesAPI.update(appearance));
            appearanceAdded = true;
          }
        }
        if(!appearanceAdded){
          console.log('oclusion store');
          appearances.push(ApperancesAPI.store({ appearanceOclusionValues: this.appearanceOclusionValues }));
        }
      }

      Promise.all([...personalities, ...appearances]).then((results) => {
        personalities = results.slice(0, personalities.length);
        appearances = results.slice(personalities.length);

        console.log('appearances: ', appearances);
        appearances.forEach(e => console.log(e));
        console.log('personalities: ', personalities);

        const oldAppearances = this.participantState.appearances?.map(e => e.id);
        const newAppearances = appearances.map(e => e.data.id);
        const appearancesToDelete = oldAppearances?.filter(e => !newAppearances.includes(e)).map(apperance => ApperancesAPI.delete(apperance)) || [];

        const oldPersonatities = this.participantState.personalities?.map(e => e.id);
        const newPersonatities = personalities.map(e => e.data.id);
        const personatitiesToDelete = oldPersonatities?.filter(e => !newPersonatities.includes(e)).map(personality => PersonatitiesAPI.delete(personality)) || [];


        const participantStateUpdate = ParticipantStatesAPI.update({
          id: this.participantState.id,
          participantId: this.participant.id,
          personalityIds: newPersonatities,
          appearanceIds: newAppearances,
          age: this.participantState.age,
          additionalParameters: this.participantState.additionalParameters,
        });

        Promise.all([...appearancesToDelete, ...personatitiesToDelete, participantStateUpdate]).then(({ data }) => {
          console.log('newAppearances: ', newAppearances);
          console.log('oldAppearances: ', oldAppearances);
          console.log('newPersonatities: ', newPersonatities);
          console.log('oldPersonatities: ', oldPersonatities);
          console.log('data: ', data);
                  
          this.$router.go(-1);
        });
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
  