const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductsPage = require('../../pages/ProductsPage');
const DataHelper = require('../../utils/DataHelper');

test.describe('Login Functionality', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigateToLogin();
  });

  test.describe('Positive Login Tests', () => {
    test('should display login page elements correctly', async () => {
      await test.step('Verify all login page elements are visible', async () => {
        await loginPage.verifyLoginPageElements();
      });

      await test.step('Verify login credentials and password information is displayed', async () => {
        const credentialsText = await loginPage.getLoginCredentialsText();
        const passwordText = await loginPage.getLoginPasswordText();
        
        expect(credentialsText).toContain('standard_user');
        expect(passwordText).toContain('secret_sauce');
      });
    });

    test('should login successfully with valid standard user credentials', async () => {
      const user = DataHelper.getStandardUser();

      await test.step('Enter valid credentials and login', async () => {
        await loginPage.login(user.username, user.password);
      });

      await test.step('Verify successful login - should redirect to products page', async () => {
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
        await productsPage.verifyProductsPageElements();
      });

      await test.step('Verify URL contains inventory', async () => {
        const currentUrl = await loginPage.getCurrentUrl();
        expect(currentUrl).toContain('/inventory.html');
      });
    });

    test('should login successfully with all valid users', async () => {
      const validUsers = DataHelper.getValidUsers();

      for (const user of validUsers) {
        await test.step(`Login with ${user.username}`, async () => {
          await loginPage.clearAllFields();
          await loginPage.login(user.username, user.password);
          
          // Verify successful login for non-locked users
          if (user.username !== 'locked_out_user') {
            await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
            
            // Logout to test next user
            await productsPage.logout();
            await expect(loginPage.isLoginPageLoaded()).resolves.toBe(true);
          }
        });
      }
    });
  });

  test.describe('Negative Login Tests', () => {
    test('should show error for locked out user', async () => {
      await test.step('Attempt login with locked out user', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
      });

      await test.step('Verify error message is displayed', async () => {
        await expect(loginPage.isErrorMessageDisplayed()).resolves.toBe(true);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
      });

      await test.step('Close error message', async () => {
        await loginPage.closeErrorMessage();
        await expect(loginPage.isErrorMessageDisplayed()).resolves.toBe(false);
      });
    });

    test('should show error for invalid credentials', async () => {
      const invalidUsers = DataHelper.getInvalidUsers();

      for (const user of invalidUsers) {
        await test.step(`Test invalid credentials: ${user.description}`, async () => {
          await loginPage.clearAllFields();
          await loginPage.login(user.username, user.password);
          
          await expect(loginPage.isErrorMessageDisplayed()).resolves.toBe(true);
          const errorMessage = await loginPage.getErrorMessage();
          expect(errorMessage).toContain(user.expectedError);
          
          await loginPage.closeErrorMessage();
        });
      }
    });

    test('should show error for empty username', async () => {
      await test.step('Attempt login with empty username', async () => {
        await loginPage.enterPassword('secret_sauce');
        await loginPage.clickLogin();
      });

      await test.step('Verify error message for empty username', async () => {
        await expect(loginPage.isErrorMessageDisplayed()).resolves.toBe(true);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Username is required');
      });
    });

    test('should show error for empty password', async () => {
      await test.step('Attempt login with empty password', async () => {
        await loginPage.enterUsername('standard_user');
        await loginPage.clickLogin();
      });

      await test.step('Verify error message for empty password', async () => {
        await expect(loginPage.isErrorMessageDisplayed()).resolves.toBe(true);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Password is required');
      });
    });

    test('should show error for both empty fields', async () => {
      await test.step('Attempt login with both fields empty', async () => {
        await loginPage.clickLogin();
      });

      await test.step('Verify error message for empty fields', async () => {
        await expect(loginPage.isErrorMessageDisplayed()).resolves.toBe(true);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Username is required');
      });
    });
  });

  test.describe('UI Behavior Tests', () => {
    test('should clear fields properly', async () => {
      await test.step('Fill both fields', async () => {
        await loginPage.enterUsername('test_user');
        await loginPage.enterPassword('test_password');
      });

      await test.step('Clear fields and verify they are empty', async () => {
        await loginPage.clearAllFields();
        await expect(loginPage.isUsernameEmpty()).resolves.toBe(true);
        await expect(loginPage.isPasswordEmpty()).resolves.toBe(true);
      });
    });

    test('should maintain login state after page refresh', async () => {
      const user = DataHelper.getStandardUser();

      await test.step('Login with valid credentials', async () => {
        await loginPage.login(user.username, user.password);
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
      });

      await test.step('Refresh page and verify still logged in', async () => {
        await loginPage.refreshPage();
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
      });
    });

    test('should logout successfully', async () => {
      const user = DataHelper.getStandardUser();

      await test.step('Login with valid credentials', async () => {
        await loginPage.login(user.username, user.password);
        await expect(productsPage.isProductsPageLoaded()).resolves.toBe(true);
      });

      await test.step('Logout and verify redirect to login page', async () => {
        await productsPage.logout();
        await expect(loginPage.isLoginPageLoaded()).resolves.toBe(true);
      });

      await test.step('Verify URL is back to login', async () => {
        const currentUrl = await loginPage.getCurrentUrl();
        expect(currentUrl).not.toContain('/inventory.html');
      });
    });
  });
});