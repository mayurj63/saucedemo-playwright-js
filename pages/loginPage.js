const { expect } = require('@playwright/test');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Page elements
    this.brandText = page.getByText('Swag Labs');
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorBanner = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.inventorySidebarLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Login with the provided credentials
   * @param {string} username - Username to login with
   * @param {string} password - Password to login with
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Click login button without entering credentials
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Open the menu sidebar
   */
  async openMenu() {
    await this.openMenuButton.click();
  }

  /**
   * Logout from the application through the menu
   */
  async logout() {
    await this.openMenu();
    // Wait for the menu to be visible and the logout link to be clickable
    await this.logoutSidebarLink.waitFor({ state: 'visible' });
    await this.logoutSidebarLink.click();
  }

  /**
   * Close error message by clicking the X button
   */
  async closeError() {
    await this.errorCloseButton.click();
  }

  // Validation methods
  /**
   * Assert that login page elements are visible
   */
  async assertLoginPageVisible() {
    await expect(this.brandText).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert that the error message contains expected text
   * @param {string} errorText - Text to check for in the error message
   */
  async assertErrorMessage(errorText) {
    await expect(this.errorBanner).toBeVisible();
    await expect(this.errorBanner).toContainText(errorText);
  }

  /**
   * Assert that the inventory sidebar is visible (successful login)
   */
  async assertInventorySidebarVisible() {
    await expect(this.inventorySidebarLink).toBeVisible();
  }

  /**
   * Close the menu sidebar
   */
  async closeMenu() {
    await this.closeMenuButton.click();
  }

}

module.exports = { LoginPage };
