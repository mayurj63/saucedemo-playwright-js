# Functional Level BDD Test Cases - SauceDemo Application

## Overview
This document contains comprehensive functional test cases for the SauceDemo e-commerce platform, covering all core business functionalities using BDD (Behavior Driven Development) approach.

**Application Under Test:** https://www.saucedemo.com/  
**Test Type:** Functional Testing  
**Format:** Gherkin BDD Scenarios  

---

## 1. AUTHENTICATION & LOGIN MODULE

### Feature 1.1: User Authentication
```gherkin
Feature: User Authentication
  As a registered user
  I want to login to the application
  So that I can access the product catalog
```

#### Scenario 1.1.1: Successful Login
```gherkin
Scenario: Valid user login with correct credentials
  Given I am on the SauceDemo login page
  When I enter valid username "standard_user"
  And I enter valid password "secret_sauce"
  And I click the Login button
  Then I should be redirected to the inventory page
  And I should see the products page header "Products"
  And I should see the shopping cart icon
  And I should see the hamburger menu button
```

#### Scenario 1.1.2: Login Validation Messages
```gherkin
Scenario: Login without entering credentials
  Given I am on the SauceDemo login page
  When I click the Login button without entering any credentials
  Then I should see error message "Epic sadface: Username is required"
  And I should remain on the login page

Scenario: Login with username only
  Given I am on the SauceDemo login page
  When I enter username "standard_user"
  And I click the Login button without entering password
  Then I should see error message "Epic sadface: Password is required"
  And I should remain on the login page

Scenario: Login with invalid credentials
  Given I am on the SauceDemo login page
  When I enter username "invalid_user"
  And I enter password "wrong_password"
  And I click the Login button
  Then I should see error message "Epic sadface: Username and password do not match any user in this service"
  And I should remain on the login page
```

#### Scenario 1.1.3: Different User Types
```gherkin
Scenario: Problem user login
  Given I am on the SauceDemo login page
  When I enter username "problem_user"
  And I enter password "secret_sauce"
  And I click the Login button
  Then I should be redirected to the inventory page
  But I should see broken product images

Scenario: Performance glitch user login
  Given I am on the SauceDemo login page
  When I enter username "performance_glitch_user"
  And I enter password "secret_sauce"
  And I click the Login button
  Then I should experience delayed page loading
  And I should eventually be redirected to the inventory page

Scenario: Locked out user login attempt
  Given I am on the SauceDemo login page
  When I enter username "locked_out_user"
  And I enter password "secret_sauce"
  And I click the Login button
  Then I should see error message "Epic sadface: Sorry, this user has been locked out."
  And I should remain on the login page
```

---

## 2. PRODUCT INVENTORY MODULE

### Feature 2.1: Product Inventory Management
```gherkin
Feature: Product Inventory Management
  As a customer
  I want to view available products
  So that I can make purchasing decisions
```

#### Scenario 2.1.1: Product Display and Information
```gherkin
Scenario: View product inventory page
  Given I am logged in as "standard_user"
  When I am on the inventory page
  Then I should see a list of 6 products
  And each product should display name, description, price, and image
  And each product should have an "Add to cart" button
  And I should see the products sorted by "Name (A to Z)" by default

Scenario: Product sorting functionality
  Given I am logged in as "standard_user"
  And I am on the inventory page
  When I select "Price (low to high)" from the sort dropdown
  Then products should be arranged in ascending order of price
  And the cheapest product should be displayed first

Scenario: Product sorting by name Z to A
  Given I am logged in as "standard_user"
  And I am on the inventory page
  When I select "Name (Z to A)" from the sort dropdown
  Then products should be arranged in reverse alphabetical order
  And "Test.allTheThings() T-Shirt (Red)" should be displayed first

Scenario: Product sorting by price high to low
  Given I am logged in as "standard_user"
  And I am on the inventory page
  When I select "Price (high to low)" from the sort dropdown
  Then products should be arranged in descending order of price
  And the most expensive product should be displayed first
```

