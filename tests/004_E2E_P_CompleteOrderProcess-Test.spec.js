const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductPage } = require('../pages/productPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const testData = require('../data/addToCart-DataSet.json');

test.describe('Shopping Cart and Checkout Tests', () => {
  const user = testData.find(item => item.name === 'Standard User');
  const products = testData.find(item => item.name === 'Products').products;
  const customerInfo = testData.find(item => item.name === 'Customer Info');
  const orderTotal = testData.find(item => item.name === 'Order Total');
  const orderComplete = testData.find(item => item.name === 'Order Complete');
  
  // Find product by ID
  const getProductById = (id) => products.find(product => product.id === id);
  const backpack = getProductById(4);

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
  });

  test.afterEach(async ({ page }) => {
    // Teardown: Close the page after each test
    await page.close();
  });

  test('should display products correctly', async ({ page }) => {
    const productPage = new ProductPage(page);
    
    // Verify product names
    await productPage.assertProductName(4, backpack.name);
    // await productPage.assertProductName(1, getProductById(1).name);
    // await productPage.assertProductName(5, getProductById(5).name);
    // await productPage.assertProductName(2, getProductById(2).name);
    // await productPage.assertProductName(3, getProductById(3).name);
    
    // Test navigation to product and back
    await productPage.openProduct(1);
    await productPage.backToProducts();
  });

  test('should add product to cart and complete checkout', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Step 1: Navigate to product details
    await productPage.openProductImage(4);
    
    // Step 2: Verify product details page
    await productPage.assertProductDetailsVisible();
    await productPage.assertProductPrice(backpack.price);
    await productPage.assertBackpackImageVisible();
    
    // Step 3: Add to cart
    await productPage.addToCart();
    await productPage.assertRemoveButtonVisible();
    
    // Step 4: Go to cart
    await productPage.goToShoppingCart();
    
    // Step 5: Verify cart contents
    await cartPage.assertTitleVisible();
    await cartPage.assertCartLabelsVisible();
    await cartPage.assertProductInCart(4);
    await cartPage.assertItemQuantity('1');
    await cartPage.assertProductPrice(backpack.price);
    await cartPage.assertRemoveButtonVisible('sauce-labs-backpack');
    await cartPage.assertActionButtonsVisible();
    
    // Step 6: Proceed to checkout
    await cartPage.checkout();
    
    // Step 7: Verify checkout information page and fill form
    await checkoutPage.assertInformationPageDisplayed();
    await checkoutPage.fillCustomerInfo(
      customerInfo.firstName,
      customerInfo.lastName,
      customerInfo.postalCode
    );
    await checkoutPage.continueToBilling();
    
    // Step 8: Verify checkout overview
    await checkoutPage.assertOverviewPageDisplayed();
    await checkoutPage.assertProductInOverview(4);
    await checkoutPage.assertPriceInfo(
      orderTotal.subtotal,
      orderTotal.tax,
      orderTotal.total
    );
    
    // Step 9: Complete order
    await checkoutPage.finishCheckout();
    
    // Step 10: Verify order completion
    await checkoutPage.assertOrderCompleteDisplayed();
    await checkoutPage.assertOrderCompleteMessages(
      orderComplete.headerText,
      orderComplete.messageText
    );
    
    // Step 11: Return to products
    await checkoutPage.backToProducts();
    await productPage.assertTitleVisible();
  });
});
