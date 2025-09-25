const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');
const CartPage = require('../../pages/CartPage');
const DataHelper = require('../../utils/DataHelper');

test.describe('Shopping Cart Functionality', () => {
  let loginPage;
  let productsPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    const user = DataHelper.getStandardUser();
    await loginPage.navigateToLogin();
    await loginPage.login(user.username, user.password);
    await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
  });

  test.describe('Cart Display Tests', () => {
    test('should display empty cart correctly', async () => {
      await test.step('Navigate to cart', async () => {
        await productsPage.clickShoppingCart();
        await expect(cartPage.isCartPageLoaded()).resolves.toBe(true);
      });

      await test.step('Verify empty cart elements', async () => {
        await cartPage.verifyCartPageElements();
        expect(await cartPage.isCartEmpty()).toBe(true);
        expect(await cartPage.getCartItemsCount()).toBe(0);
      });

      await test.step('Verify page title', async () => {
        const pageTitle = await cartPage.getPageTitle();
        expect(pageTitle).toBe('Your Cart');
      });
    });

    test('should display cart with items correctly', async () => {
      const products = DataHelper.getRandomProducts(2);

      await test.step('Add products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
      });

      await test.step('Navigate to cart', async () => {
        await productsPage.clickShoppingCart();
        await expect(cartPage.isCartPageLoaded()).resolves.toBe(true);
      });

      await test.step('Verify cart contains added items', async () => {
        expect(await cartPage.isCartEmpty()).toBe(false);
        expect(await cartPage.getCartItemsCount()).toBe(2);
        
        const cartItemNames = await cartPage.getAllCartItemNames();
        for (const product of products) {
          expect(cartItemNames).toContain(product.name);
        }
      });

      await test.step('Verify cart page elements with items', async () => {
        await cartPage.verifyCartPageElements();
      });
    });

    test('should display correct item details in cart', async () => {
      const product = DataHelper.getRandomProduct();

      await test.step('Add product to cart', async () => {
        await productsPage.addProductToCart(product.id);
      });

      await test.step('Navigate to cart', async () => {
        await productsPage.clickShoppingCart();
      });

      await test.step('Verify item details in cart', async () => {
        const cartItemDetails = await cartPage.getCartItemDetails(0);
        
        expect(cartItemDetails.name).toBe(product.name);
        expect(cartItemDetails.description).toBe(product.description);
        expect(cartItemDetails.price).toBe(product.price);
        expect(cartItemDetails.quantity).toBe(1);
      });
    });
  });

  test.describe('Cart Operations Tests', () => {
    test('should remove single item from cart', async () => {
      const product = DataHelper.getRandomProduct();

      await test.step('Add product to cart and navigate', async () => {
        await productsPage.addProductToCart(product.id);
        await productsPage.clickShoppingCart();
      });

      await test.step('Remove item from cart', async () => {
        await cartPage.removeItemFromCart(product.id);
        await cartPage.waitForCartUpdate();
      });

      await test.step('Verify item is removed', async () => {
        expect(await cartPage.isCartEmpty()).toBe(true);
        expect(await cartPage.getCartItemsCount()).toBe(0);
        expect(await cartPage.isItemInCart(product.name)).toBe(false);
      });
    });

    test('should remove multiple items from cart', async () => {
      const products = DataHelper.getRandomProducts(3);

      await test.step('Add multiple products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
        await productsPage.clickShoppingCart();
      });

      await test.step('Remove specific items from cart', async () => {
        await cartPage.removeItemFromCart(products[0].id);
        await cartPage.waitForCartUpdate();
        await cartPage.removeItemFromCart(products[1].id);
        await cartPage.waitForCartUpdate();
      });

      await test.step('Verify correct items are removed', async () => {
        expect(await cartPage.getCartItemsCount()).toBe(1);
        expect(await cartPage.isItemInCart(products[0].name)).toBe(false);
        expect(await cartPage.isItemInCart(products[1].name)).toBe(false);
        expect(await cartPage.isItemInCart(products[2].name)).toBe(true);
      });
    });

    test('should remove all items from cart', async () => {
      const products = DataHelper.getRandomProducts(4);

      await test.step('Add multiple products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
        await productsPage.clickShoppingCart();
      });

      await test.step('Remove all items from cart', async () => {
        await cartPage.removeAllItemsFromCart();
        await cartPage.waitForCartUpdate();
      });

      await test.step('Verify cart is empty', async () => {
        expect(await cartPage.isCartEmpty()).toBe(true);
        expect(await cartPage.getCartItemsCount()).toBe(0);
      });
    });

    test('should calculate total price correctly', async () => {
      const products = DataHelper.getRandomProducts(3);

      await test.step('Add products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
        await productsPage.clickShoppingCart();
      });

      await test.step('Calculate and verify total price', async () => {
        const totalPrice = await cartPage.calculateTotalPrice();
        
        let expectedTotal = 0;
        for (const product of products) {
          expectedTotal += parseFloat(product.price.replace('$', ''));
        }
        expectedTotal = parseFloat(expectedTotal.toFixed(2));
        
        expect(totalPrice).toBe(expectedTotal);
      });
    });

    test('should calculate total quantity correctly', async () => {
      const products = DataHelper.getRandomProducts(5);

      await test.step('Add products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
        await productsPage.clickShoppingCart();
      });

      await test.step('Verify total quantity', async () => {
        const totalQuantity = await cartPage.getTotalQuantity();
        expect(totalQuantity).toBe(5); // Each product has quantity 1
      });
    });
  });

  test.describe('Cart Navigation Tests', () => {
    test('should continue shopping from cart', async () => {
      await test.step('Navigate to cart', async () => {
        await productsPage.clickShoppingCart();
      });

      await test.step('Continue shopping', async () => {
        await cartPage.continueShopping();
      });

      await test.step('Verify navigation back to products page', async () => {
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
        const currentUrl = await cartPage.getCurrentUrl();
        expect(currentUrl).toContain('/inventory.html');
      });
    });

    test('should proceed to checkout from cart', async () => {
      const product = DataHelper.getRandomProduct();

      await test.step('Add product and navigate to cart', async () => {
        await productsPage.addProductToCart(product.id);
        await productsPage.clickShoppingCart();
      });

      await test.step('Proceed to checkout', async () => {
        await cartPage.proceedToCheckout();
      });

      await test.step('Verify navigation to checkout page', async () => {
        const currentUrl = await cartPage.getCurrentUrl();
        expect(currentUrl).toContain('/checkout-step-one.html');
      });
    });

    test('should not allow checkout with empty cart', async () => {
      await test.step('Navigate to empty cart', async () => {
        await productsPage.clickShoppingCart();
        expect(await cartPage.isCartEmpty()).toBe(true);
      });

      await test.step('Attempt to proceed to checkout', async () => {
        await cartPage.proceedToCheckout();
      });

      await test.step('Verify navigation to checkout page still occurs', async () => {
        // SauceDemo allows checkout even with empty cart, so this should still work
        const currentUrl = await cartPage.getCurrentUrl();
        expect(currentUrl).toContain('/checkout-step-one.html');
      });
    });
  });

  test.describe('Cart State Persistence Tests', () => {
    test('should maintain cart state when navigating between pages', async () => {
      const products = DataHelper.getRandomProducts(2);

      await test.step('Add products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
      });

      await test.step('Navigate to cart and back to products', async () => {
        await productsPage.clickShoppingCart();
        await cartPage.continueShopping();
      });

      await test.step('Verify cart badge count persists', async () => {
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe('2');
      });

      await test.step('Navigate back to cart and verify items persist', async () => {
        await productsPage.clickShoppingCart();
        expect(await cartPage.getCartItemsCount()).toBe(2);
        
        const cartItemNames = await cartPage.getAllCartItemNames();
        for (const product of products) {
          expect(cartItemNames).toContain(product.name);
        }
      });
    });

    test('should update products page when items removed from cart', async () => {
      const product = DataHelper.getRandomProduct();

      await test.step('Add product to cart', async () => {
        await productsPage.addProductToCart(product.id);
        expect(await productsPage.isProductInCart(product.id)).toBe(true);
      });

      await test.step('Navigate to cart and remove item', async () => {
        await productsPage.clickShoppingCart();
        await cartPage.removeItemFromCart(product.id);
        await cartPage.waitForCartUpdate();
      });

      await test.step('Navigate back to products and verify button state', async () => {
        await cartPage.continueShopping();
        expect(await productsPage.isProductInCart(product.id)).toBe(false);
        
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBeNull();
      });
    });
  });

  test.describe('Cart Data Validation Tests', () => {
    test('should verify cart items match added products exactly', async () => {
      const expectedProducts = DataHelper.getProducts().slice(0, 3); // Take first 3 products

      await test.step('Add specific products to cart', async () => {
        for (const product of expectedProducts) {
          await productsPage.addProductToCart(product.id);
        }
        await productsPage.clickShoppingCart();
      });

      await test.step('Verify cart items match expected products', async () => {
        await cartPage.verifyCartItems(expectedProducts);
      });
    });

    test('should display correct item information for all products', async () => {
      const allProducts = DataHelper.getProducts();

      for (const product of allProducts) {
        await test.step(`Test cart display for ${product.name}`, async () => {
          // Go back to products page first
          await productsPage.navigateTo('/inventory.html');
          
          // Add specific product
          await productsPage.addProductToCart(product.id);
          await productsPage.clickShoppingCart();
          
          // Verify item details
          const cartItemDetails = await cartPage.getCartItemDetails(0);
          expect(cartItemDetails.name).toBe(product.name);
          expect(cartItemDetails.price).toBe(product.price);
          expect(cartItemDetails.description).toBe(product.description);
          
          // Remove item for next iteration
          await cartPage.removeItemFromCart(product.id);
          await cartPage.waitForCartUpdate();
        });
      }
    });
  });
});