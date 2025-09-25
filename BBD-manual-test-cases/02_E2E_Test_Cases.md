# End-to-End BDD Test Cases - SauceDemo Application

## Overview
This document contains comprehensive end-to-end test scenarios that cover complete user journeys from start to finish, ensuring the entire application flow works seamlessly across different user types and scenarios.

**Application Under Test:** https://www.saucedemo.com/  
**Test Type:** End-to-End Integration Testing  
**Format:** Gherkin BDD Scenarios  
**Scope:** Complete user workflows and cross-module integration  

---

## E2E TEST CASE 1: COMPLETE PURCHASE JOURNEY

### Feature: Complete E2E Purchase Flow
```gherkin
Feature: Complete E2E Purchase Flow
  As a customer
  I want to complete a full purchase journey
  So that I can successfully buy products from the application

Background:
  Given the SauceDemo application is accessible
  And all required services are running
  And the database is populated with test data
```

### Scenario: End-to-end successful purchase flow with standard user
```gherkin
Scenario: Complete purchase journey from login to order confirmation
  # Authentication Phase
  Given I am on the SauceDemo login page
  When I login with username "standard_user" and password "secret_sauce"
  Then I should be successfully authenticated
  And I should be redirected to the inventory page
  And I should see the products page header "Products"
  And I should see 6 products available for purchase
  
  # Product Discovery and Selection Phase
  When I sort products by "Price (low to high)"
  Then products should be arranged in ascending order of price
  And "Sauce Labs Onesie" should be the first product displayed
  
  When I add the cheapest product "Sauce Labs Onesie" to cart
  Then the "Add to cart" button should change to "Remove"
  And the cart badge should display "1"
  
  When I add "Sauce Labs Backpack" to cart
  Then the cart badge should display "2"
  And both products should be tracked in the cart
  
  # Cart Review Phase
  When I click on the shopping cart icon
  Then I should be redirected to the cart page
  And I should see "Your Cart" as the page header
  And I should see "Sauce Labs Onesie" with price "$7.99"
  And I should see "Sauce Labs Backpack" with price "$29.99"
  And I should see "Continue Shopping" button
  And I should see "Checkout" button
  
  # Checkout Information Phase
  When I click "Checkout" button
  Then I should be redirected to the checkout information page
  And I should see "Checkout: Your Information" as the page header
  
  When I enter checkout information:
    | Field Name  | Value |
    | First Name  | John  |
    | Last Name   | Doe   |
    | Postal Code | 12345 |
  And I click "Continue" button
  Then I should be redirected to the checkout overview page
  
  # Order Review and Confirmation Phase
  Then I should see "Checkout: Overview" as the page header
  And I should see the order summary:
    | Description | Amount |
    | Item total  | $37.98 |
    | Tax         | $3.04  |
    | Total       | $41.02 |
  And I should see "Payment Information: SauceCard #31337"
  And I should see "Shipping Information: Free Pony Express Delivery!"
  And I should see both selected products listed
  And I should see "Cancel" and "Finish" buttons
  
  # Order Completion Phase
  When I click "Finish" button
  Then I should be redirected to the checkout complete page
  And I should see "Checkout: Complete!" as the page header
  And I should see "Thank you for your order!" confirmation message
  And I should see "Your order has been dispatched, and will arrive just as fast as the pony can get there!" message
  And I should see the pony express delivery image
  And I should see "Back Home" button
  
  # Post-Purchase Cleanup Phase
  When I click "Back Home" button
  Then I should return to the inventory page
  And my cart should be empty
  And the cart badge should not be visible
  And all product buttons should display "Add to cart"
  
  # Session Cleanup
  When I open the hamburger menu
  And I click "Logout" link
  Then I should be redirected to the login page
  And my session should be completely terminated
```

---

## E2E TEST CASE 2: MULTI-USER SHOPPING AND CART MANAGEMENT

### Feature: Multi-User Cart Management E2E Flow
```gherkin
Feature: Multi-User Cart Management E2E Flow
  As different types of users
  I want to manage shopping carts with different behaviors
  So that I can test various user scenarios and system robustness

Background:
  Given the SauceDemo application supports multiple user types
  And each user type has different characteristics and limitations
```

