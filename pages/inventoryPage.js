const { expect } = require('@playwright/test');

/**
 * Page Object Model for Inventory Page
 * Handles elements and actions related to the inventory/product page
 */
class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Page elements
    this.title = page.locator('[data-test="title"]');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    
    // Sidebar menu elements
    this.inventorySidebarLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutSidebarLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetSidebarLink = page.locator('[data-test="reset-sidebar-link"]');
    
    // Page content elements
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.secondaryHeader = page.locator('[data-test="secondary-header"]');
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');
    this.footerCopy = page.locator('[data-test="footer-copy"]');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
  }

  /**
   * Open the menu sidebar
   */
  async openMenu() {
    await this.openMenuButton.click();
  }

  /**
   * Close the menu sidebar
   */
  async closeMenu() {
    await this.closeMenuButton.click();
  }

  /**
   * Navigate to the shopping cart
   */
  async goToShoppingCart() {
    await expect(this.shoppingCartLink).toBeVisible();
    await this.shoppingCartLink.click();
  }

  /**
   * Navigate to about page from sidebar
   */
  async goToAboutPage() {
    await this.openMenu();
    await this.aboutSidebarLink.click();
  }

  /**
   * Logout from the application through the menu
   */
  async logout() {
    await this.openMenu();
    // Use force: true to ensure the click happens even during menu animations
    await this.logoutSidebarLink.click({ force: true });
  }

  /**
   * Reset the app state through the menu
   */
  async resetAppState() {
    await this.openMenu();
    await this.resetSidebarLink.click();
  }

  // Validation methods
  /**
   * Assert that title is visible
   */
  async assertTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  /**
   * Assert that the menu button is visible
   */
  async assertMenuButtonVisible() {
    await expect(this.openMenuButton).toBeVisible();
  }

  /**
   * Assert all sidebar links are visible
   */
  async assertSidebarLinksVisible() {
    await expect(this.inventorySidebarLink).toBeVisible();
    await expect(this.aboutSidebarLink).toBeVisible();
    await expect(this.logoutSidebarLink).toBeVisible();
    await expect(this.resetSidebarLink).toBeVisible();
    await expect(this.closeMenuButton).toBeVisible();
  }

  /**
   * Assert that the shopping cart link is visible
   */
  async assertShoppingCartVisible() {
    await expect(this.shoppingCartLink).toBeVisible();
  }

  /**
   * Assert that header elements are visible
   */
  async assertHeaderElementsVisible() {
    await expect(this.secondaryHeader).toBeVisible();
    await expect(this.productSortContainer).toBeVisible();
  }

  /**
   * Assert that footer contains expected text
   */
  async assertFooterContent(expectedText) {
    await expect(this.footerCopy).toBeVisible();
    await expect(this.footerCopy).toContainText(expectedText);
  }

  /**
   * Assert that inventory container is visible
   */
  async assertInventoryContainerVisible() {
    await expect(this.inventoryContainer).toBeVisible();
  }

  /**
   * Find a product by its name
   * @param {string} productName - The name of the product to find
   */
  async findProductByName(productName) {
    const product = this.page.locator(`//div[normalize-space()='${productName}']`);
    //div[normalize-space()='Sauce Labs Backpack']  .product-item:has-text("${productName}")`
    await expect(product).toBeVisible();
    return product;
  }

  /**
   * Click on a product by its name
   * @param {string} productName - The name of the product to click
   */
  async clickOnProduct(productName) {
    const product = await this.findProductByName(productName);
    await product.click();
  }


  async getProductDetailPage(productName) {
    const productLink = this.page.locator(`[data-test="inventory-item-name"]`, { hasText: productName });
    await productLink.click();
    await this.page.waitForLoadState('domcontentloaded'); // Wait for navigation to complete
  }
}

module.exports = { InventoryPage };
