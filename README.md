# SauceDemo Playwright Automation Framework

A comprehensive test automation framework built with Playwright and JavaScript for testing the SauceDemo e-commerce application.

## 🎯 Project Overview

This project provides end-to-end test automation for the SauceDemo application (https://www.saucedemo.com/) using modern testing practices and tools.

### Key Features
- **Page Object Model (POM)** architecture
- **Data-driven testing** with JSON datasets
- **Allure reporting** for detailed test results
- **Multi-browser support** (Chromium, Mobile Safari)
- **Reusable utilities** for common operations
- **Comprehensive test coverage** for login, product browsing, and e2e flows

## 🏗️ Framework Architecture

```
epam-mayur-pw/
├── data/                          # Test data files
│   ├── addToCart-DataSet.json     # Shopping cart test data
│   ├── inventory-DataSet.json     # Product inventory data
│   └── login-DataSet.json         # Login credentials data
├── pages/                         # Page Object Models
│   ├── inventoryPage.js           # Inventory/Products page
│   ├── loginPage.js               # Login page
│   └── productDetailPage.js       # Product detail page
├── tests/                         # Test specifications
│   ├── 001_Login-Test.spec.js     # Login functionality tests
│   ├── 002_ProductsUi-Test.spec.js # Product UI tests
│   ├── 003_E2E_P_AddtoCart-Test.spec.js # E2E add to cart tests
│   └── 003_E2E_P_CartToOrder-Test.spec.js # Cart to order flow
├── utils/                         # Utility classes
│   └── loginHelper.js             # Login utility helper
├── allure-results/                # Allure test results
├── allure-report/                 # Generated Allure reports
├── playwright-report/             # Playwright HTML reports
├── test-results/                  # Test execution artifacts
├── playwright.config.js           # Playwright configuration
└── package.json                   # Dependencies and scripts
```

## 📊 Test Data Structure

### Login Data (`login-DataSet.json`)
Contains various user credentials for different test scenarios:
- Standard user
- Locked out user
- Problem user
- Performance glitch user

### Inventory Data (`inventory-DataSet.json`)
Product information for testing product-related features.

### Add to Cart Data (`addToCart-DataSet.json`)
Structured data for e2e shopping cart tests including:
- User credentials
- Product details
- Customer information
- Order totals
- Order completion messages

## 🛠️ Technology Stack

- **Test Framework**: Playwright
- **Language**: JavaScript (Node.js)
- **Reporting**: Allure Reports + Playwright HTML Reports
- **Architecture**: Page Object Model
- **Data Management**: JSON-based datasets
- **Browsers**: Chromium, Mobile Safari

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/mayurj63/saucedemo-playwright-js.git
cd saucedemo-playwright-js
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

### 4. Verify Installation
```bash
npx playwright --version
```

## ⚡ Quick Start Guide

### Running Tests

#### 1. Run All Tests
```bash
npm run test
```

#### 2. Run Specific Test Suite
```bash
# Login tests only
npx playwright test tests/001_Login-Test.spec.js

# Product UI tests only
npx playwright test tests/002_ProductsUi-Test.spec.js

# E2E Add to Cart tests
npx playwright test tests/003_E2E_P_AddtoCart-Test.spec.js
```

#### 3. Run Tests with Specific Browser
```bash
# Chromium only
npx playwright test --project=chromium

# Mobile Safari only
npx playwright test --project="Mobile Safari"
```

#### 4. Run Tests in Headed Mode (Visible Browser)
```bash
npx playwright test --headed
```

#### 5. Debug Mode
```bash
npx playwright test --debug
```

## 📈 Reporting

### Allure Reports (Recommended)

#### 1. Run Tests with Allure Reporter
```bash
npm run test:allure
```

#### 2. Generate and Serve Allure Report
```bash
npm run allure:serve
```

#### 3. Generate Allure Report (without serving)
```bash
npm run allure:generate
```

#### 4. Open Existing Allure Report
```bash
npm run allure:open
```

### Playwright HTML Reports

#### View Last Test Results
```bash
npx playwright show-report
```

## 🎯 Test Execution Examples

### Scenario 1: Complete Test Suite Execution
```bash
# Step 1: Run all tests with Allure reporting
npm run test:allure

# Step 2: Generate and view comprehensive report
npm run allure:serve
```

### Scenario 2: Focused Testing
```bash
# Run only login tests
npx playwright test tests/001_Login-Test.spec.js --headed

# Run specific test by name
npx playwright test -g "should login successfully with valid credentials"
```

### Scenario 3: Cross-Browser Testing
```bash
# Run tests on all configured browsers
npx playwright test --project=chromium --project="Mobile Safari"
```

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)
- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Retries**: 2 (in CI), 0 (locally)
- **Timeout**: 6 seconds
- **Reporters**: HTML + Allure
- **Browsers**: Chromium, Mobile Safari

### Key Configuration Options
```javascript
{
  testDir: './tests',
  timeout: 6_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results'
    }]
  ]
}
```

## 📋 Available NPM Scripts

```bash
npm run test              # Run all tests
npm run test:allure       # Run tests with Allure reporter
npm run allure:generate   # Generate Allure report
npm run allure:open       # Open existing Allure report
npm run allure:serve      # Generate and serve Allure report
```

## 🏷️ Test Categories

### 1. Login Tests (`001_Login-Test.spec.js`)
- Valid/Invalid credential testing
- Error message validation
- User permission testing
- Performance glitch user testing

### 2. Product UI Tests (`002_ProductsUi-Test.spec.js`)
- Product display validation
- UI element verification
- Navigation testing

### 3. E2E Add to Cart Tests (`003_E2E_P_AddtoCart-Test.spec.js`)
- Product selection
- Cart functionality
- Price validation

### 4. Cart to Order Tests (`003_E2E_P_CartToOrder-Test.spec.js`)
- Complete purchase flow
- Checkout process
- Order confirmation

## 🛡️ Best Practices Implemented

- **Page Object Model**: Separates test logic from page interactions
- **Data-Driven Testing**: External JSON datasets for test data
- **Utility Classes**: Reusable components like LoginHelper
- **Comprehensive Reporting**: Multiple reporting formats
- **Error Handling**: Proper timeouts and retry mechanisms
- **Cross-Browser Testing**: Multi-browser support

## 🐛 Troubleshooting

### Common Issues

#### 1. Browser Not Installed
```bash
npx playwright install
```

#### 2. Port Already in Use (Allure)
```bash
# Kill existing processes and retry
npm run allure:serve
```

#### 3. Test Timeouts
- Check network connectivity
- Increase timeout in `playwright.config.js`
- Run tests in headed mode to debug

#### 4. Permission Issues
```bash
# Windows: Run as Administrator
# Mac/Linux: Check file permissions
chmod +x node_modules/.bin/playwright
```

## 📞 Support & Contact

For questions, issues, or contributions:
- **Repository**: https://github.com/mayurj63/saucedemo-playwright-js
- **Issues**: Create an issue in the GitHub repository
- **Owner**: mayurj63

## 📄 License

This project is licensed under the ISC License.

---

## 🎉 Quick Test Run

Ready to see it in action? Run this command:

```bash
npm run test:allure && npm run allure:serve
```

This will execute all tests and automatically open a beautiful Allure report in your browser! 🚀