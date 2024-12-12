<template>
  <form class="form-signin" @submit.prevent="onSignIn">
    <img class="mb-4" src="../assets/logo.png" alt="" width="100" height="100">
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <input
      v-model="username"
      type="text"
      id="username"
      class="form-control mb-2"
      placeholder="Username"
      required
    />
    <input
      v-model="password"
      type="password"
      id="inputPassword"
      class="form-control mb-4"
      placeholder="Password"
      required
    />
    <button
      :disabled="loading"
      class="btn btn-lg btn-outline-dark btn-block"
      type="submit"
    >
      <span v-if="!loading">Sign in</span>
      <span
        v-else
        class="spinner-border spinner-border-sm mx-2"
        role="status"
        aria-hidden="true"
      ></span>
    </button>
  </form>
</template>

<script>
import axios from "axios";
import { postLoginEndpoint, tokenStorageName } from "@/helpers/constants";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      error: null,
    };
  },
  methods: {
    async onSignIn() {
      this.error = null;
      this.loading = true;
      try {
        const response = await axios.post(postLoginEndpoint, {
          username: this.username,
          password: this.password,
        });
        const { token } = response.data;
        localStorage.setItem(tokenStorageName, token);
        this.$router.push("/");
      } catch (err) {
        this.error = "Invalid credentials. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.alert-danger {
  margin-bottom: 1em;
  text-align: left;
}
</style>
