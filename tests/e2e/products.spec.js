const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');
const DataHelper = require('../../utils/DataHelper');

test.describe('Products Page Functionality', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    
    // Login before each test
    const user = DataHelper.getStandardUser();
    await loginPage.navigateToLogin();
    await loginPage.login(user.username, user.password);
    await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
  });

  test.describe('Products Display Tests', () => {
    test('should display products page correctly', async () => {
      await test.step('Verify products page elements', async () => {
        await productsPage.verifyProductsPageElements();
      });

      await test.step('Verify page title is correct', async () => {
        const pageTitle = await productsPage.getPageTitle();
        expect(pageTitle).toBe('Products');
      });

      await test.step('Verify products are displayed', async () => {
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
        expect(productCount).toBe(6); // SauceDemo has 6 products
      });
    });

    test('should display all expected products', async () => {
      const expectedProducts = DataHelper.getProducts();

      await test.step('Verify all products are displayed', async () => {
        const displayedProductNames = await productsPage.getAllProductNames();
        
        for (const expectedProduct of expectedProducts) {
          expect(displayedProductNames).toContain(expectedProduct.name);
        }
      });

      await test.step('Verify product count matches expected', async () => {
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBe(expectedProducts.length);
      });
    });

    test('should display product details correctly', async () => {
      await test.step('Verify first product details', async () => {
        const productDetails = await productsPage.getProductDetails(0);
        
        expect(productDetails.name).toBeTruthy();
        expect(productDetails.description).toBeTruthy();
        expect(productDetails.price).toBeTruthy();
        expect(productDetails.price).toMatch(/^\$\d+\.\d{2}$/); // Price format: $XX.XX
      });
    });
  });

  test.describe('Product Sorting Tests', () => {
    test('should sort products by name A to Z', async () => {
      await test.step('Sort products by name A to Z', async () => {
        await productsPage.sortProducts('az');
      });

      await test.step('Verify products are sorted correctly', async () => {
        const productNames = await productsPage.getAllProductNames();
        const sortedNames = [...productNames].sort();
        expect(productNames).toEqual(sortedNames);
      });
    });

    test('should sort products by name Z to A', async () => {
      await test.step('Sort products by name Z to A', async () => {
        await productsPage.sortProducts('za');
      });

      await test.step('Verify products are sorted correctly', async () => {
        const productNames = await productsPage.getAllProductNames();
        const sortedNames = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedNames);
      });
    });

    test('should sort products by price low to high', async () => {
      await test.step('Sort products by price low to high', async () => {
        await productsPage.sortProducts('lohi');
      });

      await test.step('Verify products are sorted by price correctly', async () => {
        const productPrices = await productsPage.getAllProductPrices();
        const prices = productPrices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
      });
    });

    test('should sort products by price high to low', async () => {
      await test.step('Sort products by price high to low', async () => {
        await productsPage.sortProducts('hilo');
      });

      await test.step('Verify products are sorted by price correctly', async () => {
        const productPrices = await productsPage.getAllProductPrices();
        const prices = productPrices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
      });
    });

    test('should maintain current sort option selection', async () => {
      const sortOptions = DataHelper.getSortOptions();

      for (const sortOption of sortOptions) {
        await test.step(`Test ${sortOption.text} sort option`, async () => {
          await productsPage.sortProducts(sortOption.value);
          const currentSortOption = await productsPage.getCurrentSortOption();
          expect(currentSortOption).toBe(sortOption.value);
        });
      }
    });
  });

  test.describe('Add to Cart Tests', () => {
    test('should add single product to cart', async () => {
      const product = DataHelper.getRandomProduct();

      await test.step('Add product to cart', async () => {
        await productsPage.addProductToCart(product.id);
      });

      await test.step('Verify product is added to cart', async () => {
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe('1');
        
        const isInCart = await productsPage.isProductInCart(product.id);
        expect(isInCart).toBe(true);
      });
    });

    test('should add multiple products to cart', async () => {
      const products = DataHelper.getRandomProducts(3);

      await test.step('Add multiple products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
      });

      await test.step('Verify all products are added to cart', async () => {
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe('3');
        
        for (const product of products) {
          const isInCart = await productsPage.isProductInCart(product.id);
          expect(isInCart).toBe(true);
        }
      });
    });

    test('should remove product from cart', async () => {
      const product = DataHelper.getRandomProduct();

      await test.step('Add product to cart first', async () => {
        await productsPage.addProductToCart(product.id);
        expect(await productsPage.getCartBadgeCount()).toBe('1');
      });

      await test.step('Remove product from cart', async () => {
        await productsPage.removeProductFromCart(product.id);
      });

      await test.step('Verify product is removed from cart', async () => {
        const cartBadgeCount = await productsPage.getCartBadgeCount();
        expect(cartBadgeCount).toBeNull(); // Badge should disappear when cart is empty
        
        const isInCart = await productsPage.isProductInCart(product.id);
        expect(isInCart).toBe(false);
      });
    });

    test('should handle adding and removing multiple products', async () => {
      const products = DataHelper.getRandomProducts(4);

      await test.step('Add all products to cart', async () => {
        for (const product of products) {
          await productsPage.addProductToCart(product.id);
        }
        expect(await productsPage.getCartBadgeCount()).toBe('4');
      });

      await test.step('Remove half of the products', async () => {
        await productsPage.removeProductFromCart(products[0].id);
        await productsPage.removeProductFromCart(products[1].id);
        
        expect(await productsPage.getCartBadgeCount()).toBe('2');
      });

      await test.step('Verify correct products remain in cart', async () => {
        expect(await productsPage.isProductInCart(products[0].id)).toBe(false);
        expect(await productsPage.isProductInCart(products[1].id)).toBe(false);
        expect(await productsPage.isProductInCart(products[2].id)).toBe(true);
        expect(await productsPage.isProductInCart(products[3].id)).toBe(true);
      });
    });
  });

  test.describe('Navigation Tests', () => {
    test('should navigate to shopping cart', async () => {
      await test.step('Add a product to cart first', async () => {
        const product = DataHelper.getRandomProduct();
        await productsPage.addProductToCart(product.id);
      });

      await test.step('Navigate to shopping cart', async () => {
        await productsPage.clickShoppingCart();
      });

      await test.step('Verify navigation to cart page', async () => {
        const currentUrl = await productsPage.getCurrentUrl();
        expect(currentUrl).toContain('/cart.html');
      });
    });

    test('should open hamburger menu', async () => {
      await test.step('Open hamburger menu', async () => {
        await productsPage.openMenu();
      });

      await test.step('Verify menu is opened', async () => {
        // Menu items should be visible after opening
        await expect(productsPage.page.locator(productsPage.menuItems).first()).toBeVisible();
      });
    });

    test('should logout from hamburger menu', async () => {
      await test.step('Logout using hamburger menu', async () => {
        await productsPage.logout();
      });

      await test.step('Verify redirect to login page', async () => {
        await expect(loginPage.isLoginPageLoaded()).resolves.toBe(true);
        const currentUrl = await productsPage.getCurrentUrl();
        expect(currentUrl).not.toContain('/inventory.html');
      });
    });
  });

  test.describe('Product Interaction Tests', () => {
    test('should click on product to view details', async () => {
      const products = await productsPage.getAllProductNames();
      const firstProduct = products[0];

      await test.step('Click on product name', async () => {
        await productsPage.clickProductByName(firstProduct);
      });

      await test.step('Verify navigation to product details', async () => {
        const currentUrl = await productsPage.getCurrentUrl();
        expect(currentUrl).toContain('/inventory-item.html');
      });
    });

    test('should maintain product state after sorting', async () => {
      const product = DataHelper.getRandomProduct();

      await test.step('Add product to cart', async () => {
        await productsPage.addProductToCart(product.id);
        expect(await productsPage.isProductInCart(product.id)).toBe(true);
      });

      await test.step('Sort products', async () => {
        await productsPage.sortProducts('za');
      });

      await test.step('Verify product remains in cart after sorting', async () => {
        expect(await productsPage.isProductInCart(product.id)).toBe(true);
        expect(await productsPage.getCartBadgeCount()).toBe('1');
      });
    });
  });
});