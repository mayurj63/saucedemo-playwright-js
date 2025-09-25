const { expect } = require('@playwright/test');

/**
 * Page Object Model for Products Page
 * Handles elements and actions related to product listing and details
 */
class ProductPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Product listing elements
    this.title = page.locator('[data-test="title"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');

    // Product item elements - generic selectors
    this.productName = (productId) => page.locator(`[data-test="item-${productId}-title-link"] [data-test="inventory-item-name"]`);
    this.productLink = (productId) => page.locator(`[data-test="item-${productId}-title-link"]`);
    this.productImageLink = (productId) => page.locator(`[data-test="item-${productId}-img-link"]`);
    
    // Product details elements
    this.productDetailName = page.locator('[data-test="inventory-item-name"]');
    this.productDetailPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backpackImage = page.locator('[data-test="item-sauce-labs-backpack-img"]');
    
    // Add cartBadge property to represent the cart badge element
    this.cartBadge = page.locator('[data-test="cart-badge"]');
  }

  /**
   * Navigate to the products page
   * Note: Requires user to be logged in
   */
  
  /**
   * Open a product by clicking on its link
   * @param {number} productId - ID of the product to open
   */
  async openProduct(productId) {
    await this.productLink(productId).click();
  }

  /**
   * Open a product by clicking on its image
   * @param {number} productId - ID of the product to open
   */
  async openProductImage(productId) {
    await this.productImageLink(productId).click();
  }

  /**
   * Add current product to cart
   */
  async addToCart() {
    await this.addToCartButton.click();
  }

  /**
   * Remove current product from cart
   */
  async removeFromCart() {
    await this.removeButton.click();
  }

  /**
   * Navigate back to products from product details
   */
  async backToProducts() {
    await this.backToProductsButton.click();
  }

  /**
   * Go to shopping cart
   */
  async goToShoppingCart() {
    await expect(this.shoppingCartLink).toBeVisible();
    await this.shoppingCartLink.click();
  }

  // Add a method to select a product by its name
  async selectProductByName(productName) {
    const productLocator = this.page.locator(`[data-test="inventory-item-name"]`, { hasText: productName });
    await productLocator.click();
  }

  // Add a method to navigate to a product's detail page
  async getProductDetailPage(productName) {
    const productLink = this.page.locator(`[data-test="inventory-item-name"]`, { hasText: productName });
    await productLink.click();
  }

  // Validation methods
  /**
   * Assert that title is visible
   */
  async assertTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  /**
   * Assert that a product name matches expected text
   * @param {number} productId - ID of the product to check
   * @param {string} expectedName - Expected product name
   */
  async assertProductName(productId, expectedName) {
    await expect(this.productName(productId)).toContainText(expectedName);
  }

  /**
   * Assert that product details page elements are visible
   */
  async assertProductDetailsVisible() {
    await expect(this.productDetailName).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.productDetailPrice).toBeVisible();
  }

  /**
   * Assert that product price matches expected value
   * @param {string} expectedPrice - Expected price (e.g. "$29.99")
   */
  async assertProductPrice(expectedPrice) {
    await expect(this.productDetailPrice).toContainText(expectedPrice);
  }

  /**
   * Assert that backpack product image is visible
   */
  async assertBackpackImageVisible() {
    await expect(this.backpackImage).toBeVisible();
  }

  /**
   * Assert that remove button is visible (after adding to cart)
   */
  async assertRemoveButtonVisible() {
    await expect(this.removeButton).toBeVisible();
  }
}

module.exports = { ProductPage };
