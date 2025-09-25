const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Checkout Information Page Locators
    this.pageTitle = '.title';
    this.firstNameInput = '[data-test="firstName"]';
    this.lastNameInput = '[data-test="lastName"]';
    this.postalCodeInput = '[data-test="postalCode"]';
    this.continueButton = '[data-test="continue"]';
    this.cancelButton = '[data-test="cancel"]';
    this.errorMessage = '[data-test="error"]';
    this.errorButton = '.error-button';
    
    // Checkout Overview Page Locators
    this.cartItems = '.cart_item';
    this.cartItemName = '.inventory_item_name';
    this.cartItemPrice = '.inventory_item_price';
    this.cartItemQuantity = '.cart_quantity';
    this.paymentInformation = '.summary_info_label';
    this.shippingInformation = '.summary_info_label';
    this.subtotalLabel = '.summary_subtotal_label';
    this.taxLabel = '.summary_tax_label';
    this.totalLabel = '.summary_total_label';
    this.finishButton = '[data-test="finish"]';
    this.cancelButtonOverview = '[data-test="cancel"]';
    
    // Checkout Complete Page Locators
    this.completeHeader = '.complete-header';
    this.completeText = '.complete-text';
    this.backHomeButton = '[data-test="back-to-products"]';
    this.ponyExpressImg = '.pony_express';
  }

  // Checkout Information Page Methods
  
  /**
   * Check if checkout information page is loaded
   * @returns {Promise<boolean>} True if checkout info page is loaded
   */
  async isCheckoutInfoPageLoaded() {
    await this.waitForElement(this.pageTitle);
    const title = await this.getText(this.pageTitle);
    return title === 'Checkout: Your Information';
  }

  /**
   * Fill checkout information
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} postalCode - Postal code
   */
  async fillCheckoutInformation(firstName, lastName, postalCode) {
    await this.fillText(this.firstNameInput, firstName);
    await this.fillText(this.lastNameInput, lastName);
    await this.fillText(this.postalCodeInput, postalCode);
  }

  /**
   * Continue to checkout overview
   */
  async continueToOverview() {
    await this.clickElement(this.continueButton);
  }

  /**
   * Cancel checkout from information page
   */
  async cancelCheckout() {
    await this.clickElement(this.cancelButton);
  }

  /**
   * Get checkout information error message
   * @returns {Promise<string>} Error message text
   */
  async getCheckoutErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if checkout error message is displayed
   * @returns {Promise<boolean>} True if error message is visible
   */
  async isCheckoutErrorMessageDisplayed() {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Close checkout error message
   */
  async closeCheckoutErrorMessage() {
    if (await this.isElementVisible(this.errorButton)) {
      await this.clickElement(this.errorButton);
    }
  }

  // Checkout Overview Page Methods

  /**
   * Check if checkout overview page is loaded
   * @returns {Promise<boolean>} True if checkout overview page is loaded
   */
  async isCheckoutOverviewPageLoaded() {
    await this.waitForElement(this.pageTitle);
    const title = await this.getText(this.pageTitle);
    return title === 'Checkout: Overview';
  }

  /**
   * Get checkout overview items count
   * @returns {Promise<number>} Number of items in checkout overview
   */
  async getOverviewItemsCount() {
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Get all overview item names
   * @returns {Promise<Array<string>>} Array of item names
   */
  async getAllOverviewItemNames() {
    const nameElements = await this.page.locator(this.cartItemName).all();
    const names = [];
    for (const element of nameElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  /**
   * Get subtotal amount
   * @returns {Promise<number>} Subtotal amount
   */
  async getSubtotal() {
    const subtotalText = await this.getText(this.subtotalLabel);
    return parseFloat(subtotalText.replace('Item total: $', ''));
  }

  /**
   * Get tax amount
   * @returns {Promise<number>} Tax amount
   */
  async getTax() {
    const taxText = await this.getText(this.taxLabel);
    return parseFloat(taxText.replace('Tax: $', ''));
  }

  /**
   * Get total amount
   * @returns {Promise<number>} Total amount
   */
  async getTotal() {
    const totalText = await this.getText(this.totalLabel);
    return parseFloat(totalText.replace('Total: $', ''));
  }

  /**
   * Get payment information text
   * @returns {Promise<string>} Payment information
   */
  async getPaymentInformation() {
    const paymentElements = await this.page.locator(this.paymentInformation).all();
    if (paymentElements.length > 0) {
      return await paymentElements[0].textContent();
    }
    return '';
  }

  /**
   * Get shipping information text
   * @returns {Promise<string>} Shipping information
   */
  async getShippingInformation() {
    const shippingElements = await this.page.locator(this.shippingInformation).all();
    if (shippingElements.length > 1) {
      return await shippingElements[1].textContent();
    }
    return '';
  }

  /**
   * Finish checkout
   */
  async finishCheckout() {
    await this.clickElement(this.finishButton);
  }

  /**
   * Cancel checkout from overview page
   */
  async cancelCheckoutFromOverview() {
    await this.clickElement(this.cancelButtonOverview);
  }

  /**
   * Verify checkout calculations
   * @param {Array<Object>} expectedItems - Expected items with prices
   * @param {number} expectedTaxRate - Expected tax rate
   */
  async verifyCheckoutCalculations(expectedItems, expectedTaxRate = 0.08) {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();

    // Calculate expected subtotal
    const expectedSubtotal = expectedItems.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace('$', ''));
    }, 0);

    // Calculate expected tax and total
    const expectedTax = parseFloat((expectedSubtotal * expectedTaxRate).toFixed(2));
    const expectedTotal = parseFloat((expectedSubtotal + expectedTax).toFixed(2));

    expect(subtotal).toBe(expectedSubtotal);
    expect(tax).toBe(expectedTax);
    expect(total).toBe(expectedTotal);
  }

  // Checkout Complete Page Methods

  /**
   * Check if checkout complete page is loaded
   * @returns {Promise<boolean>} True if checkout complete page is loaded
   */
  async isCheckoutCompletePageLoaded() {
    await this.waitForElement(this.completeHeader);
    const header = await this.getText(this.completeHeader);
    return header === 'Thank you for your order!';
  }

  /**
   * Get checkout complete header text
   * @returns {Promise<string>} Complete header text
   */
  async getCompleteHeaderText() {
    return await this.getText(this.completeHeader);
  }

  /**
   * Get checkout complete message text
   * @returns {Promise<string>} Complete message text
   */
  async getCompleteMessageText() {
    return await this.getText(this.completeText);
  }

  /**
   * Click back to home button
   */
  async backToProducts() {
    await this.clickElement(this.backHomeButton);
  }

  /**
   * Check if pony express image is visible
   * @returns {Promise<boolean>} True if pony express image is visible
   */
  async isPonyExpressImageVisible() {
    return await this.isElementVisible(this.ponyExpressImg);
  }

  // General Checkout Methods

  /**
   * Complete full checkout process
   * @param {Object} checkoutInfo - Checkout information object
   */
  async completeCheckoutProcess(checkoutInfo) {
    // Fill checkout information
    await this.fillCheckoutInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    
    // Continue to overview
    await this.continueToOverview();
    
    // Wait for overview page to load
    await this.waitForElement(this.finishButton);
    
    // Finish checkout
    await this.finishCheckout();
    
    // Wait for complete page to load
    await this.waitForElement(this.completeHeader);
  }

  /**
   * Verify checkout information page elements
   */
  async verifyCheckoutInfoPageElements() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
    await expect(this.page.locator(this.firstNameInput)).toBeVisible();
    await expect(this.page.locator(this.lastNameInput)).toBeVisible();
    await expect(this.page.locator(this.postalCodeInput)).toBeVisible();
    await expect(this.page.locator(this.continueButton)).toBeVisible();
    await expect(this.page.locator(this.cancelButton)).toBeVisible();
  }

  /**
   * Verify checkout overview page elements
   */
  async verifyCheckoutOverviewPageElements() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
    await expect(this.page.locator(this.subtotalLabel)).toBeVisible();
    await expect(this.page.locator(this.taxLabel)).toBeVisible();
    await expect(this.page.locator(this.totalLabel)).toBeVisible();
    await expect(this.page.locator(this.finishButton)).toBeVisible();
    await expect(this.page.locator(this.cancelButtonOverview)).toBeVisible();
  }

  /**
   * Verify checkout complete page elements
   */
  async verifyCheckoutCompletePageElements() {
    await expect(this.page.locator(this.completeHeader)).toBeVisible();
    await expect(this.page.locator(this.completeText)).toBeVisible();
    await expect(this.page.locator(this.backHomeButton)).toBeVisible();
    await expect(this.page.locator(this.ponyExpressImg)).toBeVisible();
  }
}

module.exports = CheckoutPage;