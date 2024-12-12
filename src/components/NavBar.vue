<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-light mb-4"
    role="navigation"
    aria-label="Main Navigation"
  >
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h1" tabindex="0">{{ title }}</span>

      <slot></slot>

      <button
        v-if="showLogout"
        class="btn btn-outline-danger d-flex align-items-center"
        @click="onLogout"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Logout"
        aria-label="Log out of your account"
      >
        <i class="fas fa-door-open me-2" aria-hidden="true"></i>
        <span class="sr-only">Logout</span>
      </button>
    </div>
  </nav>
</template>

<script>
import { Tooltip } from "bootstrap";

export default {
  name: "Navbar",
  props: {
    title: {
      type: String,
      default: "Navbar",
    },
    showLogout: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onLogout() {
      this.$emit("logout");
    },
  },
  mounted() {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl, {
        trigger: "hover focus",
        trigger: 'hover',
      });
    });
    
  },
};
</script>

<style scoped>
.navbar {
  padding: 1rem;
}

button {
  font-size: 16px;
}

i {
  font-size: 1.2rem;
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
