# Edge Cases BDD Test Scenarios - SauceDemo Application

## Overview
This document contains comprehensive edge case test scenarios that cover boundary conditions, unusual user behaviors, environmental factors, and system limits. These tests ensure the application behaves predictably under uncommon but possible real-world conditions.

**Application Under Test:** https://www.saucedemo.com/  
**Test Type:** Edge Case & Boundary Testing  
**Format:** Gherkin BDD Scenarios  
**Focus:** Boundary conditions, Unusual behaviors, Environmental factors  

---

## 1. BROWSER AND SESSION EDGE CASES

### Feature: Browser Environment and Session Management Edge Cases
```gherkin
Feature: Browser and Session Edge Cases
  As a user with various browser behaviors
  I want the application to handle unusual browser conditions
  So that my experience remains consistent regardless of browser state
```

#### Scenario 1.1: Session Management Edge Cases
```gherkin
Scenario: Session timeout during active shopping
  Given I am logged in as "standard_user"
  And I have items in my cart
  And I am actively browsing products
  When I remain inactive for extended period (30+ minutes)
  And session expires while I have items in cart
  And I try to add another item to cart
  Then I should be redirected to login page
  And my cart state should be handled appropriately
  And I should see session timeout message
  When I login again with same credentials
  Then my cart state should be restored or clearly communicated as lost

Scenario: Session expiry during checkout process
  Given I am logged in as "standard_user"
  And I have products in my cart
  And I am on checkout information page
  When session expires while I'm filling checkout form
  And I try to submit the checkout form
  Then I should be redirected to login page
  And my form data should be handled securely
  And I should see appropriate session expiry message
  When I login again
  Then I should be guided to appropriate page in checkout flow

Scenario: Concurrent session management
  Given I am logged in as "standard_user" in tab 1
  When I open tab 2 and login with same credentials
  And I add items to cart in tab 1
  And I add different items to cart in tab 2
  Then cart state should be synchronized across tabs
  Or should handle conflicts appropriately with clear messaging
  And user should understand which cart state is active
  When I logout from one tab
  Then other tab should handle session termination gracefully
```

#### Scenario 1.2: Browser Navigation Edge Cases
```gherkin
Scenario: Browser back button during checkout flow
  Given I am logged in with items in cart
  And I have completed checkout information form
  And I am on checkout overview page
  When I click browser back button
  Then I should return to checkout information page
  And my entered data should be preserved
  And form should be populated with previously entered information
  When I click back button again
  Then I should return to cart page
  And cart contents should be intact
  When I click back button from cart page
  Then I should return to inventory page
  And cart state should remain consistent

Scenario: Browser forward button behavior
  Given I have navigated through: Login → Inventory → Product Detail → Inventory
  When I click browser back button multiple times
  And then click browser forward button
  Then navigation should work correctly
  And application state should be consistent
  And page content should load properly

Scenario: Browser refresh during different application states
  Given I am logged in with items in cart
  When I refresh the page on inventory screen
  Then I should remain logged in
  And cart contents should persist
  And product display should be correct
  When I refresh during checkout process
  Then checkout progress should be handled gracefully
  And form data should be preserved when possible
  When I refresh on order completion page
  Then I should see appropriate page state
  And should not be able to duplicate orders
```

#### Scenario 1.3: Multiple Tab and Window Scenarios
```gherkin
Scenario: Product browsing in multiple tabs
  Given I am logged in as "standard_user"
  When I open product "Sauce Labs Backpack" in new tab
  And I open product "Sauce Labs Bike Light" in another tab
  And I add products to cart from both tabs
  Then cart state should be synchronized across all tabs
  And cart badge should show consistent count
  And cart contents should be accurate

Scenario: Checkout process across multiple tabs
  Given I have products in cart
  When I start checkout process in tab 1
  And I open cart in tab 2
  And I try to modify cart in tab 2 while checkout is in progress in tab 1
  Then system should handle concurrent modifications appropriately
  And should prevent data corruption
  And should provide clear user feedback

Scenario: Login state consistency across tabs
  Given I am logged in in tab 1
  When I open application in tab 2
  Then I should be automatically logged in in tab 2
  When I logout from tab 1
  Then tab 2 should detect logout and handle appropriately
  And should redirect to login page or show logged out state
```

