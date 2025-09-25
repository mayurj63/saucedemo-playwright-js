const { expect } = require('@playwright/test');

class ProductDetailPage {
  constructor(page) {
    this.page = page;
    this.productTitle = page.locator('.inventory_details_name.large_size'); // Adjust selector as per actual implementation
    this.productPrice = page.locator('.inventory_details_price'); // Adjust selector as per actual implementation
    this.addToCartButton = page.locator('#add-to-cart'); // Adjust selector as per actual implementation
  }

  /**
   * Validate that the product title matches the expected name
   * @param {string} expectedName - The expected product name
   */
  async validateProductName(expectedName) {
    await expect(this.productTitle).toBeVisible();
    await expect(this.productTitle).toHaveText(expectedName);
  }

  /**
   * Validate that the product price matches the expected price
   * @param {string} expectedPrice - The expected product price
   */
  async validateProductPrice(expectedPrice) {
    await expect(this.productPrice).toBeVisible();
    await expect(this.productPrice).toHaveText(expectedPrice);
  }

  /**
   * Click on the Add to Cart button
   */
  async addToCart() {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }

  /**
   * Navigate to the product detail page for a given product
   * @param {string} productName - The name of the product to view
   */
  async getProductDetailPage(productName) {
    const productLink = this.page.locator(`[data-test="inventory-item-name"]`, { hasText: productName });
    await productLink.click();
    await this.page.waitForLoadState('domcontentloaded'); // Wait for navigation to complete
  }
}

module.exports = { ProductDetailPage };
