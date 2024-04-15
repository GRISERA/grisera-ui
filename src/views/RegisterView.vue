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
                Welcome
              </h1>
              <span class="caption">Create your account</span>
            </v-col>
            <v-col class="col-8 mx-auto pb-16">
              <v-form 
                ref="form"
                v-on:keyup.native.enter="submit"
              >
                <v-text-field
                  v-model="email"
                  label="Email address"
                  outlined
                  required
                  :rules="emailRules"
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  outlined
                  type="password"
                  required
                  :rules="passwordRules"
                />
                <v-text-field
                  v-model="passwordConfirm"
                  label="Confirm password"
                  outlined
                  type="password"
                  required
                  :rules="passwordConfirmRules"
                />
                <v-checkbox
                  v-model="termsOfServices"
                  class="ma-0 pa-0"
                  :rules="termsRules"
                >
                  <template #label>
                    I accept the<span class="text--primary font-weight-bold ml-1">Terms of Services</span>.
                  </template>
                </v-checkbox>
                <span
                  v-if="errorMsg"
                  class="error--text"
                >
                  {{ errorMsg }}
                </span>
                <div class="text-right">
                  <v-btn
                    color="primary"
                    @click="submit"
                  >
                    create account
                  </v-btn>
                </div>
              </v-form>
            </v-col>
            <v-col class="col-8 mx-auto mt-16">
              <v-divider class="mb-2 mx-4" />
              <span class="caption mx-auto text-center d-block">
                Already have an account?
                <router-link
                  class="text-decoration-none"
                  to="/login"
                >
                  <b class="text--primary">Login now</b>
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
import AuthService from '../services/AuthService.js';

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      termsOfServices: false,
      errorMsg: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Invalid e-mail',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      passwordConfirmRules: [
        v => !!v || 'Password confirmation is required',
        v => this.password === v || 'Password must match',
      ],
      termsRules: [
        v => !!v || 'Accepting terms of services is required',
      ],
    };
  },
  methods: {
    submit() {
      this.errorMsg = '';
      if (this.$refs.form.validate()) {
        AuthService.register(this.email, this.password)
            .then(() => {
              this.$router.push({ name: 'login' });
            })
            .catch(error => {
              this.$refs.form.reset();
              this.errorMsg = error.response.data.error;
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
</style>