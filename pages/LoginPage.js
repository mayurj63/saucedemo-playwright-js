const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.usernameInput = '[data-test="username"]';
    this.passwordInput = '[data-test="password"]';
    this.loginButton = '[data-test="login-button"]';
    this.errorMessage = '[data-test="error"]';
    this.errorButton = '.error-button';
    this.loginLogo = '.login_logo';
    this.loginCredentials = '#login_credentials';
    this.loginPassword = '.login_password';
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    await this.fillText(this.usernameInput, username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await this.fillText(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.clickElement(this.loginButton);
  }

  /**
   * Perform login with credentials
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message is visible
   */
  async isErrorMessageDisplayed() {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Close error message
   */
  async closeErrorMessage() {
    if (await this.isElementVisible(this.errorButton)) {
      await this.clickElement(this.errorButton);
    }
  }

  /**
   * Check if login page is loaded
   * @returns {Promise<boolean>} True if login page is loaded
   */
  async isLoginPageLoaded() {
    return await this.isElementVisible(this.loginLogo);
  }

  /**
   * Get login credentials text
   * @returns {Promise<string>} Login credentials text
   */
  async getLoginCredentialsText() {
    return await this.getText(this.loginCredentials);
  }

  /**
   * Get login password text
   * @returns {Promise<string>} Login password text
   */
  async getLoginPasswordText() {
    return await this.getText(this.loginPassword);
  }

  /**
   * Clear username field
   */
  async clearUsername() {
    await this.page.fill(this.usernameInput, '');
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    await this.page.fill(this.passwordInput, '');
  }

  /**
   * Clear all fields
   */
  async clearAllFields() {
    await this.clearUsername();
    await this.clearPassword();
  }

  /**
   * Check if username field is empty
   * @returns {Promise<boolean>} True if username field is empty
   */
  async isUsernameEmpty() {
    const value = await this.page.inputValue(this.usernameInput);
    return value === '';
  }

  /**
   * Check if password field is empty
   * @returns {Promise<boolean>} True if password field is empty
   */
  async isPasswordEmpty() {
    const value = await this.page.inputValue(this.passwordInput);
    return value === '';
  }

  /**
   * Verify login page elements
   */
  async verifyLoginPageElements() {
    await expect(this.page.locator(this.loginLogo)).toBeVisible();
    await expect(this.page.locator(this.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.loginButton)).toBeVisible();
    await expect(this.page.locator(this.loginCredentials)).toBeVisible();
    await expect(this.page.locator(this.loginPassword)).toBeVisible();
  }
}

module.exports = LoginPage;