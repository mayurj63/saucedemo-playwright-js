const { test, expect } = require('@playwright/test');

test.describe('Login Page Tests', () => {
  test('Validate page title and login functionality', async ({ page }) => {
    // Step 1: Open browser and navigate to URL
    await page.goto('https://www.saucedemo.com');

    // Step 2: Validate the page title
    await expect(page).toHaveTitle('Swag Labs');

    // Step 3: Validate visibility of login elements
    const usernameInput = page.locator('#user-name');
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login-button');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Step 4: Validate login functionality
    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();

    // Step 5: Validate successful login by checking URL
    await expect(page).toHaveURL(/inventory.html/);
  });
});