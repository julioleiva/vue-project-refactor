<template>
  <div class="product-list">
    <h1>Product List</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="products">
      <div v-for="product in products" :key="product.id">
        <product-card 
          v-bind:product="product"
          v-on:product-favorite-clicked="toggleProductFavorite(product.id)"
        />
      </div>
    </div>
  </div>
</template> 

<script>
import axios from "axios";
import ProductCard from "../components/ProductCard.vue";
import { getProductsListEndpoint } from "@/helpers/constants";
import { toggleFavorite } from "@/helpers/utils";

export default {
  name: "ProductsList",
  components: {
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
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(getProductsListEndpoint);
        this.products = response.data.slice(0, 5).map(product => ({
          ...product,
          favorite: false,
        }));
      } catch (err) {
        this.error = "Failed to load products";
      } finally {
        this.loading = false;
      }
    },
    toggleProductFavorite(productId) {
      this.products = toggleFavorite(this.products, productId);
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
</style>
