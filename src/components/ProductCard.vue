<template>
  <div class="product-item">
    <span
      class="icono favorite"
      :class="{ selected: product.favorite }"
      @click="onFavoriteClicked"
    ></span>
    <img :src="product.image" :alt="product.title" class="product-image" />
    <h3 class="product-title">{{ product.title }}</h3>
    <p class="product-description">{{ product.description }}</p>
    <p><strong>Price:</strong> ${{ product.price }}</p>
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
}

.favorite.selected {
  background-image: url("../assets/favorite-filled-red.svg");
}
</style>
