<template>
  <div
    v-if="product"
    class="product-item"
    role="article"
    :aria-label="`Product: ${product.title}, Price: $${product.price}`"
    tabindex="0"
    @keyup.enter="onFavoriteClicked"
    @keyup.space="onFavoriteClicked"
  >
    <button
      class="icono favorite"
      :class="{ selected: product.favorite }"
      @click="onFavoriteClicked"
      :aria-pressed="product.favorite"
      aria-label="Toggle favorite for this product"
    ></button>

    <img
      :src="product.image"
      :alt="product.title"
      class="product-image"
    />

    <h3 class="product-title" tabindex="0">
      {{ product.title }}
    </h3>

    <p class="product-description" tabindex="0">
      {{ product.description }}
    </p>

    <p tabindex="0">
      <strong>Price:</strong> ${{ product.price }}
    </p>
  </div>

  <div v-else>
    <p role="alert">Product data is not available.</p>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onFavoriteClicked() {
      this.$emit("product-favorite-clicked", this.product.id);
    },
  },
};
</script>

<style scoped>
.product-item {
  position: relative;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.product-item:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.product-image {
  width: 150px;
  height: 150px;
  object-fit: scale-down;
  margin-bottom: 10px;
}

.product-title {
  display: block;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  height: 2em;
  line-height: 1.8em;
}

.product-description {
  display: block;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  height: 3.6em;
  line-height: 1.8em;
}

.favorite {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background-image: url("../assets/favorite-filled-muted.svg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  border: none;
  background-color: transparent;
}

.favorite.selected {
  background-image: url("../assets/favorite-filled-red.svg");
}

.favorite:focus {
  outline: 2px solid #007bff;
  border-radius: 50%;
}
</style>
