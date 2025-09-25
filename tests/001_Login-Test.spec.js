const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const loginData = require('../data/login-DataSet.json');

test.describe('Login Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test.afterEach(async ({ page }) => {
    // Teardown: Close the page after each test
    await page.close();
  });

    test('should show error when login without credentials', async ({ page }) => {
        await loginPage.assertLoginPageVisible();
        await loginPage.clickLogin();
        await loginPage.assertErrorMessage('Epic sadface: Username is required');
        await loginPage.closeError();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        const validUser = loginData.find(user => user.username === 'standard_user');
        await loginPage.login(validUser.username, validUser.password);
        await expect(loginPage.brandText).toBeVisible();
        await loginPage.openMenu();
        await loginPage.assertInventorySidebarVisible();
        await loginPage.closeMenu();
        await loginPage.logout();
        await loginPage.assertLoginPageVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
        const invalidUser = loginData.find(user => user.username === 'invalid_user');
        await loginPage.login(invalidUser.username, invalidUser.password);
        await loginPage.assertErrorMessage('Username and password do not match any user in this service');
    });

    for (const userData of loginData.filter(user => user.username !== 'standard_user' && user.username !== 'invalid_user')) {
        test(`Login test for ${userData.description}`, async ({ page }) => {
            await loginPage.login(userData.username, userData.password);

            if (userData.username === 'locked_out_user') {
                await loginPage.assertErrorMessage('Epic sadface: Sorry, this user has been locked out');
            } else {
                await expect(loginPage.brandText).toBeVisible();
            }
        });
    }
});
