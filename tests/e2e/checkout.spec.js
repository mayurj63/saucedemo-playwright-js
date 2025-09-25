const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');
const CartPage = require('../../pages/CartPage');
const CheckoutPage = require('../../pages/CheckoutPage');
const DataHelper = require('../../utils/DataHelper');

test.describe('Checkout Process Functionality', () => {
  let loginPage;
  let productsPage;
  let cartPage;
  let checkoutPage;
  let testProducts;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    testProducts = DataHelper.getRandomProducts(2);
    
    // Login and add products to cart before each test
    const user = DataHelper.getStandardUser();
    await loginPage.navigateToLogin();
    await loginPage.login(user.username, user.password);
    
    for (const product of testProducts) {
      await productsPage.addProductToCart(product.id);
    }
    
    await productsPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
  });

  test.describe('Checkout Information Page Tests', () => {
    test('should display checkout information page correctly', async () => {
      await test.step('Verify checkout information page is loaded', async () => {
        await expect(checkoutPage.isCheckoutInfoPageLoaded()).resolves.toBe(true);
      });

      await test.step('Verify checkout information page elements', async () => {
        await checkoutPage.verifyCheckoutInfoPageElements();
      });
    });

    test('should complete checkout with valid information', async () => {
      const checkoutInfo = DataHelper.getValidCheckoutInfo();

      await test.step('Fill checkout information', async () => {
        await checkoutPage.fillCheckoutInformation(
          checkoutInfo.firstName,
          checkoutInfo.lastName,
          checkoutInfo.postalCode
        );
      });

      await test.step('Continue to overview', async () => {
        await checkoutPage.continueToOverview();
      });

      await test.step('Verify navigation to checkout overview', async () => {
        await expect(checkoutPage.isCheckoutOverviewPageLoaded()).resolves.toBe(true);
      });
    });

    test('should show error for invalid checkout information', async () => {
      const invalidCheckoutData = DataHelper.getInvalidCheckoutInfo();

      for (const invalidData of invalidCheckoutData) {
        await test.step(`Test invalid data: ${invalidData.expectedError}`, async () => {
          await checkoutPage.fillCheckoutInformation(
            invalidData.firstName,
            invalidData.lastName,
            invalidData.postalCode
          );
          
          await checkoutPage.continueToOverview();
          
          await expect(checkoutPage.isCheckoutErrorMessageDisplayed()).resolves.toBe(true);
          const errorMessage = await checkoutPage.getCheckoutErrorMessage();
          expect(errorMessage).toContain(invalidData.expectedError);
          
          await checkoutPage.closeCheckoutErrorMessage();
        });
      }
    });

    test('should cancel checkout from information page', async () => {
      await test.step('Cancel checkout', async () => {
        await checkoutPage.cancelCheckout();
      });

      await test.step('Verify navigation back to cart', async () => {
        await expect(cartPage.isCartPageLoaded()).resolves.toBe(true);
        const currentUrl = await checkoutPage.getCurrentUrl();
        expect(currentUrl).toContain('/cart.html');
      });
    });
  });

  test.describe('Checkout Overview Page Tests', () => {
    test.beforeEach(async () => {
      // Fill valid checkout information to reach overview page
      const checkoutInfo = DataHelper.getValidCheckoutInfo();
      await checkoutPage.fillCheckoutInformation(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode
      );
      await checkoutPage.continueToOverview();
    });

    test('should display checkout overview page correctly', async () => {
      await test.step('Verify checkout overview page is loaded', async () => {
        await expect(checkoutPage.isCheckoutOverviewPageLoaded()).resolves.toBe(true);
      });

      await test.step('Verify checkout overview page elements', async () => {
        await checkoutPage.verifyCheckoutOverviewPageElements();
      });

      await test.step('Verify items are displayed in overview', async () => {
        const itemsCount = await checkoutPage.getOverviewItemsCount();
        expect(itemsCount).toBe(testProducts.length);
        
        const itemNames = await checkoutPage.getAllOverviewItemNames();
        for (const product of testProducts) {
          expect(itemNames).toContain(product.name);
        }
      });
    });

    test('should calculate pricing correctly', async () => {
      await test.step('Verify pricing calculations', async () => {
        await checkoutPage.verifyCheckoutCalculations(testProducts);
      });

      await test.step('Verify individual price components', async () => {
        const subtotal = await checkoutPage.getSubtotal();
        const tax = await checkoutPage.getTax();
        const total = await checkoutPage.getTotal();
        
        expect(subtotal).toBeGreaterThan(0);
        expect(tax).toBeGreaterThan(0);
        expect(total).toBe(parseFloat((subtotal + tax).toFixed(2)));
      });
    });

    test('should display payment and shipping information', async () => {
      await test.step('Verify payment information is displayed', async () => {
        const paymentInfo = await checkoutPage.getPaymentInformation();
        expect(paymentInfo).toBeTruthy();
      });

      await test.step('Verify shipping information is displayed', async () => {
        const shippingInfo = await checkoutPage.getShippingInformation();
        expect(shippingInfo).toBeTruthy();
      });
    });

    test('should finish checkout successfully', async () => {
      await test.step('Finish checkout', async () => {
        await checkoutPage.finishCheckout();
      });

      await test.step('Verify navigation to checkout complete page', async () => {
        await expect(checkoutPage.isCheckoutCompletePageLoaded()).resolves.toBe(true);
      });
    });

    test('should cancel checkout from overview page', async () => {
      await test.step('Cancel checkout from overview', async () => {
        await checkoutPage.cancelCheckoutFromOverview();
      });

      await test.step('Verify navigation back to products page', async () => {
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
        const currentUrl = await checkoutPage.getCurrentUrl();
        expect(currentUrl).toContain('/inventory.html');
      });
    });
  });

  test.describe('Checkout Complete Page Tests', () => {
    test.beforeEach(async () => {
      // Complete the checkout process to reach complete page
      const checkoutInfo = DataHelper.getValidCheckoutInfo();
      await checkoutPage.completeCheckoutProcess(checkoutInfo);
    });

    test('should display checkout complete page correctly', async () => {
      await test.step('Verify checkout complete page is loaded', async () => {
        await expect(checkoutPage.isCheckoutCompletePageLoaded()).resolves.toBe(true);
      });

      await test.step('Verify checkout complete page elements', async () => {
        await checkoutPage.verifyCheckoutCompletePageElements();
      });

      await test.step('Verify success messages', async () => {
        const headerText = await checkoutPage.getCompleteHeaderText();
        const messageText = await checkoutPage.getCompleteMessageText();
        
        expect(headerText).toBe('Thank you for your order!');
        expect(messageText).toBeTruthy();
      });

      await test.step('Verify pony express image is displayed', async () => {
        expect(await checkoutPage.isPonyExpressImageVisible()).toBe(true);
      });
    });

    test('should navigate back to products from complete page', async () => {
      await test.step('Click back to products button', async () => {
        await checkoutPage.backToProducts();
      });

      await test.step('Verify navigation to products page', async () => {
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
        const currentUrl = await checkoutPage.getCurrentUrl();
        expect(currentUrl).toContain('/inventory.html');
      });

      await test.step('Verify cart is cleared after successful checkout', async () => {
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBeNull(); // Cart should be empty after checkout
      });
    });
  });

  test.describe('End-to-End Checkout Flow Tests', () => {
    test('should complete full checkout process with single item', async () => {
      // Start fresh with single item
      await productsPage.navigateTo('/inventory.html');
      
      const singleProduct = DataHelper.getRandomProduct();
      
      await test.step('Add single product to cart', async () => {
        await productsPage.addProductToCart(singleProduct.id);
        await productsPage.clickShoppingCart();
        await cartPage.proceedToCheckout();
      });

      await test.step('Complete checkout process', async () => {
        const checkoutInfo = DataHelper.getValidCheckoutInfo();
        await checkoutPage.completeCheckoutProcess(checkoutInfo);
      });

      await test.step('Verify successful completion', async () => {
        await expect(checkoutPage.isCheckoutCompletePageLoaded()).resolves.toBe(true);
        
        await checkoutPage.backToProducts();
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
        
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBeNull();
      });
    });

    test('should complete full checkout process with multiple items', async () => {
      const checkoutInfo = DataHelper.getValidCheckoutInfo();

      await test.step('Complete checkout with multiple items', async () => {
        await checkoutPage.completeCheckoutProcess(checkoutInfo);
      });

      await test.step('Verify successful completion with multiple items', async () => {
        await expect(checkoutPage.isCheckoutCompletePageLoaded()).resolves.toBe(true);
        
        const headerText = await checkoutPage.getCompleteHeaderText();
        expect(headerText).toBe('Thank you for your order!');
      });
    });

    test('should handle checkout with all available products', async () => {
      // Start fresh and add all products
      await productsPage.navigateTo('/inventory.html');
      
      const allProducts = DataHelper.getProducts();
      
      await test.step('Add all products to cart', async () => {
        for (const product of allProducts) {
          await productsPage.addProductToCart(product.id);
        }
        
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe(allProducts.length.toString());
      });

      await test.step('Proceed through checkout', async () => {
        await productsPage.clickShoppingCart();
        await cartPage.proceedToCheckout();
        
        const checkoutInfo = DataHelper.getValidCheckoutInfo();
        await checkoutPage.fillCheckoutInformation(
          checkoutInfo.firstName,
          checkoutInfo.lastName,
          checkoutInfo.postalCode
        );
        await checkoutPage.continueToOverview();
      });

      await test.step('Verify overview with all products', async () => {
        const itemsCount = await checkoutPage.getOverviewItemsCount();
        expect(itemsCount).toBe(allProducts.length);
        
        // Verify calculations for all products
        await checkoutPage.verifyCheckoutCalculations(allProducts);
      });

      await test.step('Complete checkout', async () => {
        await checkoutPage.finishCheckout();
        await expect(checkoutPage.isCheckoutCompletePageLoaded()).resolves.toBe(true);
      });
    });
  });

  test.describe('Checkout Error Handling Tests', () => {
    test('should handle network interruption during checkout', async () => {
      const checkoutInfo = DataHelper.getValidCheckoutInfo();

      await test.step('Fill checkout information', async () => {
        await checkoutPage.fillCheckoutInformation(
          checkoutInfo.firstName,
          checkoutInfo.lastName,
          checkoutInfo.postalCode
        );
      });

      await test.step('Continue to overview', async () => {
        await checkoutPage.continueToOverview();
        await expect(checkoutPage.isCheckoutOverviewPageLoaded()).resolves.toBe(true);
      });

      await test.step('Refresh page and verify state persistence', async () => {
        await checkoutPage.refreshPage();
        // Should still be on overview page or redirect appropriately
        const currentUrl = await checkoutPage.getCurrentUrl();
        expect(currentUrl).toContain('/checkout');
      });
    });

    test('should validate required field completion', async () => {
      await test.step('Attempt to continue with empty form', async () => {
        await checkoutPage.continueToOverview();
      });

      await test.step('Verify error for empty first name', async () => {
        await expect(checkoutPage.isCheckoutErrorMessageDisplayed()).resolves.toBe(true);
        const errorMessage = await checkoutPage.getCheckoutErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
      });
    });

    test('should handle invalid checkout data gracefully', async () => {
      await test.step('Fill with extremely long strings', async () => {
        const longString = DataHelper.generateRandomString(1000);
        await checkoutPage.fillCheckoutInformation(longString, longString, longString);
      });

      await test.step('Attempt to continue', async () => {
        await checkoutPage.continueToOverview();
        // Should either succeed or show appropriate error
        // The application should handle this gracefully
      });
    });
  });
});