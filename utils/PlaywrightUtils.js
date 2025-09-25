// utils/playwrightUtils.js

const { expect } = require('@playwright/test');

class PlaywrightUtils {
  
  constructor(page) {
    this.page = page;
  }

  // Click on an element 
  async click(selector) {
    await this.page.locator(selector).click();
  }

  // Type into an input field
  async type(selector, text) {
    await this.page.locator(selector).fill(text);
  }

  // Select from a dropdown
  async selectDropdown(selector, value) {
    await this.page.locator(selector).selectOption(value);
  }

  // Wait for an element to be visible
  async waitForElement(selector, timeout = 5000) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  // Assert that an element contains text
  async assertText(selector, expectedText) {
    const actualText = await this.page.locator(selector).textContent();
    expect(actualText.trim()).toBe(expectedText);
  }

  // Take a screenshot
  async takeScreenshot(filename = 'screenshot.png') {
    await this.page.screenshot({ path: `results/${filename}`, fullPage: true });
  }

  // Log message to console
  logMessage(message) {
    console.log(`🔹 LOG: ${message}`);
  }

  /**
 * Handles JavaScript alerts in Playwright
 * @param {string} action - Action to perform ('accept' or 'dismiss')
 * @param {string} expectedMessage - (Optional) Expected alert message to validate
 */
  async handleAlert(action = 'accept', expectedMessage = '') {
    this.page.on('dialog', async dialog => {
      console.log(`Alert message: ${dialog.message()}`);
      if (expectedMessage && dialog.message() !== expectedMessage) {
        console.warn(`Unexpected alert! Expected: "${expectedMessage}", got: "${dialog.message()}"`);
      }
      if (action === 'accept') {
        await dialog.accept();
        console.log('Alert accepted');
      } else {
        await dialog.dismiss();
        console.log('Alert dismissed');
      }
    });
  }
}

module.exports = PlaywrightUtils;
