const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - The URL to navigate to
   */
  async navigateTo(url) {
    await this.page.goto(url);
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - The element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Click on an element
   * @param {string} selector - The element selector
   */
  async clickElement(selector) {
    await this.page.click(selector);
  }

  /**
   * Fill text in an input field
   * @param {string} selector - The input selector
   * @param {string} text - The text to fill
   */
  async fillText(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text content of an element
   * @param {string} selector - The element selector
   * @returns {Promise<string>} The text content
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Check if element is visible
   * @param {string} selector - The element selector
   * @returns {Promise<boolean>} True if visible, false otherwise
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element count
   * @param {string} selector - The element selector
   * @returns {Promise<number>} Number of elements
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Select option from dropdown
   * @param {string} selector - The dropdown selector
   * @param {string} value - The value to select
   */
  async selectOption(selector, value) {
    await this.page.selectOption(selector, value);
  }

  /**
   * Take screenshot
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get current URL
   * @returns {Promise<string>} Current page URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Refresh the page
   */
  async refreshPage() {
    await this.page.reload();
  }

  /**
   * Scroll to element
   * @param {string} selector - The element selector
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }
}

module.exports = BasePage;