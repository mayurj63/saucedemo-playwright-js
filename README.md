# SauceDemo Playwright Automation Framework

A comprehensive test automation framework for the SauceDemo e-commerce application built with Playwright and JavaScript, following Page Object Model (POM) and Test Driven Development (TDD) approaches.

## 🚀 Features

- **Playwright Framework**: Modern, fast, and reliable browser automation
- **Page Object Model (POM)**: Maintainable and scalable test architecture
- **Test Driven Development (TDD)**: Comprehensive test coverage with focused test scenarios
- **JSON Data Management**: Externalized test data for easy maintenance
- **Allure Reporting**: Detailed and interactive test reports
- **Multi-browser Support**: Tests run on Chromium, Firefox, and WebKit
- **CI/CD Integration**: GitHub Actions workflow for automated testing
- **Cross-platform**: Runs on Windows, macOS, and Linux

## 📁 Project Structure

```
saucedemo-playwright-js/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline configuration
├── data/
│   ├── users.json                  # User credentials and test data
│   ├── products.json               # Product information
│   └── checkout.json               # Checkout form data
├── pages/
│   ├── BasePage.js                 # Base page with common methods
│   ├── LoginPage.js                # Login page object
│   ├── ProductsPage.js             # Products page object
│   ├── CartPage.js                 # Shopping cart page object
│   └── CheckoutPage.js             # Checkout process page object
├── tests/
│   └── e2e/
│       ├── login.spec.js           # Login functionality tests
│       ├── products.spec.js        # Product browsing tests
│       ├── cart.spec.js            # Shopping cart tests
│       └── checkout.spec.js        # Checkout process tests
├── utils/
│   └── DataHelper.js               # Data management utilities
├── playwright.config.js            # Playwright configuration
├── package.json                    # Project dependencies and scripts
└── README.md                       # Project documentation
```

## 🛠️ Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mayurj63/saucedemo-playwright-js.git
   cd saucedemo-playwright-js
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run install:browsers
   ```

## 🎯 Usage

### Running Tests

#### All Tests
```bash
npm test
```

#### Headed Mode (with browser UI)
```bash
npm run test:headed
```

#### Debug Mode
```bash
npm run test:debug
```

#### Interactive UI Mode
```bash
npm run test:ui
```

#### Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

#### Specific Test File
```bash
npx playwright test tests/e2e/login.spec.js
npx playwright test tests/e2e/products.spec.js
npx playwright test tests/e2e/cart.spec.js
npx playwright test tests/e2e/checkout.spec.js
```

### Reporting

#### Generate Allure Report
```bash
npm run allure:generate
npm run allure:open
```

#### Serve Allure Report
```bash
npm run allure:serve
```

## 📊 Test Coverage

### Login Tests (`login.spec.js`)
- ✅ Valid user authentication
- ✅ Invalid credentials handling  
- ✅ Locked user scenarios
- ✅ Empty field validation
- ✅ UI behavior verification
- ✅ Session management

### Products Tests (`products.spec.js`)
- ✅ Product display verification
- ✅ Product sorting functionality
- ✅ Add/remove cart operations
- ✅ Cart badge updates
- ✅ Navigation between pages
- ✅ Product interaction

### Cart Tests (`cart.spec.js`)
- ✅ Cart item management
- ✅ Item removal operations
- ✅ Price calculations
- ✅ Quantity validations
- ✅ Navigation workflows
- ✅ State persistence

### Checkout Tests (`checkout.spec.js`)
- ✅ Checkout form validation
- ✅ Payment calculations
- ✅ Order completion flow
- ✅ Error handling
- ✅ End-to-end scenarios
- ✅ Multi-item checkout

## 🏗️ Architecture

### Page Object Model (POM)

The framework implements the Page Object Model design pattern:

- **BasePage**: Contains common functionality shared across all pages
- **LoginPage**: Handles login-specific actions and elements
- **ProductsPage**: Manages product browsing and cart operations
- **CartPage**: Controls shopping cart functionalities
- **CheckoutPage**: Manages the entire checkout process

### Data-Driven Testing

Test data is externalized in JSON files:

- **users.json**: Contains valid/invalid user credentials
- **products.json**: Product information and sort options
- **checkout.json**: Checkout form data and validation rules

### Utility Classes

- **DataHelper**: Provides methods for loading and manipulating test data
- **Configuration**: Manages test environment settings

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)

The configuration includes:
- Base URL: `https://www.saucedemo.com`
- Multiple browser projects (Chromium, Firefox, WebKit)
- Mobile device testing
- Screenshot and video capture on failure
- Allure reporting integration
- Timeout settings

### Environment Variables

You can customize the test execution using environment variables:

```bash
# Run tests in different environments
BASE_URL=https://staging.saucedemo.com npm test

# Run with custom timeout
TIMEOUT=60000 npm test
```

## 📈 Reporting

The framework generates multiple types of reports:

1. **HTML Report**: Built-in Playwright HTML report
2. **Allure Report**: Interactive and detailed test reports
3. **JSON Report**: Machine-readable test results

### Allure Features

- Test execution history
- Test categorization
- Screenshots and videos on failure
- Test timing and duration
- Detailed error information
- Test environment information

## 🔄 CI/CD Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`) includes:

- Automated test execution on push/PR
- Multi-browser testing matrix
- Artifact collection (reports, screenshots, videos)
- Allure report generation and publishing

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

## 🧪 Test Data Management

### User Credentials (`data/users.json`)

```json
{
  "validUsers": [
    {
      "username": "standard_user",
      "password": "secret_sauce",
      "description": "Standard user with access to all features"
    }
  ],
  "invalidUsers": [
    {
      "username": "locked_out_user",
      "password": "secret_sauce",
      "expectedError": "Epic sadface: Sorry, this user has been locked out."
    }
  ]
}
```

### Product Information (`data/products.json`)

Contains comprehensive product details including:
- Product IDs and names
- Descriptions and prices
- Sort options and values

### Checkout Data (`data/checkout.json`)

Includes:
- Valid checkout information
- Invalid form data for validation testing
- Payment and tax calculation data

## 🎨 Best Practices

### Test Writing
- Use descriptive test names
- Implement proper test isolation
- Add meaningful assertions
- Use data-driven approaches
- Follow AAA pattern (Arrange, Act, Assert)

### Page Objects
- Keep page objects focused and cohesive
- Use meaningful method names
- Implement proper error handling
- Add JSDoc documentation
- Follow DRY principles

### Data Management
- Externalize test data
- Use helper functions for data manipulation
- Implement data validation
- Keep data files organized

## 🚨 Troubleshooting

### Common Issues

1. **Browser Installation Issues**
   ```bash
   npx playwright install --with-deps
   ```

2. **Test Timeouts**
   - Increase timeout in `playwright.config.js`
   - Check network connectivity
   - Verify application availability

3. **Flaky Tests**
   - Add proper wait conditions
   - Use explicit waits instead of fixed delays
   - Check test data dependencies

4. **CI/CD Failures**
   - Verify environment variables
   - Check browser compatibility
   - Review test data consistency

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Add JSDoc comments
- Follow naming conventions

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For questions, issues, or contributions:

- Create an issue in the GitHub repository
- Review existing documentation
- Check CI/CD logs for detailed error information

## 🔗 Related Links

- [Playwright Documentation](https://playwright.dev/)
- [SauceDemo Application](https://www.saucedemo.com/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

**Built with ❤️ using Playwright and JavaScript**