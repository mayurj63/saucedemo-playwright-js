const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { InventoryPage } = require('../pages/inventoryPage');
const inventoryData = require('../data/inventory-DataSet.json');

test.describe('Inventory Page Tests', () => {
  const standardUser = inventoryData.find(item => item.name === 'Standard User');
  const footerData = inventoryData.find(item => item.name === 'Footer Text');
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    // Setup: Login before each test
    const loginPage = new LoginPage(page);
    // Initialize inventory page for use in all tests
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    
  });

  test.afterEach(async ({ page }) => {
    // Teardown: Close the page after each test
    await page.close();
  });

  test('should display all page elements correctly', async ({ page }) => {
    // Verify menu button
    await inventoryPage.assertMenuButtonVisible();
    
    // Open menu and verify sidebar links
    await inventoryPage.openMenu();
    await inventoryPage.assertSidebarLinksVisible();
    
    // Close menu
    await inventoryPage.closeMenu();
    
    // Verify other page elements
    await inventoryPage.assertShoppingCartVisible();
    await inventoryPage.assertHeaderElementsVisible();
    await inventoryPage.assertFooterContent(footerData.expectedText);
    await inventoryPage.assertInventoryContainerVisible();
  });

  test('should be able to open and close menu', async ({ page }) => {
    // Open menu
    await inventoryPage.openMenu();
    await inventoryPage.assertSidebarLinksVisible();
    
    // Close menu
    await inventoryPage.closeMenu();
    
    // Verify menu is closed (we can check this by attempting to open it again)
    await inventoryPage.assertMenuButtonVisible();
  });

  test('should be able to access shopping cart', async ({ page }) => {
    // Verify shopping cart is visible and navigate to it
    await inventoryPage.assertShoppingCartVisible();
    await inventoryPage.goToShoppingCart();
    
    // Verify we're on the cart page by checking the URL
    await page.waitForURL(/cart.html/);
  });
});
