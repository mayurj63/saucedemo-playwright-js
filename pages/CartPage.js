const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.pageTitle = '.title';
    this.cartItems = '.cart_item';
    this.cartItemName = '.inventory_item_name';
    this.cartItemDescription = '.inventory_item_desc';
    this.cartItemPrice = '.inventory_item_price';
    this.cartItemQuantity = '.cart_quantity';
    this.removeButton = '[data-test^="remove"]';
    this.continueShoppingButton = '[data-test="continue-shopping"]';
    this.checkoutButton = '[data-test="checkout"]';
    this.cartQuantityLabel = '.cart_quantity_label';
    this.cartDescLabel = '.cart_desc_label';
  }

  /**
   * Check if cart page is loaded
   * @returns {Promise<boolean>} True if cart page is loaded
   */
  async isCartPageLoaded() {
    await this.waitForElement(this.pageTitle);
    const title = await this.getText(this.pageTitle);
    return title === 'Your Cart';
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title text
   */
  async getPageTitle() {
    return await this.getText(this.pageTitle);
  }

  /**
   * Get cart items count
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartItemsCount() {
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Get all cart item names
   * @returns {Promise<Array<string>>} Array of cart item names
   */
  async getAllCartItemNames() {
    const nameElements = await this.page.locator(this.cartItemName).all();
    const names = [];
    for (const element of nameElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  /**
   * Get all cart item prices
   * @returns {Promise<Array<string>>} Array of cart item prices
   */
  async getAllCartItemPrices() {
    const priceElements = await this.page.locator(this.cartItemPrice).all();
    const prices = [];
    for (const element of priceElements) {
      prices.push(await element.textContent());
    }
    return prices;
  }

  /**
   * Get cart item details by index
   * @param {number} index - Item index (0-based)
   * @returns {Promise<Object>} Cart item details
   */
  async getCartItemDetails(index) {
    const cartItems = await this.page.locator(this.cartItems).all();
    if (index >= cartItems.length) {
      throw new Error(`Cart item index ${index} is out of range`);
    }

    const item = cartItems[index];
    const name = await item.locator(this.cartItemName).textContent();
    const description = await item.locator(this.cartItemDescription).textContent();
    const price = await item.locator(this.cartItemPrice).textContent();
    const quantity = await item.locator(this.cartItemQuantity).textContent();

    return {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      quantity: parseInt(quantity.trim())
    };
  }

  /**
   * Remove item from cart by name
   * @param {string} itemName - Name of the item to remove
   */
  async removeItemFromCart(itemName) {
    const removeButton = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}"]`;
    await this.clickElement(removeButton);
  }

  /**
   * Remove all items from cart
   */
  async removeAllItemsFromCart() {
    const removeButtons = await this.page.locator(this.removeButton).all();
    for (const button of removeButtons) {
      await button.click();
      // Wait a bit between removals to avoid issues
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.clickElement(this.continueShoppingButton);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.clickElement(this.checkoutButton);
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>} True if cart is empty
   */
  async isCartEmpty() {
    const itemCount = await this.getCartItemsCount();
    return itemCount === 0;
  }

  /**
   * Check if specific item is in cart
   * @param {string} itemName - Name of the item to check
   * @returns {Promise<boolean>} True if item is in cart
   */
  async isItemInCart(itemName) {
    const cartItemNames = await this.getAllCartItemNames();
    return cartItemNames.includes(itemName);
  }

  /**
   * Get total quantity of all items in cart
   * @returns {Promise<number>} Total quantity
   */
  async getTotalQuantity() {
    const quantityElements = await this.page.locator(this.cartItemQuantity).all();
    let total = 0;
    for (const element of quantityElements) {
      const quantity = await element.textContent();
      total += parseInt(quantity.trim());
    }
    return total;
  }

  /**
   * Calculate total price of items in cart
   * @returns {Promise<number>} Total price
   */
  async calculateTotalPrice() {
    const prices = await this.getAllCartItemPrices();
    let total = 0;
    for (const price of prices) {
      total += parseFloat(price.replace('$', ''));
    }
    return parseFloat(total.toFixed(2));
  }

  /**
   * Verify cart page elements
   */
  async verifyCartPageElements() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
    await expect(this.page.locator(this.continueShoppingButton)).toBeVisible();
    await expect(this.page.locator(this.checkoutButton)).toBeVisible();
    await expect(this.page.locator(this.cartQuantityLabel)).toBeVisible();
    await expect(this.page.locator(this.cartDescLabel)).toBeVisible();
  }

  /**
   * Wait for cart to update after item removal
   */
  async waitForCartUpdate() {
    await this.page.waitForTimeout(1000); // Wait for DOM update
    await this.waitForPageLoad();
  }

  /**
   * Get all cart items details
   * @returns {Promise<Array<Object>>} Array of all cart item details
   */
  async getAllCartItemsDetails() {
    const itemCount = await this.getCartItemsCount();
    const items = [];
    
    for (let i = 0; i < itemCount; i++) {
      const itemDetails = await this.getCartItemDetails(i);
      items.push(itemDetails);
    }
    
    return items;
  }

  /**
   * Verify items match expected products
   * @param {Array<Object>} expectedItems - Expected items with name and price
   */
  async verifyCartItems(expectedItems) {
    const cartItems = await this.getAllCartItemsDetails();
    
    expect(cartItems.length).toBe(expectedItems.length);
    
    for (let i = 0; i < expectedItems.length; i++) {
      const expectedItem = expectedItems[i];
      const cartItem = cartItems.find(item => item.name === expectedItem.name);
      
      expect(cartItem).toBeDefined();
      expect(cartItem.price).toBe(expectedItem.price);
    }
  }
}

module.exports = CartPage;