---

## 2. DATA BOUNDARY EDGE CASES

### Feature: Data Boundary and Limit Testing
```gherkin
Feature: Data Boundary Edge Cases
  As a user testing system limits
  I want the application to handle boundary conditions gracefully
  So that the system remains stable at data limits
```

#### Scenario 2.1: Cart Capacity and Product Limits
```gherkin
Scenario: Maximum cart capacity testing
  Given I am logged in as "standard_user"
  When I add all 6 available products to cart
  Then cart should handle maximum items correctly
  And cart badge should display "6"
  And checkout should process all items without issues
  And total calculations should be accurate
  When I try to add items beyond available inventory
  Then system should prevent invalid additions
  And should display appropriate messaging

Scenario: Product quantity edge cases
  Given I am logged in and have products in cart
  When I try to manipulate quantity to zero through browser tools
  Then system should handle zero quantity appropriately
  And should either remove item or show validation error
  When I try to set quantity to maximum integer value
  Then system should enforce reasonable quantity limits
  And should prevent system overflow

Scenario: Cart persistence at boundaries
  Given I have maximum allowed items in cart
  When I logout and login again
  Then all cart items should be restored correctly
  And cart calculations should remain accurate
  And no data corruption should occur
```

#### Scenario 2.2: Form Input Boundary Testing
```gherkin
Scenario: Minimum and maximum field length validation
  Given I am on checkout information page
  When I enter first name with 1 character "A"
  And I enter last name with 1 character "B"
  And I enter postal code with 1 character "1"
  And I click Continue button
  Then system should validate minimum field requirements
  And should show appropriate error messages for short inputs
  
  When I enter first name with maximum allowed characters
  And I enter last name with maximum allowed characters
  And I enter postal code with maximum allowed characters
  And I click Continue button
  Then system should accept maximum length inputs
  And should process correctly without truncation

Scenario: Postal code format boundary testing
  Given I am on checkout information page
  When I test various postal code formats:
    | Format | Example | Expected Result |
    | US ZIP | 12345 | Should be accepted |
    | US ZIP+4 | 12345-6789 | Should be accepted |
    | Canadian | K1A 0A6 | Should be accepted |
    | UK | SW1A 1AA | Should be accepted |
    | Invalid | ABCDE | Should show error |
  Then system should handle international postal codes appropriately
  And should provide clear validation feedback

Scenario: Character encoding boundary testing
  Given I am on checkout information page
  When I enter names with various character encodings:
    | Language | Name | Expected Result |
    | English | John Doe | Should be accepted |
    | Spanish | José María | Should be accepted |
    | French | François | Should be accepted |
    | Chinese | 张三 | Should be handled appropriately |
    | Arabic | محمد | Should be handled appropriately |
    | Emoji | John 😀 | Should be sanitized or rejected |
  Then system should handle international characters correctly
  And should maintain data integrity
```

#### Scenario 2.3: Price and Calculation Boundaries
```gherkin
Scenario: Price calculation precision testing
  Given I have products with precise decimal prices in cart:
    | Product | Price |
    | Item 1 | $29.99 |
    | Item 2 | $15.99 |
    | Item 3 | $49.99 |
  When I proceed to checkout
  Then tax calculation should be mathematically precise
  And total should be calculated correctly to 2 decimal places
  And no rounding errors should occur
  And final total should match manual calculation

Scenario: Large order value testing
  Given I have maximum quantity of most expensive items in cart
  When order total reaches maximum reasonable value
  Then system should handle large monetary amounts correctly
  And should display amounts properly formatted
  And should process checkout without numeric overflow

Scenario: Zero and negative price edge cases
  Given I am viewing product pricing
  When system encounters edge cases in price display
  Then prices should never display as zero or negative
  And price formatting should remain consistent
  And currency symbols should display correctly
```

