<template>
  <v-app>
    <v-main>
      <v-app-bar app color="blue" dense>
        <v-app-bar-title class="white--text"> бэбра </v-app-bar-title>
      </v-app-bar>
      <v-container>
        <v-row class="justify-center">
          <v-col>
            <v-btn color="grey" block x-large @click="reg = !reg">
              Регистрация
            </v-btn>
            <v-dialog persistent v-model="reg">
              <v-card>
                <v-form v-model="isValid">
                <v-card-title>
                  <span class="text-h5">User Profile</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          outlined
                          label="First name*"
                          v-model="firstName"
                          :rules="firstNameRules"
                          error-count ="1"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          outlined
                          label="Last name"
                          v-model="lastName"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4"> </v-col>
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          label="Email*"
                          v-model="mail"
                          :rules="emailRules"
                          error-count = "2"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          label="Password*"
                          v-model="password"
                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show2 ? 'text' : 'password'"
                          :counter="max"
                          :rules="passwordRules"
                          error-count = "2"
                          @click:append="show2 = !show2"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close()">
                    Close
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="registration()" :disabled="!isValid">
                    Save
                  </v-btn>
                </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col>
            <v-btn color="green" block x-large @click="auth = !auth">
              Вход</v-btn
            >
            <v-dialog persistent v-model="auth">
              <v-card>
                <v-form v-model="isValid">
                <v-card-title>
                  <span class="text-h5">Authorization</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4"> </v-col>
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          v-model="mail"
                          :rules="emailRules"
                          error-count = "2"
                          label="Email*"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          outlined
                          v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show1 ? 'text' : 'password'"
                          label="Password*"
                          :rules="passwordRules"
                          error-count = "2"
                           @click:append="show1 = !show1"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close()">
                    Close
                  </v-btn>
                  <v-btn  color="blue darken-1" text @click="authorization()" :disabled="!isValid">
                    Auth
                  </v-btn>
                </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios, { AxiosError } from "axios";
export default {
  data: () => {
    return {
      isValid: true,
      show1: false,
      show2: false,
      auth: false,
      reg: false,
      max: 0,
      password: "",
      passwordRules: [
        v => !!v || 'password is required',
        v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed',
        v => v.length > 5 || 'password must be longer than 5 characters',
      ],
      mail: "",
       emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      firstName: "",
      firstNameRules: [
        v => !!v || 'firstName is required',
        v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed',
      ],
      lastName: "",
      
    };
  },
  methods: {
    close() {
      this.clearFields();
      this.auth = false;
      this.reg = false;
    },
    clearFields() {
      this.password = "";
      this.mail = "";
      this.firstName = "";
      this.lastName = "";
    },
    async registration() {
      await axios
        .post("http://localhost:3100/registration", {
          password: this.password,
          mail: this.mail,
          firstName: this.firstName,
          lastName: this.lastName,
        })
        .catch((error) => {
          console.log(error);
          if (error instanceof AxiosError) {
            const message = error.response.data.message
            if (message === "EMail уже существует")
            alert(`${message}`)
          }
        });
      this.reg = !this.reg;
      this.clearFields();
      
    },
    async authorization() {
      try {
        const res = await axios.post("http://localhost:3100/auth", {
          password: this.password,
          mail: this.mail,
        });
        if (res === undefined) throw new Error();
        localStorage.setItem("token", res.data.token.value);
        this.$router.push({name: 'home'})
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
            const message = error.response.data.message
            if (message === "НЕПРАВИЛЬНЫЕ ДАННЫЕ")
            alert(`${message}`)
      }
        this.auth = !this.auth;
        this.clearFields();
      }
    },
  },
};
</script>
