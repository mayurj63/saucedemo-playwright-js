const { test, expect } = require('@playwright/test');
const DataHelper = require('../utils/DataHelper');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');

test.describe('Framework Validation Tests', () => {
  test('should load all data files correctly', () => {
    test.step('Load users data', () => {
      const validUsers = DataHelper.getValidUsers();
      const invalidUsers = DataHelper.getInvalidUsers();
      const standardUser = DataHelper.getStandardUser();
      
      expect(validUsers).toBeDefined();
      expect(validUsers.length).toBeGreaterThan(0);
      expect(invalidUsers).toBeDefined();
      expect(standardUser).toBeDefined();
      expect(standardUser.username).toBe('standard_user');
    });

    test.step('Load products data', () => {
      const products = DataHelper.getProducts();
      const sortOptions = DataHelper.getSortOptions();
      const randomProduct = DataHelper.getRandomProduct();
      const randomProducts = DataHelper.getRandomProducts(3);
      
      expect(products).toBeDefined();
      expect(products.length).toBe(6); // SauceDemo has 6 products
      expect(sortOptions).toBeDefined();
      expect(sortOptions.length).toBe(4); // 4 sort options
      expect(randomProduct).toBeDefined();
      expect(randomProducts).toBeDefined();
      expect(randomProducts.length).toBe(3);
    });

    test.step('Load checkout data', () => {
      const checkoutData = DataHelper.getCheckoutData();
      const validCheckoutInfo = DataHelper.getValidCheckoutInfo();
      const invalidCheckoutInfo = DataHelper.getInvalidCheckoutInfo();
      
      expect(checkoutData).toBeDefined();
      expect(validCheckoutInfo).toBeDefined();
      expect(validCheckoutInfo.firstName).toBe('John');
      expect(invalidCheckoutInfo).toBeDefined();
      expect(invalidCheckoutInfo.length).toBeGreaterThan(0);
    });
  });

  test('should create page objects correctly', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    test.step('Create page objects', () => {
      const loginPage = new LoginPage(page);
      const productsPage = new ProductsPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);
      
      expect(loginPage).toBeDefined();
      expect(productsPage).toBeDefined();
      expect(cartPage).toBeDefined();
      expect(checkoutPage).toBeDefined();
      
      // Check that they have the expected properties
      expect(loginPage.usernameInput).toBeDefined();
      expect(productsPage.pageTitle).toBeDefined();
      expect(cartPage.cartItems).toBeDefined();
      expect(checkoutPage.firstNameInput).toBeDefined();
    });

    await context.close();
  });

  test('should generate random data correctly', () => {
    test.step('Generate random strings and emails', () => {
      const randomString = DataHelper.generateRandomString(10);
      const randomEmail = DataHelper.generateRandomEmail();
      
      expect(randomString).toBeDefined();
      expect(randomString.length).toBe(10);
      expect(randomEmail).toBeDefined();
      expect(randomEmail).toContain('@');
      expect(randomEmail).toContain('.com');
    });
  });

  test('should calculate prices correctly', () => {
    test.step('Calculate total price with tax', () => {
      const testItems = [
        { price: '$10.00' },
        { price: '$20.00' },
        { price: '$5.50' }
      ];
      
      const calculation = DataHelper.calculateTotalPrice(testItems, 0.08);
      
      expect(calculation.subtotal).toBe(35.50);
      expect(calculation.tax).toBe(2.84);
      expect(calculation.total).toBe(38.34);
    });
  });

  test('should validate all expected products exist in data', () => {
    test.step('Check expected products', () => {
      const products = DataHelper.getProducts();
      const expectedProductNames = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)'
      ];
      
      const productNames = products.map(p => p.name);
      
      for (const expectedName of expectedProductNames) {
        expect(productNames).toContain(expectedName);
      }
    });
  });

  test('should validate all sort options exist', () => {
    test.step('Check sort options', () => {
      const sortOptions = DataHelper.getSortOptions();
      const expectedSortValues = ['az', 'za', 'lohi', 'hilo'];
      
      const sortValues = sortOptions.map(s => s.value);
      
      for (const expectedValue of expectedSortValues) {
        expect(sortValues).toContain(expectedValue);
      }
    });
  });

  test('should validate user data structure', () => {
    test.step('Check valid users structure', () => {
      const validUsers = DataHelper.getValidUsers();
      
      for (const user of validUsers) {
        expect(user.username).toBeDefined();
        expect(user.password).toBeDefined();
        expect(user.description).toBeDefined();
        expect(typeof user.username).toBe('string');
        expect(typeof user.password).toBe('string');
      }
    });

    test.step('Check invalid users structure', () => {
      const invalidUsers = DataHelper.getInvalidUsers();
      
      for (const user of invalidUsers) {
        expect(user.username).toBeDefined();
        expect(user.password).toBeDefined();
        expect(user.expectedError).toBeDefined();
        expect(typeof user.expectedError).toBe('string');
      }
    });
  });
});