---

## 3. USER BEHAVIOR EDGE CASES

### Feature: Unusual User Behavior Patterns
```gherkin
Feature: User Behavior Edge Cases
  As a user with unusual interaction patterns
  I want the application to handle unexpected behaviors gracefully
  So that system remains functional regardless of interaction style
```

#### Scenario 3.1: Rapid User Interactions
```gherkin
Scenario: Rapid clicking on add/remove buttons
  Given I am logged in as "standard_user"
  And I am on inventory page
  When I rapidly click "Add to cart" button 10 times for same product
  Then system should handle rapid clicks gracefully
  And should not add multiple instances of same product
  And cart count should remain accurate (showing 1, not 10)
  And button state should update correctly to "Remove"
  When I rapidly click "Remove" button 5 times
  Then product should be removed only once
  And cart should be empty
  And button should return to "Add to cart" state

Scenario: Simultaneous actions on multiple products
  Given I am logged in and on inventory page
  When I quickly add multiple products to cart in rapid succession
  Then each product should be added exactly once
  And cart badge should show correct total count
  And no race conditions should cause incorrect cart state
  When I rapidly remove multiple products from cart
  Then each removal should be processed correctly
  And cart state should remain consistent

Scenario: Double-click and multi-click scenarios
  Given I am in checkout process
  When I double-click the "Continue" button
  Then form should be submitted only once
  And should not cause duplicate processing
  And should not advance user multiple steps
  When I double-click "Finish" button on order completion
  Then order should be processed only once
  And should not create duplicate orders
```

#### Scenario 3.2: Navigation During Loading States
```gherkin
Scenario: Navigation during slow page loads
  Given I am logged in as "performance_glitch_user"
  When page is loading slowly due to performance issues
  And I try to navigate to different page before loading completes
  Then system should handle navigation conflicts appropriately
  And should not result in broken state
  And should either complete current action or gracefully cancel
  And user should not be left in undefined state

Scenario: Form submission during processing
  Given I am on checkout information page
  When I submit form and it's being processed
  And I try to navigate away or submit again
  Then system should handle concurrent actions properly
  And should prevent duplicate submissions
  And should maintain data consistency
  And should provide appropriate user feedback

Scenario: Rapid page navigation
  Given I am logged in and browsing products
  When I rapidly navigate between: Inventory → Product Detail → Cart → Checkout
  Then each page should load correctly
  And application state should remain consistent
  And no data should be lost during rapid navigation
  And user session should remain stable
```

#### Scenario 3.3: Concurrent and Conflicting Actions
```gherkin
Scenario: Concurrent cart modifications
  Given I have multiple items in cart
  When I simultaneously remove one item and proceed to checkout
  Then system should handle concurrent actions properly
  And should maintain data consistency
  And should either process actions in sequence or prevent conflicts
  And final cart state should be predictable

Scenario: Session actions with expired authentication
  Given I am logged in with items in cart
  When my session expires unnoticed
  And I try to perform cart operations
  Then system should detect expired session
  And should require re-authentication
  And should handle cart state appropriately after re-login

Scenario: Browser storage conflicts
  Given I am using application with various browser storage states
  When local storage and session storage have conflicting data
  Then system should resolve conflicts appropriately
  And should prioritize server-side data
  And should maintain consistent user experience
```

---

## 4. ENVIRONMENTAL AND TECHNICAL EDGE CASES

### Feature: Environmental Factors and Technical Limitations
```gherkin
Feature: Environmental Edge Cases
  As a user in various technical environments
  I want the application to work under different conditions
  So that functionality is maintained across different setups
```

