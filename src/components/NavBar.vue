<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <div class="container-fluid">
      <span class="navbar-brand mb-0 h1">{{ title }}</span>

      <slot></slot>

      <button
        v-if="showLogout"
        class="btn btn-outline-danger d-flex align-items-center"
        @click="onLogout"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Logout"
      >
        <i class="fas fa-door-open me-2"></i>
        Logout
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
      trigger: 'hover',
    });
  });
}
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
</style>
