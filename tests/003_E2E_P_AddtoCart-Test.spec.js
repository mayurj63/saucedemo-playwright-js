const { test } = require('@playwright/test');
const { InventoryPage } = require('../pages/inventoryPage');
const { ProductDetailPage } = require('../pages/productDetailPage');
const LoginHelper = require('../utils/loginHelper');
const inventoryData = require('../data/inventory-DataSet.json');
const addToCartData = require('../data/addToCart-DataSet.json');
const loginData = require('../data/login-DataSet.json');


test.describe('Shopping Cart Flow', () => {

  let loginHelper;
  let inventoryPage;
  let productDetailPage;

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page);
    inventoryPage = new InventoryPage(page);
    productDetailPage = new ProductDetailPage(page);

    await loginHelper.performLogin(loginData[0]);
  });

  test.afterEach(async ({ page }) => {
    await loginHelper.performLogout();
    await loginHelper.tearDown();
  });

  test('should browse products and add to cart', async ({ page }) => {
    // Find the products object in the data array
    const productsData = addToCartData.find(item => item.name === "Products");
    
    if (productsData && productsData.products) {
      for (const product of productsData.products) {
        await inventoryPage.assertInventoryContainerVisible();
        await inventoryPage.findProductByName(product.name);
        await inventoryPage.clickOnProduct(product.name);
        // await inventoryPage.addProductToCart(product.name);

        await productDetailPage.validateProductName(product.name);
        await productDetailPage.validateProductPrice(product.price);

        await productDetailPage.addToCart();

        // await inventoryPage.verifyCartBadgeCount(expectedCount);
      }
    }
  });
});