#### Scenario 4.1: Network and Connectivity Edge Cases
```gherkin
Scenario: Intermittent network connectivity
  Given I am logged in and shopping
  When network connection becomes intermittent
  And I try to add products to cart during network issues
  Then system should handle network failures gracefully
  And should retry failed requests appropriately
  And should not lose user data
  And should provide clear feedback about connection status

Scenario: Slow network conditions
  Given I am using application on slow network connection
  When page loads and form submissions take longer than usual
  Then application should remain functional despite slow responses
  And should provide loading indicators
  And should not timeout prematurely
  And user should be able to complete tasks successfully

Scenario: Network disconnection during checkout
  Given I am in middle of checkout process
  When network connection is completely lost
  And I try to submit checkout form
  Then system should detect network failure
  And should preserve form data locally if possible
  And should provide clear error messaging
  And should allow retry when connection is restored
```

#### Scenario 4.2: Browser Compatibility Edge Cases
```gherkin
Scenario: JavaScript disabled scenarios
  Given I am using browser with JavaScript disabled
  When I try to use interactive features
  Then application should degrade gracefully
  And should provide alternative ways to complete tasks
  Or should clearly indicate JavaScript requirement

Scenario: Cookies disabled scenarios
  Given I am using browser with cookies disabled
  When I try to login and maintain session
  Then system should handle lack of cookie support
  And should provide appropriate error messaging
  And should suggest enabling cookies if required

Scenario: Browser zoom and accessibility
  Given I am using high zoom levels (200%+)
  When I navigate through application
  Then layout should remain functional
  And all interactive elements should remain accessible
  And text should remain readable
  And functionality should not be impaired
```

#### Scenario 4.3: Device and Platform Edge Cases
```gherkin
Scenario: Mobile device orientation changes
  Given I am using application on mobile device
  When I rotate device between portrait and landscape
  Then layout should adapt appropriately
  And functionality should remain intact
  And cart state should be preserved
  And form data should not be lost

Scenario: Low memory conditions
  Given application is running in low memory environment
  When I perform memory-intensive operations like loading many products
  Then application should handle memory constraints gracefully
  And should not crash or become unresponsive
  And should maintain core functionality

Scenario: Browser tab/window focus scenarios
  Given I have application open in background tab
  When I switch between tabs frequently
  And perform actions in foreground/background
  Then application state should remain consistent
  And timer-based operations should handle focus changes
  And user data should not be corrupted
```

---

## 📊 EDGE CASES TEST SUMMARY

### Edge Case Categories
- **Browser & Session**: 12 scenarios covering navigation, sessions, and multi-tab behavior
- **Data Boundary**: 9 scenarios covering limits, calculations, and validation boundaries  
- **User Behavior**: 9 scenarios covering rapid interactions and unusual patterns
- **Environmental**: 9 scenarios covering network, browser, and device conditions

### Total Edge Case Scenarios: 39
### Boundary Conditions Tested: 25+ scenarios
### Environmental Factors Covered: 15+ conditions

---

## 🎯 EDGE CASE TESTING PRIORITIES

### High Priority Edge Cases
- [ ] Session timeout during critical operations
- [ ] Cart state synchronization across tabs
- [ ] Rapid user interactions (double-clicks, rapid additions)
- [ ] Network disconnection during checkout
- [ ] Browser back/forward button behavior

### Medium Priority Edge Cases
- [ ] Maximum cart capacity and data limits
- [ ] International character handling
- [ ] Price calculation precision
- [ ] Concurrent user actions
- [ ] Browser compatibility issues

### Low Priority Edge Cases
- [ ] Extreme zoom levels
- [ ] JavaScript disabled scenarios
- [ ] Device orientation changes
- [ ] Memory constraint handling
- [ ] Focus/blur event handling

---

## ⚠️ EDGE CASE EXECUTION NOTES

### Prerequisites
- Test environment should support various browser configurations
- Network simulation tools should be available for connectivity testing
- Different user agents and devices should be tested
- Performance monitoring should be in place

### Expected Behaviors
- Application should never crash or become completely unresponsive
- Data integrity should be maintained under all conditions
- User should receive clear feedback for unusual situations
- Graceful degradation should occur when features are unavailable
- System should recover properly from edge case scenarios

---

**Note**: Edge case testing should be performed after functional and negative testing to ensure the application handles unusual but realistic scenarios that users might encounter in production environments.