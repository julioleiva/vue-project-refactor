<template>
  <div>
    <!-- Navbar -->
    <Navbar title="Product List" @logout="logout" />

    <div role="main" aria-labelledby="products-title" class="product-list">
      <h1 id="products-title" class="sr-only">Product List</h1>

      <div
        v-if="loading"
        class="loading"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        Loading...
      </div>

      <div
        v-if="error"
        class="error"
        role="alert"
        aria-live="assertive"
      >
        {{ error }}
      </div>

      <!-- Lista de Productos -->
      <div v-if="!loading && !error && products.length > 0" class="products">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-item"
          tabindex="0"
          :aria-label="`Product: ${product.title}, Price: $${product.price}`"
          @keyup.enter="toggleProductFavorite(product.id)"
        >
          <product-card
            v-bind:product="product"
            v-on:product-favorite-clicked="toggleProductFavorite(product.id)"
          />
        </div>
      </div>

      <p v-else-if="!loading && !error" class="no-products">
        No products available.
      </p>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import { toggleFavorite, clearToken } from "@/helpers/utils";
import axios from "axios";
import { getProductsListEndpoint } from "@/helpers/constants";

export default {
  name: "ProductsList",
  components: {
    Navbar,
    ProductCard,
  },
  data() {
    return {
      products: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.checkAuthentication();
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(getProductsListEndpoint);
        this.products = response.data.slice(0, 5).map((product) => ({
          ...product,
          favorite: false,
        }));
        console.log("Fetched products:", this.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        this.error = "Failed to load products.";
      } finally {
        this.loading = false;
      }
    },
    toggleProductFavorite(productId) {
      this.products = toggleFavorite(this.products, productId);
    },
    logout() {
      clearToken();
      this.$router.push("/login");
    },
    checkAuthentication() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.product-list {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  font-size: 18px;
  color: gray;
}

.error {
  color: red;
  font-size: 18px;
}

.products {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.product-item {
  outline: none;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.product-item:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.no-products {
  font-size: 18px;
  color: gray;
  text-align: center;
}
</style>
