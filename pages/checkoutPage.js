const { expect } = require('@playwright/test');

/**
 * Page Object Model for Checkout Process
 * Handles elements and actions related to the checkout flow
 */
class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Common elements
    this.title = page.locator('[data-test="title"]');
    this.secondaryHeader = page.locator('[data-test="secondary-header"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    
    // Checkout information form elements
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    
    // Checkout overview elements
    this.cartDescLabel = page.locator('[data-test="cart-desc-label"]');
    this.itemLink = (productId) => page.locator(`[data-test="item-${productId}-title-link"]`);
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    
    // Checkout complete elements
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.ponyExpress = page.locator('[data-test="pony-express"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Fill out customer information form
   * @param {string} firstName - Customer's first name
   * @param {string} lastName - Customer's last name
   * @param {string} postalCode - Customer's postal code
   */
  async fillCustomerInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Click continue button after filling customer information
   */
  async continueToBilling() {
    await this.continueButton.click();
  }

  /**
   * Complete checkout by clicking finish button
   */
  async finishCheckout() {
    await this.finishButton.click();
  }

  /**
   * Return to products page after completing checkout
   */
  async backToProducts() {
    await this.backToProductsButton.click();
  }

  /**
   * Cancel checkout process
   */
  async cancelCheckout() {
    await this.cancelButton.click();
  }

  // Validation methods - Information Page
  /**
   * Assert that checkout information page is displayed correctly
   */
  async assertInformationPageDisplayed() {
    await expect(this.title).toContainText('Checkout: Your Information');
    await expect(this.secondaryHeader).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }
  
  // Validation methods - Overview Page
  /**
   * Assert that checkout overview page displays correctly
   */
  async assertOverviewPageDisplayed() {
    await expect(this.title).toBeVisible();
    await expect(this.cartDescLabel).toBeVisible();
    await expect(this.paymentInfoLabel).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  /**
   * Assert that a specific product is in the checkout overview
   * @param {number} productId - ID of the product to check
   */
  async assertProductInOverview(productId) {
    await expect(this.itemLink(productId)).toBeVisible();
  }

  /**
   * Assert checkout price information matches expected values
   * @param {string} subtotal - Expected subtotal (e.g. "$29.99")
   * @param {string} tax - Expected tax amount (e.g. "$2.40")
   * @param {string} total - Expected total (e.g. "$32.39")
   */
  async assertPriceInfo(subtotal, tax, total) {
    await expect(this.subtotalLabel).toContainText(subtotal);
    await expect(this.taxLabel).toContainText(tax);
    await expect(this.totalLabel).toContainText(total);
  }

  // Validation methods - Complete Page
  /**
   * Assert that order complete page displays correctly
   */
  async assertOrderCompleteDisplayed() {
    await expect(this.title).toBeVisible();
    await expect(this.completeHeader).toBeVisible();
    await expect(this.ponyExpress).toBeVisible();
    await expect(this.completeText).toBeVisible();
    await expect(this.backToProductsButton).toBeVisible();
  }

  /**
   * Assert that order complete messages match expected text
   * @param {string} headerText - Expected header text
   * @param {string} completeMessage - Expected complete message
   */
  async assertOrderCompleteMessages(headerText, completeMessage) {
    await expect(this.completeHeader).toContainText(headerText);
    await expect(this.completeText).toContainText(completeMessage);
  }
}

module.exports = { CheckoutPage };
