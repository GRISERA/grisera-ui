<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12">
        <v-form
          ref="form"
          @submit.stop.prevent="validate()"
        >
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Name"
            outlined
            required
          />
          <v-text-field
            v-model="surname"
            :rules="surnameRules"
            label="Surname"
            outlined
            required
          />
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="birthDate"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="birthDate"
                :rules="birthDateRules"
                label="Date of birth"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                required
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="birthDate"
              :max="new Date().toISOString().substr(0, 10)"
              scrollable
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="modal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(birthDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <v-select
            v-model="sex"
            :items="sexList"
            label="Sex"
            outlined
            :rules="sexRules"
            required
          />
          <CustomParametersComponent
            ref="apc"
            :type="'participant'"
          />
          <v-btn
            :outlined="true"
            @click="$router.go(-1)"
          >
            Cancel
          </v-btn>
          <v-btn
            style="float: right;"
            label="Create new participant"
            color="#043865"
            type="submit"
          >
            <span style="color: white;">Create new participant</span>
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import ClassesDescriptions from '@/const/ClassesDescriptions';
import CustomParametersComponent from '../components/CustomParametersComponent.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import ParticipantsAPI from '@/api/ParticipantsAPI';

export default {
  name: 'CreateParticipantView',
  components: {
    AppBreadcrumbs,
    CustomParametersComponent,
    InfoToolTipComponent,
  },
  data: () => {
    return {
      name: '',
      surname: '',
      birthDate: '',
      sex: '',
      sexList: ['Female', 'Male'],
      nameRules: [
        n => !!n || 'Name is required',
      ],
      surnameRules: [
        s => !!s || 'Surname is required',
      ],
      birthDateRules: [
        d => !!d || 'Date of birth is required',
      ],
      sexRules: [
        s => !!s || 'Sex is required',
      ],
      modal: false,
      infoMessage: ClassesDescriptions.PARTICIPANT,
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        const newParticipant = {
          name: this.name,
          surname: this.surname,
          birthDate: this.birthDate,
          sex: this.sex,
          additionalParameters: [],
        };
        this.$refs.apc.parameters?.forEach(param => {
          if (param.selected) {
            newParticipant.additionalParameters.push({
              key: param.properties.key,
              name: param.properties.name,
              value: param.value,
            });
            this.$refs.apc.updateParameter(param);
          }
        });
        ParticipantsAPI.store(newParticipant)
            .then(() => {
              this.$router.push('/participants');
            });
      }
    },
  },
};
</script>
