/**
 * Validates a set of fields to ensure they are not empty.
 * @param {Object} fields - An object where keys are field names and values are field values.
 * @returns {Object} - An object containing error messages for invalid fields.
 */
export function validateFields(fields) {
    const errors = {};
    for (const [key, value] of Object.entries(fields)) {
      if (!value.trim()) {
        errors[key] = `${key} is required`;
      }
    }
    return errors;
  }
  
  /**
   * Toggles the favorite state of a product in the product list.
   * @param {Array} products - The array of products.
   * @param {number} productId - The ID of the product to toggle.
   * @returns {Array} - A new array with the updated favorite state.
   */
  export function toggleFavorite(products, productId) {
    return products.map(product =>
      product.id === productId
        ? { ...product, favorite: !product.favorite }
        : product
    );
  }
  
  /**
   * Manages token operations in localStorage.
   */
  export const getToken = () => localStorage.getItem("token");
  export const setToken = token => localStorage.setItem("token", token);
  export const clearToken = () => localStorage.removeItem("token");
  