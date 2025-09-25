const { expect } = require('@playwright/test');

/**
 * Page Object Model for Shopping Cart Page
 * Handles elements and actions related to the shopping cart
 */
class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Cart page elements
    this.title = page.locator('[data-test="title"]');
    this.quantityLabel = page.locator('[data-test="cart-quantity-label"]');
    this.descriptionLabel = page.locator('[data-test="cart-desc-label"]');
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    
    // Item in cart elements
    this.cartItemLink = (productId) => page.locator(`[data-test="item-${productId}-title-link"]`);
    this.removeItemButton = (productName) => page.locator(`[data-test="remove-${productName}"]`);
    
    // Cart action buttons
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /**
   * Remove an item from the cart
   * @param {string} productName - The name of the product (e.g., "sauce-labs-backpack")
   */
  async removeItem(productName) {
    await this.removeItemButton(productName).click();
  }

  /**
   * Continue shopping (go back to products page)
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Proceed to checkout
   */
  async checkout() {
    await this.checkoutButton.click();
  }

  // Validation methods
  /**
   * Assert that cart title is visible
   */
  async assertTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  /**
   * Assert that cart labels are visible
   */
  async assertCartLabelsVisible() {
    await expect(this.quantityLabel).toBeVisible();
    await expect(this.descriptionLabel).toBeVisible();
  }

  /**
   * Assert that a specific product is in the cart
   * @param {number} productId - ID of the product to check
   */
  async assertProductInCart(productId) {
    await expect(this.cartItemLink(productId)).toBeVisible();
  }

  /**
   * Assert the quantity of items
   * @param {string} expectedQuantity - Expected quantity (e.g. "1")
   */
  async assertItemQuantity(expectedQuantity) {
    await expect(this.itemQuantity).toContainText(expectedQuantity);
  }

  /**
   * Assert the price of the product
   * @param {string} expectedPrice - Expected price (e.g. "$29.99")
   */
  async assertProductPrice(expectedPrice) {
    await expect(this.productPrice).toContainText(expectedPrice);
  }

  /**
   * Assert that remove button is visible for a specific product
   * @param {string} productName - Name of the product (e.g., "sauce-labs-backpack")
   */
  async assertRemoveButtonVisible(productName) {
    await expect(this.removeItemButton(productName)).toBeVisible();
  }

  /**
   * Assert that checkout and continue shopping buttons are visible
   */
  async assertActionButtonsVisible() {
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }
}

module.exports = { CartPage };
