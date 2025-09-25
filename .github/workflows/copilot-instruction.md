# copilot-instruction.md
 
## Project: Playwright JavaScript Tests
 
### Coding Guidelines
 
- Use [Playwright](https://playwright.dev/docs/intro) for browser automation and end-to-end testing.
- Write tests in JavaScript using the Playwright Test Runner.
- Use `test.describe`, `test.beforeEach`, and `test.afterEach` for organizing and managing test setup/teardown.
- Prefer async/await syntax for all asynchronous operations.
- Use selectors that are robust and maintainable (e.g., data-testid attributes).
- Keep tests independent and idempotent.
- Use meaningful test names and comments to describe the intent.
- Store reusable logic in helper functions or fixtures.
- Avoid hardcoded waits; use Playwright's built-in waiting mechanisms.
- Ensure tests are cross-browser compatible (Chromium, Firefox, WebKit).
 
## POM guidelines : follow the below formate for POM 
## this is for reference only 
 - use page folder for all the POM pages

// login.page.js
const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('https://example.com/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/dashboard/);
  }
}

module.exports = { LoginPage };

## test case formate : follow the below formate for POM 
 - use test folder for test cases 

// login-spec.js
const { test } = require('@playwright/test');
const { LoginPage } = require('./login.page');

test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user1', 'securePassword');
    await loginPage.assertLoginSuccess();
  });
});

 
## Data guidelies 
 - use data folder for datasets
 - data file should be a Joson format
 - follow the naming stander as test cases/test script name should be added/kept to test data file 
 - exmaple=  login-DataSet.json

[
  {
    "username": "user1@example.com",
    "password": "Password123"
  },
  {
    "username": "user2@example.com",
    "password": "SecurePass456"
  },
  {
    "username": "admin@example.com",
    "password": "Admin@789"
  }
]
 
## Utility guidelines
 
