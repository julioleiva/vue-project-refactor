<template>
  <form
    class="form-signin"
    @submit.prevent="onSignIn"
    aria-labelledby="form-title"
    aria-describedby="form-instructions"
  >
    <img
      class="mb-4"
      src="../assets/logo.png"
      alt="Company Logo"
      width="100"
      height="100"
    />

    <h1 id="form-title" class="h3 mb-3 font-weight-normal">Please sign in</h1>

    <p id="form-instructions" class="sr-only">
      Enter your username and password to access your account.
    </p>

    <div
      v-if="error"
      class="alert alert-danger"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </div>

    <div class="form-group">
      <label for="username">Username</label>
      <input
        v-model="username"
        type="text"
        id="username"
        class="form-control mb-2"
        placeholder="Username"
        required
        autocomplete="username"
      />
    </div>

    <div class="form-group">
      <label for="inputPassword">Password</label>
      <input
        v-model="password"
        type="password"
        id="inputPassword"
        class="form-control mb-4"
        placeholder="Password"
        required
        autocomplete="current-password"
      />
    </div>

    <button
      :disabled="loading"
      class="btn btn-lg btn-outline-dark btn-block"
      type="submit"
      aria-busy="true"
      :aria-disabled="loading"
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
import { postLoginEndpoint } from "@/helpers/constants";
import { validateFields, setToken } from "@/helpers/utils";

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
      const errors = validateFields({
        username: this.username,
        password: this.password,
      });

      if (Object.keys(errors).length) {
        this.error = "Please fill all required fields.";
        return;
      }

      this.error = null;
      this.loading = true;
      try {
        const response = await axios.post(postLoginEndpoint, {
          username: this.username,
          password: this.password,
        });
        const { token } = response.data;
        setToken(token); 
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

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