### Scenario: Problem user complete shopping experience with UI issues handling
```gherkin
Scenario: Complete shopping flow with problem user experiencing UI glitches
  # Problem User Authentication
  Given I am on the SauceDemo login page
  When I login with username "problem_user" and password "secret_sauce"
  Then I should be redirected to the inventory page
  But I should notice some product images are broken or displaying incorrectly
  And I should still be able to interact with all functional elements
  
  # Product Selection with UI Issues
  When I add "Sauce Labs Bolt T-Shirt" to cart
  Then the cart badge should display "1" despite UI issues
  And the button should change to "Remove" (may have visual glitches)
  
  When I click on "Sauce Labs Bolt T-Shirt" to view product details
  Then I should be redirected to the product detail page
  And I should see product details with potential UI rendering issues
  But all functional elements should remain clickable
  
  When I click "Back to products" button
  Then I should return to the inventory page
  And my cart state should be preserved
  
  # Additional Product Selection
  When I add "Sauce Labs Fleece Jacket" to cart
  Then the cart badge should display "2"
  And both products should be tracked correctly in cart
  
  # Cart Management with UI Issues
  When I click on the shopping cart icon
  Then I should be redirected to the cart page
  And I should see both products listed (with potential visual issues)
  And I should see correct prices and descriptions
  
  When I remove "Sauce Labs Bolt T-Shirt" from cart
  Then the cart should contain only "Sauce Labs Fleece Jacket"
  And the cart badge should display "1"
  And the removed product should no longer appear in cart
  
  # Checkout Process with Problem User
  When I proceed to checkout
  And I fill in shipping information:
    | First Name | Last Name | Postal Code |
    | Problem    | User      | 54321       |
  And I continue to checkout overview
  Then I should see order summary with correct calculations
  And I should see "Sauce Labs Fleece Jacket" ($49.99) listed
  
  When I complete the purchase
  Then I should successfully reach the order completion page
  And I should see order confirmation despite UI glitches
  
  # User Session Switch Testing
  When I logout from problem user session
  And I login as "standard_user" with password "secret_sauce"
  Then I should have a clean session with empty cart
  And all products should display correctly without UI issues
  And I should not see any remnants from the previous user's session
  
  # Cross-User Cart Isolation Verification
  When I add "Sauce Labs Backpack" to cart as standard user
  And I logout and login back as "problem_user"
  Then my cart should be empty (no cross-contamination)
  And I should start with a fresh session
  And UI issues should be consistent with problem user characteristics
```

### Scenario: Performance glitch user with slow loading handling
```gherkin
Scenario: Complete purchase flow with performance glitch user handling delays
  # Performance Glitch User Authentication
  Given I am on the SauceDemo login page
  When I login with username "performance_glitch_user" and password "secret_sauce"
  Then I should experience slower page loading times
  But I should eventually be redirected to the inventory page
  And all functionality should work despite performance issues
  
  # Slow Product Interaction Testing
  When I add "Sauce Labs Bike Light" to cart with delayed response
  Then I should wait for the action to complete
  And the cart badge should eventually display "1"
  And the button should change to "Remove" after delay
  
  When I navigate to cart with expected delays
  Then I should eventually see the cart page
  And "Sauce Labs Bike Light" should be listed correctly
  
  # Checkout with Performance Issues
  When I proceed through checkout process with delays
  And I enter customer information with slow form responses
  And I complete the order despite performance glitches
  Then I should successfully complete the purchase
  And the order should be processed correctly regardless of delays
  
  # Performance Impact Verification
  Then the final order confirmation should be accurate
  And no data should be lost due to performance issues
  And the user experience should remain functional despite slowness
```

---

## 🎯 E2E TEST SCENARIOS SUMMARY

### E2E Test Case 1: Complete Purchase Journey
- **Scope**: Full application workflow from login to order completion
- **User Type**: Standard user
- **Modules Covered**: Authentication → Inventory → Cart → Checkout → Confirmation
- **Duration**: ~15-20 steps covering entire user journey
- **Validation**: End-to-end data flow, cart persistence, order processing

### E2E Test Case 2: Multi-User Shopping and Cart Management  
- **Scope**: Cross-user scenarios and system robustness
- **User Types**: Problem user, Standard user, Performance glitch user
- **Focus Areas**: UI issue handling, session isolation, performance degradation
- **Duration**: ~25-30 steps covering multiple user sessions
- **Validation**: User isolation, data integrity, system resilience

---

## 📋 E2E TEST EXECUTION CRITERIA

### Pre-Execution Requirements
- [ ] All functional test cases must pass
- [ ] Test environment should be stable and accessible
- [ ] Test data should be properly seeded
- [ ] All user accounts should be available and functional

### Success Criteria
- [ ] Complete user journeys execute without critical failures
- [ ] Data integrity is maintained throughout the flow
- [ ] User sessions are properly isolated
- [ ] Cart state is accurately maintained and cleared
- [ ] Order processing completes successfully
- [ ] UI issues don't prevent functional completion

### Post-Execution Validation
- [ ] Application state is clean after test completion
- [ ] No data leakage between user sessions
- [ ] All temporary test data is properly cleaned up
- [ ] System performance returns to baseline

---

## 📊 E2E INTEGRATION POINTS TESTED

| Integration Point | Test Coverage | Validation |
|------------------|---------------|------------|
| **Login → Inventory** | ✅ Complete | User authentication and page redirection |
| **Inventory → Cart** | ✅ Complete | Product selection and cart state management |
| **Cart → Checkout** | ✅ Complete | Cart data transfer and form initialization |
| **Checkout → Payment** | ✅ Complete | Order data compilation and calculation |
| **Payment → Confirmation** | ✅ Complete | Order processing and confirmation generation |
| **Cross-User Sessions** | ✅ Complete | Session isolation and data privacy |
| **Performance Degradation** | ✅ Complete | System behavior under load/glitches |

---

**Note**: These E2E test cases should be executed after all functional tests pass to ensure the complete application workflow functions correctly across different user types and scenarios.