const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.pageTitle = '.title';
    this.productContainer = '.inventory_container';
    this.productItems = '.inventory_item';
    this.productName = '.inventory_item_name';
    this.productDescription = '.inventory_item_desc';
    this.productPrice = '.inventory_item_price';
    this.addToCartButton = '[data-test^="add-to-cart"]';
    this.removeButton = '[data-test^="remove"]';
    this.sortDropdown = '[data-test="product_sort_container"]';
    this.shoppingCartLink = '.shopping_cart_link';
    this.shoppingCartBadge = '.shopping_cart_badge';
    this.menuButton = '#react-burger-menu-btn';
    this.menuItems = '.bm-item';
    this.logoutLink = '#logout_sidebar_link';
    this.inventoryItemImg = '.inventory_item_img';
  }

  /**
   * Check if products page is loaded
   * @returns {Promise<boolean>} True if products page is loaded
   */
  async isProductsPageLoaded() {
    await this.waitForElement(this.pageTitle);
    const title = await this.getText(this.pageTitle);
    return title === 'Products';
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title text
   */
  async getPageTitle() {
    return await this.getText(this.pageTitle);
  }

  /**
   * Get all product names
   * @returns {Promise<Array<string>>} Array of product names
   */
  async getAllProductNames() {
    const nameElements = await this.page.locator(this.productName).all();
    const names = [];
    for (const element of nameElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  /**
   * Get all product prices
   * @returns {Promise<Array<string>>} Array of product prices
   */
  async getAllProductPrices() {
    const priceElements = await this.page.locator(this.productPrice).all();
    const prices = [];
    for (const element of priceElements) {
      prices.push(await element.textContent());
    }
    return prices;
  }

  /**
   * Get product count
   * @returns {Promise<number>} Number of products displayed
   */
  async getProductCount() {
    return await this.getElementCount(this.productItems);
  }

  /**
   * Add product to cart by name
   * @param {string} productName - Name of the product to add
   */
  async addProductToCart(productName) {
    const productButton = `[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}"]`;
    await this.clickElement(productButton);
  }

  /**
   * Remove product from cart by name
   * @param {string} productName - Name of the product to remove
   */
  async removeProductFromCart(productName) {
    const removeButton = `[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}"]`;
    await this.clickElement(removeButton);
  }

  /**
   * Add multiple products to cart
   * @param {Array<string>} productNames - Array of product names to add
   */
  async addMultipleProductsToCart(productNames) {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  /**
   * Get shopping cart badge count
   * @returns {Promise<string|null>} Cart badge count or null if not visible
   */
  async getCartBadgeCount() {
    if (await this.isElementVisible(this.shoppingCartBadge)) {
      return await this.getText(this.shoppingCartBadge);
    }
    return null;
  }

  /**
   * Click shopping cart
   */
  async clickShoppingCart() {
    await this.clickElement(this.shoppingCartLink);
  }

  /**
   * Sort products
   * @param {string} sortOption - Sort option value (az, za, lohi, hilo)
   */
  async sortProducts(sortOption) {
    await this.selectOption(this.sortDropdown, sortOption);
    await this.waitForPageLoad();
  }

  /**
   * Get current sort option
   * @returns {Promise<string>} Current sort option value
   */
  async getCurrentSortOption() {
    return await this.page.locator(this.sortDropdown).inputValue();
  }

  /**
   * Open hamburger menu
   */
  async openMenu() {
    await this.clickElement(this.menuButton);
    await this.waitForElement(this.menuItems);
  }

  /**
   * Logout
   */
  async logout() {
    await this.openMenu();
    await this.clickElement(this.logoutLink);
  }

  /**
   * Click on product by name to view details
   * @param {string} productName - Name of the product
   */
  async clickProductByName(productName) {
    const productLocator = this.page.locator(this.productName, { hasText: productName });
    await productLocator.first().click();
  }

  /**
   * Get product details by index
   * @param {number} index - Product index (0-based)
   * @returns {Promise<Object>} Product details object
   */
  async getProductDetails(index) {
    const productItems = await this.page.locator(this.productItems).all();
    if (index >= productItems.length) {
      throw new Error(`Product index ${index} is out of range`);
    }

    const product = productItems[index];
    const name = await product.locator(this.productName).textContent();
    const description = await product.locator(this.productDescription).textContent();
    const price = await product.locator(this.productPrice).textContent();

    return {
      name: name.trim(),
      description: description.trim(),
      price: price.trim()
    };
  }

  /**
   * Verify products page elements
   */
  async verifyProductsPageElements() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
    await expect(this.page.locator(this.productContainer)).toBeVisible();
    await expect(this.page.locator(this.sortDropdown)).toBeVisible();
    await expect(this.page.locator(this.shoppingCartLink)).toBeVisible();
    await expect(this.page.locator(this.menuButton)).toBeVisible();
    
    // Verify at least one product is displayed
    await expect(this.page.locator(this.productItems).first()).toBeVisible();
  }

  /**
   * Check if product is in cart (button shows "Remove")
   * @param {string} productName - Name of the product
   * @returns {Promise<boolean>} True if product is in cart
   */
  async isProductInCart(productName) {
    const removeButton = `[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}"]`;
    return await this.isElementVisible(removeButton);
  }

  /**
   * Get products sorted by price (ascending)
   * @returns {Promise<Array<Object>>} Array of products with prices
   */
  async getProductsSortedByPrice() {
    const products = [];
    const productElements = await this.page.locator(this.productItems).all();
    
    for (const product of productElements) {
      const name = await product.locator(this.productName).textContent();
      const price = await product.locator(this.productPrice).textContent();
      products.push({
        name: name.trim(),
        price: parseFloat(price.replace('$', ''))
      });
    }
    
    return products.sort((a, b) => a.price - b.price);
  }
}

module.exports = ProductsPage;