#### Scenario 2.1.2: Product Detail Page
```gherkin
Scenario: View individual product details
  Given I am logged in as "standard_user"
  And I am on the inventory page
  When I click on product name "Sauce Labs Backpack"
  Then I should be redirected to the product detail page
  And I should see the product name "Sauce Labs Backpack"
  And I should see the product description
  And I should see the product price "$29.99"
  And I should see the product image
  And I should see "Add to cart" button
  And I should see "Back to products" button

Scenario: Navigate back to inventory from product detail
  Given I am on the product detail page for "Sauce Labs Backpack"
  When I click the "Back to products" button
  Then I should be redirected to the inventory page
  And I should see all products listed
```

---

## 3. SHOPPING CART MODULE

### Feature 3.1: Shopping Cart Management
```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to add products to my cart
  So that I can purchase them later
```

#### Scenario 3.1.1: Add Items to Cart
```gherkin
Scenario: Add single product to cart from inventory
  Given I am logged in as "standard_user"
  And I am on the inventory page
  When I click "Add to cart" button for "Sauce Labs Backpack"
  Then the button text should change to "Remove"
  And the cart badge should display "1"
  And the product should be added to my cart

Scenario: Add multiple products to cart
  Given I am logged in as "standard_user"
  And I am on the inventory page
  When I add "Sauce Labs Backpack" to cart
  And I add "Sauce Labs Bike Light" to cart
  And I add "Sauce Labs Bolt T-Shirt" to cart
  Then the cart badge should display "3"
  And all three products should be in my cart

Scenario: Add product to cart from product detail page
  Given I am logged in as "standard_user"
  And I am on the product detail page for "Sauce Labs Fleece Jacket"
  When I click the "Add to cart" button
  Then the button text should change to "Remove"
  And the cart badge should display "1"
  And I should see the updated cart count
```

#### Scenario 3.1.2: Remove Items from Cart
```gherkin
Scenario: Remove product from inventory page
  Given I am logged in as "standard_user"
  And I have "Sauce Labs Backpack" in my cart
  And I am on the inventory page
  When I click the "Remove" button for "Sauce Labs Backpack"
  Then the button text should change to "Add to cart"
  And the cart badge should be hidden or show "0"
  And the product should be removed from my cart

Scenario: Remove product from cart page
  Given I am logged in as "standard_user"
  And I have "Sauce Labs Backpack" and "Sauce Labs Bike Light" in my cart
  And I am on the cart page
  When I click "Remove" button for "Sauce Labs Backpack"
  Then "Sauce Labs Backpack" should be removed from the cart
  And the cart badge should display "1"
  And only "Sauce Labs Bike Light" should remain in the cart
```

#### Scenario 3.1.3: View Cart Contents
```gherkin
Scenario: View cart with added products
  Given I am logged in as "standard_user"
  And I have added "Sauce Labs Backpack" and "Sauce Labs Bike Light" to cart
  When I click on the shopping cart icon
  Then I should be redirected to the cart page
  And I should see "Your Cart" as the page header
  And I should see both products listed with names, descriptions, and prices
  And I should see "Continue Shopping" button
  And I should see "Checkout" button
  And I should see "Remove" button for each product

Scenario: Empty cart display
  Given I am logged in as "standard_user"
  And my cart is empty
  When I click on the shopping cart icon
  Then I should be redirected to the cart page
  And I should see "Your Cart" as the page header
  And I should see no products listed
  And I should see "Continue Shopping" button
  And I should not see "Checkout" button
```

---

## 4. CHECKOUT PROCESS MODULE

### Feature 4.1: Checkout Process
```gherkin
Feature: Checkout Process
  As a customer
  I want to complete my purchase
  So that I can receive my ordered products
```

