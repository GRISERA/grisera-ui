<template>
  <v-container class="container--fluid fill-height pa-0">
    <v-row class="fill-height">
      <v-col
        class="col-6 bg--primary"
        style="position: relative"
      >
        <v-img
          :width="420"
          class="centered"
          src="../Girl.svg"
        />
      </v-col>
      <v-col class="col-6">
        <v-container class="container--fluid fill-height">
          <v-row>
            <v-col class="col-8 mx-auto mb-12">
              <h1 class="text--primary display-1 font-weight-medium">
                Welcome!
              </h1>
              <span class="caption">Log in to your account</span>
            </v-col>
            <v-col class="col-8 mx-auto pb-16">
              <transition
                name="fade"                
              >
                <div v-if="formNumber === 1">
                  <v-form 
                    ref="form"
                    @keyup.native.enter="submit"
                    @submit.stop.prevent="$router.push({ name: 'datasets' })"
                  >
                    <v-text-field
                      v-model="login"
                      label="Login"
                      outlined
                      :rules="required"
                    />                
                    <v-text-field                  
                      v-model="password"
                      label="Password"
                      outlined
                      type="password"
                      :rules="validationRules"
                    />                
                    <v-row>
                      <v-col cols="6">                    
                        <v-btn
                          v-if="showComponent"
                          color="primary"
                          outlined
                          class="text-left"
                      
                          @click="formNumber++"
                        >
                          Forgot your password?
                        </v-btn>
                      </v-col>
                      <v-col
                        cols="6"
                        class="d-flex justify-end"
                      >
                        <v-btn                      
                          color="primary"
                          @click="submit"
                        >
                          Log in
                        </v-btn>
                      </v-col>
                    </v-row>                              
                  </v-form>                  
                </div>
              </transition>
              <transition
                name="fade"                
              >
                <div v-if="formNumber === 2">
                  Enter the code we send to your email.                  
                  <v-text-field                    
                    label="Code"
                    outlined
                    :rules="required"
                  />
                  <v-btn                      
                    color="primary"
                    class="text-right"
                    @click="formNumber++"
                  >
                    Send code
                  </v-btn>
                </div>
              </transition>
              <transition name="fade">                
                <div v-if="formNumber === 3">
                  Enter the new password.                  
                  <v-text-field                    
                    label="Password"
                    outlined
                    :rules="required"
                  />
                  <v-text-field                    
                    label="Repeat password"
                    outlined
                    :rules="required"
                  />                  
                  <v-btn                    
                    class="text-right"
                    color="primary"  
                    @click="formNumber++"
                  >
                    Save password
                  </v-btn>
                </div>
              </transition>
            </v-col>
            <v-col class="col-8 mx-auto mt-16">
              <v-divider class="mb-2 mx-4" />
              <span class="caption mx-auto text-center d-block">
                Don't have an account?
                <router-link
                  class="text-decoration-none"
                  to="/register"
                >
                  <b class="text--primary">Register now</b>
                </router-link>.
              </span>
              <span class="caption text-center d-block mt-2">
                © PARDS 2022
              </span>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthService from '../services/AuthService';
import config from '../../config.js';
import { mapMutations } from 'vuex';
import jwt_decode from 'jwt-decode';

export default {
  name: 'LoginView',
  data() {
    return {
      login: undefined,
      password: undefined,
      formNumber: 1,
      required: [
        v => !!v || 'This field is required',
      ],
      showComponent: false,
    };
  },
  computed: {
    tokenExpiration() {
      return new Date().getTime() + config.sessionDurationMinutes * 60000;
    },
    validationRules() {
      //return [this.required, this.passwordRule];     
      return [v => !!v || (this.showComponent ? 'The password is incorrect' : 'This field is required')];     
    },
  },
  methods: {
    ...mapMutations({
      setUser: 'setUser',
    }),
    submit() {
      this.showComponent = false;
      if (this.$refs.form.validate()) {
        AuthService.login(this.login, this.password)
            .then(({ data }) => {
              const token = data.token;
              localStorage.setItem('token', token);
              localStorage.setItem('tokenExpiration', this.tokenExpiration);
              this.setUser(jwt_decode(token));
              this.$router.push({ name: 'datasets' });
            })
            .catch(error => {
              //this.$refs.form.reset();
              //this.$refs.form.validate();              
              this.password = undefined;
              this.showComponent = true;                            
            });
      }
    },
  },
};
</script>
<style scoped>
.bg--primary {
  background-color: #043865;
}

.text--primary {
  color: #043865;
}

.caption {
  color: #9C9C9C;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