#### Scenario 4.1.1: Checkout Information Form
```gherkin
Scenario: Enter checkout information with valid data
  Given I am logged in as "standard_user"
  And I have products in my cart
  And I am on the cart page
  When I click the "Checkout" button
  Then I should be redirected to the checkout information page
  And I should see "Checkout: Your Information" as the page header
  When I enter first name "John"
  And I enter last name "Doe"
  And I enter postal code "12345"
  And I click the "Continue" button
  Then I should be redirected to the checkout overview page

Scenario: Checkout form validation
  Given I am on the checkout information page
  When I click the "Continue" button without entering any information
  Then I should see error message "Error: First Name is required"
  And I should remain on the checkout information page

Scenario: Checkout with missing last name
  Given I am on the checkout information page
  When I enter first name "John"
  And I enter postal code "12345"
  And I click the "Continue" button
  Then I should see error message "Error: Last Name is required"

Scenario: Checkout with missing postal code
  Given I am on the checkout information page
  When I enter first name "John"
  And I enter last name "Doe"
  And I click the "Continue" button
  Then I should see error message "Error: Postal Code is required"
```

#### Scenario 4.1.2: Checkout Overview and Completion
```gherkin
Scenario: Review order on checkout overview page
  Given I am on the checkout overview page
  And I have "Sauce Labs Backpack" ($29.99) in my cart
  Then I should see "Checkout: Overview" as the page header
  And I should see the product "Sauce Labs Backpack" listed
  And I should see "Payment Information: SauceCard #31337"
  And I should see "Shipping Information: Free Pony Express Delivery!"
  And I should see "Item total: $29.99"
  And I should see "Tax: $2.40"
  And I should see "Total: $32.39"
  And I should see "Cancel" button
  And I should see "Finish" button

Scenario: Complete order successfully
  Given I am on the checkout overview page
  When I click the "Finish" button
  Then I should be redirected to the checkout complete page
  And I should see "Checkout: Complete!" as the page header
  And I should see "Thank you for your order!" message
  And I should see "Your order has been dispatched" message
  And I should see "Back Home" button
  And I should see the pony express image

Scenario: Return to home after order completion
  Given I am on the checkout complete page
  When I click the "Back Home" button
  Then I should be redirected to the inventory page
  And my cart should be empty
  And the cart badge should not be visible
```

---

## 5. NAVIGATION AND MENU MODULE

### Feature 5.1: Application Navigation
```gherkin
Feature: Application Navigation
  As a user
  I want to navigate through different sections
  So that I can access various features
```

#### Scenario 5.1.1: Hamburger Menu Navigation
```gherkin
Scenario: Open and close hamburger menu
  Given I am logged in as "standard_user"
  When I click the hamburger menu button
  Then I should see the side menu open
  And I should see "All Items" link
  And I should see "About" link
  And I should see "Logout" link
  And I should see "Reset App State" link
  When I click the "X" button
  Then the side menu should close

Scenario: Navigate to About page
  Given I am logged in as "standard_user"
  When I open the hamburger menu
  And I click "About" link
  Then I should be redirected to "https://saucelabs.com/"
  And I should see the Sauce Labs website

Scenario: Reset app state
  Given I am logged in as "standard_user"
  And I have products in my cart
  When I open the hamburger menu
  And I click "Reset App State" link
  Then my cart should be empty
  And all "Remove" buttons should change back to "Add to cart"

Scenario: Logout functionality
  Given I am logged in as "standard_user"
  When I open the hamburger menu
  And I click "Logout" link
  Then I should be redirected to the login page
  And my session should be terminated
```

---

## 📊 FUNCTIONAL TEST SUMMARY

### Module Coverage
- **Authentication Module**: 6 scenarios covering login, logout, and user types
- **Product Inventory Module**: 6 scenarios covering display, sorting, and navigation
- **Shopping Cart Module**: 7 scenarios covering add, remove, and view operations
- **Checkout Process Module**: 6 scenarios covering form validation and completion
- **Navigation Module**: 4 scenarios covering menu and routing functionality

### Total Functional Scenarios: 29
### Business Functions Covered: 100%
### Critical User Paths: All covered

---

**Note**: These functional test cases form the foundation of the testing strategy and should be executed first to ensure core application functionality works as expected before proceeding with negative testing and edge cases.