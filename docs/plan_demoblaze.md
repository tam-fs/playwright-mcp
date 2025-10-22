# Comprehensive Test Plan for DemoBlaze E-Commerce Test Scripts

## Table of Contents
1. [Overview](#1-overview)
2. [Test Cases Analysis](#2-test-cases-analysis)
3. [Implementation Strategy](#3-implementation-strategy)
4. [Page Objects Definition](#4-page-objects-definition)
5. [Test Script Mapping](#5-test-script-mapping)
6. [Test Data Management](#6-test-data-management)
7. [Verification Approach](#7-verification-approach)
8. [Special Considerations](#8-special-considerations)
9. [Quality Assurance](#9-quality-assurance)

---

## 1. Overview

### Purpose
This test plan provides a comprehensive blueprint for converting manual test cases for the DemoBlaze e-commerce website (https://www.demoblaze.com/) into automated Playwright test scripts. The plan ensures consistent implementation aligned with the established project structure and coding conventions.

### Feature Being Tested
The test automation covers the core e-commerce functionality of DemoBlaze, including:
- **User Authentication**: Login functionality with credential validation
- **Product Browsing**: Category navigation and product selection across multiple categories
- **Shopping Cart Management**: Adding multiple items, viewing cart, and removing items
- **Checkout Process**: Complete purchase flow with customer information validation
- **End-to-End Shopping Flow**: Integration testing from login through checkout to logout

### Connection to Test Architecture
This implementation follows the Page Object Model (POM) architecture established in the project:
- All page objects extend `CommonPage` for consistent interaction patterns
- All locator classes extend `CommonLocators` for centralized selector management
- Tests are organized hierarchically under `tests/DemoBlaze/` by feature
- Shared utilities handle cross-cutting concerns (alerts, screenshots, helpers)
- Test data is managed through TypeScript interfaces and environment-specific data files

### Key Dependencies
- **Playwright Test Framework**: v1.40+ with TypeScript support
- **Browser Engines**: Microsoft Edge (Chromium) and Google Chrome
- **Node.js**: v18+ for TypeScript execution
- **Project Structure**: Assumes existing folder structure (constants, data, interfaces, locators, pages, tests, utils)

### Assumptions
- Project initialization is complete (package.json, playwright.config.ts, tsconfig.json already configured)
- Base classes `CommonPage` and `CommonLocators` are implemented and functional
- Screenshot utility and logging decorator (@step) are available
- Test user account exists: username="autouser_20251005_1234", password="autouser_20251005_1234"
- DemoBlaze website is accessible and stable

---

## 2. Test Cases Analysis

### Total Test Cases: 5

| Test Case ID | Feature | Complexity | Steps Count | Preconditions Required |
|--------------|---------|------------|-------------|------------------------|
| TC1 | Login - Valid Login | Low | 4 | User account exists |
| TC2 | Cart - Add Multiple Items | Medium | 8 | User logged in |
| TC3 | Checkout - Place Order | Medium | 5 | User logged in + Cart has items |
| TC4 | Cart - Remove Item | Low | 4 | User logged in + 2 items in cart |
| TC5 | Navigation - Full Shopping Flow | High | 10 | User account exists |

### Common Patterns Across Test Cases

#### 1. Navigation Patterns
- **Category Selection**: Clicking category links (Phones, Laptops, Monitors) appears in TC2 and TC5
- **Product Selection**: Navigating from category → product details → cart appears in TC2 and TC5
- **Modal Navigation**: Login modal (TC1, TC5), Checkout modal (TC3, TC5)

#### 2. Action Patterns
- **Alert Handling**: Browser alerts after "Add to cart" action (TC2, TC5)
- **Form Input**: Username/Password in login (TC1, TC5), Customer info in checkout (TC3, TC5)
- **Button Clicking**: Primary actions (Log in, Add to cart, Place Order, Purchase, Delete)

#### 3. Verification Patterns
- **Element Visibility**: Checking navbar text, buttons visibility/hidden state
- **Text Content**: Welcome message, product names, prices
- **Cart State**: Item count, total calculation, product list
- **Modal Content**: Confirmation messages, order details

### Unique Challenges

#### Line Break Handling
Test steps contain `</br>` markers indicating separate actions/verifications:
```
Example from TC1 Expected Results:
"1. Modal closes, user stays on Home page</br>
2. Navbar shows text "Welcome autouser_20251005_1234"</br>
3. Display [Log out] button</br>
4. Hide [Log in] button"
```
**Solution**: Each line after `</br>` must be treated as a separate assertion with individual screenshot capture.

#### Alert Management
TC2 and TC5 require accepting browser alerts after "Add to cart" actions.
**Solution**: Set up dialog listener before action: `page.on('dialog', dialog => dialog.accept())`

#### Cart Total Calculation
TC2, TC3, TC4 require verifying calculated totals match sum of product prices.
**Solution**: Create utility function `calculateCartTotal()` to validate expected vs actual.

#### Dynamic Product Prices
Product prices may vary on DemoBlaze.
**Solution**: Fetch actual price during test execution rather than hardcoding expected values.

### Required Test Data

#### Static Data (user credentials)
```typescript
// data/users.ts
export const testUsers = {
  validUser: {
    username: "autouser_20251005_1234",
    password: "autouser_20251005_1234"
  }
}
```

#### Dynamic Data (checkout information)
```typescript
// interfaces/checkout.interface.ts
export interface CheckoutData {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}
```

#### Product Data
```typescript
// interfaces/product.interface.ts
export interface Product {
  name: string;
  category: 'Phones' | 'Laptops' | 'Monitors';
  price?: number; // Fetched dynamically
}
```

### Required Preconditions

1. **Clean Browser State**: Each test starts with cleared cookies/storage
2. **User Account Exists**: Test user must be pre-registered on DemoBlaze
3. **Authenticated Session**: TC2, TC3, TC4 require logged-in state (use fixture)
4. **Pre-filled Cart**: TC3, TC4 require items already in cart (use fixture)

### Page Objects Needed

Based on test case navigation flow:
1. **LoginPage** - Handles login modal interactions (TC1, TC5)
2. **HomePage** - Category navigation, product browsing, navbar actions (All TCs)
3. **ProductPage** - Product details, add to cart (TC2, TC5)
4. **CartPage** - View cart, remove items, proceed to checkout (TC2, TC3, TC4, TC5)
5. **CheckoutPage** - Order placement form, confirmation modal (TC3, TC5)

---

## 3. Implementation Strategy

### File Organization

```
tests/
└── DemoBlaze/
    ├── auth.spec.ts                     # TC1: Login (authentication-related)
    ├── cart.spec.ts                     # TC2, TC4: Cart operations (add items, remove item)
    └── checkout.spec.ts                 # TC3, TC5: Checkout and full flow
```

**Rationale**: 
- **Grouped by feature domain**: Tests organized by functional area (Auth, Cart, Checkout)
- **Balanced file size**: 1-2 tests per file to avoid overly long files
- **Shared setup with beforeEach**: Common preconditions handled in hooks within each file
- **Logical grouping**: 
  - **auth.spec.ts**: Authentication tests (login/logout)
  - **cart.spec.ts**: Cart management tests (add multiple items, remove items)
  - **checkout.spec.ts**: Purchase flow tests (checkout with order, full e2e flow)
- **Easy navigation**: Related tests in same file, but not overwhelming

### Naming Conventions

#### Test Files
- Pattern: `{feature}.spec.ts`
- Examples: `auth.spec.ts`, `cart.spec.ts`, `checkout.spec.ts`
- Each file contains 1-2 related test cases grouped by feature domain

#### Test Functions
- Pattern: `test('TC{id} - {feature/description} - {condition} - {expected outcome}', async ({ page }) => { ... })`
- Examples:
  ```typescript
  test('TC1 - Login functionality - valid credentials - successful login with welcome message and logout button visible', async ({ page }) => { ... })
  test('TC2 - Cart functionality - add multiple products from different categories - cart displays all items with correct prices and total', async ({ page }) => { ... })
  test('TC3 - Checkout functionality - valid customer information - order placed successfully with confirmation', async ({ page }) => { ... })
  test('TC4 - Cart functionality - remove single item from cart - cart updates with correct remaining item and total', async ({ page }) => { ... })
  test('TC5 - Full shopping flow - complete flow from login to logout - successful purchase and user logout', async ({ page }) => { ... })
  ```

**Format Breakdown**:
- **TC{id}**: Test case identifier (TC1, TC2, etc.)
- **{feature/description}**: Main feature being tested (Login functionality, Cart functionality, etc.)
- **{condition}**: Test condition or scenario (valid credentials, multiple products, etc.)
- **{expected outcome}**: Expected result summary (successful login, cart displays correctly, etc.)

#### Page Object Classes
- Pattern: `{PageName}Page extends CommonPage`
- Examples: `LoginPage`, `HomePage`, `ProductPage`, `CartPage`, `CheckoutPage`

#### Locator Classes
- Pattern: `{PageName}Locators extends CommonLocators`
- Examples: `LoginLocators`, `HomeLocators`, `ProductLocators`, `CartLocators`, `CheckoutLocators`

#### Methods in Page Objects
- Pattern: Action-oriented verbs in camelCase
- Examples: `login()`, `selectCategory()`, `addToCart()`, `removeItem()`, `completePurchase()`

### Page Object Organization

#### Structure
```
pages/
├── common-pages.ts                  # Base class (already exists)
├── login-page.ts                    # LoginPage extends CommonPage
├── home-page.ts                     # HomePage extends CommonPage
├── product-page.ts                  # ProductPage extends CommonPage
├── cart-page.ts                     # CartPage extends CommonPage
└── checkout-page.ts                 # CheckoutPage extends CommonPage
```

#### Page Object Template

**Standard Structure**:
```typescript
import { Page } from "@playwright/test";
import { CommonPage } from "./common-pages";
import { LoginLocators } from "../locators/login-locators";

export class LoginPage extends CommonPage {
  readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  // High-level business methods
  async login(username: string, password: string): Promise<void> {
    await this.click(this.locators.loginButton);
    await this.fill(this.locators.usernameInput, username);
    // ... other steps
  }

  async verifyLoginSuccess(username: string): Promise<void> {
    await this.waitForVisible(this.locators.welcomeText);
    const welcomeText = await this.getText(this.locators.welcomeText);
    expect.soft(welcomeText).toContain(`Welcome ${username}`);
    await this.takeScreenshot('Login-Success-Verification');
  }
}
```

**Key Requirements**:
- ✅ **Inheritance**: Class must extend `CommonPage`
- ✅ **Locators Property**: Declare `readonly locators: {PageName}Locators`
- ✅ **Constructor**: Must call `super(page)` and initialize locators
- ✅ **Method Implementation**: Use CommonPage methods (`click`, `fill`, `getText`, `waitForVisible`, etc.)
- ✅ **Business-Level Abstraction**: Methods represent user flows, not low-level interactions
- ✅ **Verification Methods**: Use `expect.soft` and `takeScreenshot` for assertions

### Locator Organization

#### Structure
```
locators/
├── common-locators.ts               # Base class (already exists)
├── login-locators.ts                # LoginLocators extends CommonLocators
├── home-locators.ts                 # HomeLocators extends CommonLocators
├── product-locators.ts              # ProductLocators extends CommonLocators
├── cart-locators.ts                 # CartLocators extends CommonLocators
└── checkout-locators.ts             # CheckoutLocators extends CommonLocators
```

#### Locator Class Template

**Standard Structure**:
```typescript
import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class LoginLocators extends CommonLocators {
  // Declare locator properties
  loginButton!: Locator;
  usernameInput!: Locator;
  passwordInput!: Locator;
  // ... other locators

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators(); // CRITICAL: Call parent first
    
    // Initialize with XPath placeholders (without 'xpath=' prefix)
    this.loginButton = this.page.locator('[PLACEHOLDER_XPATH_LOGIN_BUTTON]');
    this.usernameInput = this.page.locator('[PLACEHOLDER_XPATH_USERNAME_INPUT]');
    // ... other initializations
  }
}
```

**Key Requirements**:
- ✅ **Inheritance**: Class must extend `CommonLocators`
- ✅ **Property Declaration**: All locators declared with `!: Locator` type
- ✅ **Constructor**: Must call `super(page)` and `this.initializeLocators()`
- ✅ **initializeLocators**: Must be `protected`, call `super.initializeLocators()` first
- ✅ **XPath Only**: All locators MUST use XPath selectors (without `xpath=` prefix)
- ✅ **Placeholders**: Use `[PLACEHOLDER_XPATH_*]` format for XPath selectors to be filled during implementation

### Common Utilities Needed

#### 1. Alert Handler Utility
```typescript
// utils/alert-handler.ts
export class AlertHandler {
  static setupAlertListener(page: Page, action: 'accept' | 'dismiss' = 'accept'): void {
    // Setup dialog listener before actions that trigger alerts
  }
  
  static async waitForAlert(page: Page): Promise<string> {
    // Wait for alert and return alert message
  }
}
```

#### 2. Cart Utilities
```typescript
// utils/cart-helper.ts
export class CartHelper {
  static calculateTotal(prices: number[]): number {
    // Sum array of prices
  }
  
  static formatPrice(price: string): number {
    // Parse price string to number (handle currency symbols)
  }
}
```

#### 3. Screenshot Utility Enhancement
```typescript
// utils/screenshot-helper.ts
export class ScreenshotHelper {
  static async captureStep(page: Page, stepDescription: string): Promise<void> {
    // Take screenshot with timestamp and step description
    // Already exists in Helper.takeScreenshot(), may need enhancement
  }
}
```

#### 4. Navigation Helper
```typescript
// utils/navigation-helper.ts
export class NavigationHelper {
  static async navigateToCategory(page: Page, category: string): Promise<void> {
    // Reusable category navigation
  }
}
```

### Test Data Management Approach

#### Interface Definitions
```
interfaces/
├── user.interface.ts                # User credentials structure
├── product.interface.ts             # Product information structure
├── checkout.interface.ts            # Checkout form data structure
└── cart.interface.ts                # Cart item structure
```

#### Static Data Files (Environment-Specific)
```
data/
├── stg/                             # Staging environment data
│   ├── users.json                   # Test user credentials for staging
│   ├── products.json                # Product catalog for staging
│   └── checkout-data.json           # Sample checkout information for staging
├── dev/                             # Development environment data
│   ├── users.json                   # Test user credentials for dev
│   ├── products.json                # Product catalog for dev
│   └── checkout-data.json           # Sample checkout information for dev
└── prod/                            # Production environment data (if applicable)
    ├── users.json                   # Test user credentials for prod
    ├── products.json                # Product catalog for prod
    └── checkout-data.json           # Sample checkout information for prod
```

**Alternative**: Data files can also be stored as CSV files for easy editing:
```
data/
├── stg/
│   ├── users.csv
│   ├── products.csv
│   └── checkout-data.csv
```

#### Data Reading Utilities
```
utils/
├── data-reader.ts                   # Generic file reading utilities
└── global-setup.ts                   # Environment-specific data loader
```

**Example Data Reader Implementation**:
```typescript
// utils/data-reader.ts
import * as fs from 'fs';
import * as path from 'path';

export class DataReader {
  static readJSON<T>(filePath: string): T {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  static readCSV(filePath: string): any[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {} as any);
    });
  }
}
```

**Example Test Data Loader**:
```typescript
// utils/test-data-loader.ts
import { DataReader } from './data-reader';
import * as path from 'path';
import { User } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';
import { CheckoutData } from '../interfaces/checkout.interface';

export class TestDataLoader {
  private static env = process.env.TEST_ENV || 'stg';
  private static dataPath = path.join(__dirname, '..', 'data', this.env);

  static loadUsers(): User[] {
    return DataReader.readJSON<User[]>(path.join(this.dataPath, 'users.json'));
  }

  static loadProducts(): Product[] {
    return DataReader.readJSON<Product[]>(path.join(this.dataPath, 'products.json'));
  }

  static loadCheckoutData(): CheckoutData[] {
    return DataReader.readJSON<CheckoutData[]>(path.join(this.dataPath, 'checkout-data.json'));
  }
}
```

#### Example Interface
```typescript
// interfaces/user.interface.ts
export interface User {
  username: string;
  password: string;
}

// interfaces/product.interface.ts
export interface Product {
  name: string;
  category: 'Phones' | 'Laptops' | 'Monitors';
  price?: number;
}

// interfaces/checkout.interface.ts
export interface CheckoutData {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}
```

#### Example Data File (JSON)
```json
// data/stg/users.json
[
  {
    "username": "autouser_20251005_1234",
    "password": "autouser_20251005_1234"
  }
]

// data/stg/products.json
[
  {
    "name": "Samsung galaxy s6",
    "category": "Phones"
  },
  {
    "name": "MacBook Pro",
    "category": "Laptops"
  }
]

// data/stg/checkout-data.json
[
  {
    "name": "John Doe",
    "country": "USA",
    "city": "New York",
    "creditCard": "4111111111111111",
    "month": "12",
    "year": "2025"
  },
  {
    "name": "Anna",
    "country": "VN",
    "city": "HCM",
    "creditCard": "12345678",
    "month": "01",
    "year": "2026"
  }
]
```

#### Usage in Tests
```typescript
// Import test data loader
import { TestDataLoader } from '../../../utils/test-data-loader';

test('TC1 - Login functionality', async ({ page }) => {
  // Load test data for current environment
  const users = TestDataLoader.loadUsers();
  const testUser = users[0]; // Get first user
  
  // Use loaded data
  await loginPage.login(testUser.username, testUser.password);
});
```

### Handling Preconditions Efficiently

#### Approach: Programmatic Setup Instead of Fixtures

Instead of creating separate fixture files, preconditions are handled **programmatically within each test** for better clarity and maintainability.

#### Pattern 1: Shared Setup with beforeEach

```typescript
test.describe('DemoBlaze E-Commerce Test Suite', () => {
  // Shared setup: Navigate to base URL before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.demoblaze.com/');
  });
  
  // Individual tests...
});
```

**Benefits**:
- All tests start from the same base URL
- No duplicate navigation code in each test
- Easy to add global setup (e.g., viewport size, timeouts)

#### Pattern 2: Authentication Setup (for TC2, TC3, TC4)

```typescript
test('TC2 - Cart - Add Multiple Items', async ({ page }) => {
  // Pre-condition: Login
  const loginPage = new LoginPage(page);
  const testUser = users[0];
  await loginPage.login(testUser.username, testUser.password);
  
  // Test steps...
});
```

**Benefits**:
- Clear and visible precondition in test code
- Easy to debug and modify
- No hidden fixture logic

#### Pattern 3: Cart Setup (for TC3, TC4)

```typescript
test('TC3 - Checkout - Place Order', async ({ page }) => {
  // Pre-condition: Login and add items
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const testUser = users[0];
  
  await loginPage.login(testUser.username, testUser.password);
  
  // Setup alert listener
  page.on('dialog', async (dialog) => await dialog.accept());
  
  // Add product to cart
  await homePage.selectCategory('Phones');
  await homePage.selectProduct('Samsung galaxy s6');
  await productPage.addToCart();
  
  // Navigate to cart
  await homePage.goToCart();
  
  // Main test steps...
});
```

**Benefits**:
- Complete test flow visible in one place
- Easy to understand what preconditions are needed
- Simple to modify product selection for specific tests

#### Pattern 4: Alert Handler Setup

```typescript
test('TC2 - Cart - Add Multiple Items', async ({ page }) => {
  // Setup alert listener before actions that trigger alerts
  page.on('dialog', async (dialog) => {
    console.log(`Alert: ${dialog.message()}`);
    await dialog.accept();
  });
  
  // Add to cart actions will now automatically accept alerts
  await productPage.addToCart();
});
```

**Benefits**:
- Single setup for all alert interactions
- Alerts logged for debugging
- Works for multiple "Add to cart" actions in same test

#### Summary: Why No Separate Fixtures?

**Reasons for programmatic setup**:
1. **Better Readability**: Test flow is clear from start to finish
2. **Easier Maintenance**: No need to look at separate fixture files
3. **Simpler Debugging**: All setup code visible in test
4. **Flexibility**: Easy to customize preconditions per test
5. **Single File Approach**: Aligns with strategy of keeping all tests in one file

**When fixtures might be useful** (for future consideration):
- If tests grow significantly (10+ tests with identical setup)
- If setup becomes complex (multiple API calls, database seeding)
- If parallel execution requires isolated state management

---

## 4. Page Objects Definition

### 4.1 LoginPage

#### Page Object Class
- **Name**: `LoginPage`
- **Location**: `pages/login-page.ts`
- **Locator File**: `locators/login-locators.ts`

#### Essential Methods

| Method Name | Parameters | Return Type | Description | Navigation After Execution |
|-------------|------------|-------------|-------------|----------------------------|
| `openLoginModal()` | - | `Promise<void>` | Click [Log in] button in navbar to open login modal | Login modal displayed |
| `fillUsername(username)` | `username: string` | `Promise<void>` | Input username into username field | - |
| `fillPassword(password)` | `password: string` | `Promise<void>` | Input password into password field | - |
| `clickLoginButton()` | - | `Promise<void>` | Click [Log in] button in modal to submit | HomePage (modal closes) |
| `login(username, password)` | `username: string, password: string` | `Promise<void>` | Complete login flow: open modal → fill credentials → submit | HomePage (authenticated) |
| `verifyLoginSuccess(username)` | `username: string` | `Promise<void>` | Verify welcome message, logout button visible, login button hidden | - |
| `logout()` | - | `Promise<void>` | Click [Log out] button and verify login button visible | HomePage (unauthenticated) |

#### Locators Definition
**IMPORTANT: All locators MUST use XPath selectors without the 'xpath=' prefix.**

```typescript
// locators/login-locators.ts
export class LoginLocators extends CommonLocators {
  navbarLoginButton!: Locator;
  loginModal!: Locator;
  usernameInput!: Locator;
  passwordInput!: Locator;
  modalLoginButton!: Locator;
  welcomeText!: Locator;
  logoutButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();
    
    // All locators use XPath (without xpath= prefix)
    this.navbarLoginButton = this.page.locator('[PLACEHOLDER_XPATH_NAVBAR_LOGIN_BUTTON]');
    this.usernameInput = this.page.locator('[PLACEHOLDER_XPATH_USERNAME_INPUT]');
    // ... other locators
  }
}
```

#### Expected Navigation Patterns
- **After `login()`**: User navigated to HomePage, modal closed, navbar shows "Welcome {username}"
- **After `logout()`**: User remains on HomePage, navbar shows "Log in" button

---

### 4.2 HomePage

#### Page Object Class
- **Name**: `HomePage`
- **Location**: `pages/home-page.ts`
- **Locator File**: `locators/home-locators.ts`

#### Essential Methods

| Method Name | Parameters | Return Type | Description | Navigation After Execution |
|-------------|------------|-------------|-------------|----------------------------|
| `selectCategory(category)` | `category: 'Phones' \| 'Laptops' \| 'Monitors'` | `Promise<void>` | Click category link to filter products | HomePage (filtered view) |
| `selectProduct(productName)` | `productName: string` | `Promise<void>` | Click product by name from product list | ProductPage |
| `clickHome()` | - | `Promise<void>` | Click [Home] link in navbar | HomePage (all products) |
| `goToCart()` | - | `Promise<void>` | Click [Cart] link in navbar | CartPage |
| `verifyWelcomeMessage(username)` | `username: string` | `Promise<void>` | Verify navbar displays "Welcome {username}" | - |
| `verifyLoginButtonHidden()` | - | `Promise<void>` | Verify [Log in] button is not visible | - |
| `verifyLogoutButtonVisible()` | - | `Promise<void>` | Verify [Log out] button is visible | - |

#### Locators Definition
**IMPORTANT: All locators MUST use XPath selectors without the 'xpath=' prefix.**

```typescript
// locators/home-locators.ts
export class HomeLocators extends CommonLocators {
  categoryPhones!: Locator;
  categoryLaptops!: Locator;
  categoryMonitors!: Locator;
  homeNavLink!: Locator;
  cartNavLink!: Locator;
  navbarWelcomeText!: Locator;
  navbarLoginButton!: Locator;
  navbarLogoutButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();
    
    this.categoryPhones = this.page.locator('[PLACEHOLDER_XPATH_CATEGORY_PHONES]');
    this.categoryLaptops = this.page.locator('[PLACEHOLDER_XPATH_CATEGORY_LAPTOPS]');
    // ... other locators
  }

  // Dynamic locator for product selection
  productLink(name: string): Locator {
    return this.page.locator(`[PLACEHOLDER_XPATH_PRODUCT_LINK="${name}"]`);
  }
}
```

#### Expected Navigation Patterns
- **After `selectCategory()`**: HomePage refreshed with filtered products for selected category
- **After `selectProduct()`**: ProductPage displayed with product details
- **After `goToCart()`**: CartPage displayed with cart contents

---

### 4.3 ProductPage

#### Page Object Class
- **Name**: `ProductPage`
- **Location**: `pages/product-page.ts`
- **Locator File**: `locators/product-locators.ts`

#### Essential Methods

| Method Name | Parameters | Return Type | Description | Navigation After Execution |
|-------------|------------|-------------|-------------|----------------------------|
| `addToCart()` | - | `Promise<void>` | Click [Add to cart] button and accept alert | ProductPage (alert dismissed) |
| `getProductName()` | - | `Promise<string>` | Get product name from page | - |
| `getProductPrice()` | - | `Promise<number>` | Get product price and parse to number | - |
| `verifyProductDetails(name, price)` | `name: string, price?: number` | `Promise<void>` | Verify product name and price match expected values | - |
| `navigateHome()` | - | `Promise<void>` | Click [Home] link to return to home | HomePage |

#### Locators Definition
**IMPORTANT: All locators MUST use XPath selectors without the 'xpath=' prefix.**

```typescript
// locators/product-locators.ts
export class ProductLocators extends CommonLocators {
  productName!: Locator;
  productPrice!: Locator;
  addToCartButton!: Locator;
  homeLink!: Locator;

  protected initializeLocators(): void {
    super.initializeLocators();
    
    this.productName = this.page.locator('[PLACEHOLDER_XPATH_PRODUCT_NAME]');
    this.productPrice = this.page.locator('[PLACEHOLDER_XPATH_PRODUCT_PRICE]');
    // ... other locators
  }
}
```

#### Expected Navigation Patterns
- **After `addToCart()`**: User remains on ProductPage, alert accepted, product added to cart
- **After `navigateHome()`**: User navigated to HomePage

---

### 4.4 CartPage

#### Page Object Class
- **Name**: `CartPage`
- **Location**: `pages/cart-page.ts`
- **Locator File**: `locators/cart-locators.ts`

#### Essential Methods

| Method Name | Parameters | Return Type | Description | Navigation After Execution |
|-------------|------------|-------------|-------------|----------------------------|
| `getCartItems()` | - | `Promise<{name: string, price: number}[]>` | Get array of cart items with name and price | - |
| `verifyCartContainsProduct(productName)` | `productName: string` | `Promise<void>` | Verify cart contains specific product | - |
| `verifyCartItemCount(count)` | `count: number` | `Promise<void>` | Verify number of items in cart | - |
| `getTotal()` | - | `Promise<number>` | Get cart total and parse to number | - |
| `verifyTotal(expectedTotal)` | `expectedTotal: number` | `Promise<void>` | Verify cart total matches expected value | - |
| `removeItem(productName)` | `productName: string` | `Promise<void>` | Click [Delete] button for specific product | CartPage (item removed) |
| `clickPlaceOrder()` | - | `Promise<void>` | Click [Place Order] button | Checkout modal displayed |

#### Locators Definition
**IMPORTANT: All locators MUST use XPath selectors without the 'xpath=' prefix.**

```typescript
// locators/cart-locators.ts
export class CartLocators extends CommonLocators {
  cartTable!: Locator;
  cartItemRow!: Locator;
  cartTotal!: Locator;
  placeOrderButton!: Locator;

  protected initializeLocators(): void {
    super.initializeLocators();
    
    this.cartTable = this.page.locator('[PLACEHOLDER_XPATH_CART_TABLE]');
    this.cartItemRow = this.page.locator('[PLACEHOLDER_XPATH_CART_ITEM_ROW]');
    // ... other locators
  }

  // Dynamic locators
  cartItemName(row: Locator): Locator {
    return row.locator('[PLACEHOLDER_XPATH_ITEM_NAME]');
  }

  deleteButton(productName: string): Locator {
    return this.page.locator(`[PLACEHOLDER_XPATH_DELETE_BUTTON="${productName}"]`);
  }
}
```

#### Expected Navigation Patterns
- **After `removeItem()`**: CartPage refreshed, item removed from list, total recalculated
- **After `clickPlaceOrder()`**: Checkout modal displayed on same page

---

### 4.5 CheckoutPage

#### Page Object Class
- **Name**: `CheckoutPage`
- **Location**: `pages/checkout-page.ts`
- **Locator File**: `locators/checkout-locators.ts`

#### Essential Methods

| Method Name | Parameters | Return Type | Description | Navigation After Execution |
|-------------|------------|-------------|-------------|----------------------------|
| `fillCheckoutForm(data)` | `data: CheckoutData` | `Promise<void>` | Fill all checkout form fields (name, country, city, card, month, year) | - |
| `clickPurchase()` | - | `Promise<void>` | Click [Purchase] button to submit order | Confirmation modal displayed |
| `verifyOrderConfirmation()` | - | `Promise<void>` | Verify "Thank you for your purchase!" message displayed | - |
| `getOrderId()` | - | `Promise<string>` | Extract Order ID from confirmation modal | - |
| `getOrderAmount()` | - | `Promise<number>` | Extract order amount from confirmation modal | - |
| `closeConfirmation()` | - | `Promise<void>` | Click [OK] button in confirmation modal | HomePage |
| `completePurchase(data)` | `data: CheckoutData` | `Promise<void>` | Complete checkout: fill form → submit → verify confirmation → close | HomePage (cart cleared) |

#### Locators Definition
**IMPORTANT: All locators MUST use XPath selectors without the 'xpath=' prefix.**

```typescript
// locators/checkout-locators.ts
export class CheckoutLocators extends CommonLocators {
  checkoutModal!: Locator;
  nameInput!: Locator;
  countryInput!: Locator;
  creditCardInput!: Locator;
  purchaseButton!: Locator;
  confirmationModal!: Locator;
  confirmationMessage!: Locator;
  orderId!: Locator;
  confirmationOkButton!: Locator;

  protected initializeLocators(): void {
    super.initializeLocators();
    
    this.checkoutModal = this.page.locator('[PLACEHOLDER_XPATH_CHECKOUT_MODAL]');
    this.nameInput = this.page.locator('[PLACEHOLDER_XPATH_NAME_INPUT]');
    // ... other locators
  }
}
```

#### Expected Navigation Patterns
- **After `fillCheckoutForm()`**: User remains on checkout modal, form filled
- **After `clickPurchase()`**: Confirmation modal displayed (checkout modal closes)
- **After `closeConfirmation()`**: User navigated to HomePage, cart cleared

---

## 5. Test Script Mapping

### Test Organization by Feature

Tests are organized into **3 files** grouped by functional domain for balanced file size and logical grouping.

| Test Case ID | Test File | Test Function Name | Page Objects Required | Shared Setup (beforeEach) | Special Handling |
|--------------|-----------|-------------------|----------------------|---------------------------|------------------|
| TC1 | `auth.spec.ts` | `test('TC1 - Login - Valid Login - Successful login')` | `LoginPage`, `HomePage` | Navigate to base URL | Modal interactions, screenshot verification |
| TC2 | `cart.spec.ts` | `test('TC2 - Cart - Add Multiple Items - Cart displays correctly')` | `HomePage`, `ProductPage`, `CartPage` | Navigate + Login | Alert listener, cart total calculation |
| TC4 | `cart.spec.ts` | `test('TC4 - Cart - Remove Item - Cart updates correctly')` | `HomePage`, `ProductPage`, `CartPage` | Navigate + Login + Add 2 items | Cart state verification, total recalculation |
| TC3 | `checkout.spec.ts` | `test('TC3 - Checkout - Place Order - Order successful')` | `CartPage`, `CheckoutPage`, `HomePage` | Navigate + Login + Add item | Checkout modal, order confirmation |
| TC5 | `checkout.spec.ts` | `test('TC5 - Full Shopping Flow - E2E flow complete')` | All pages | Navigate to base URL | Multiple alerts, all modals, complete flow |

### Benefits of This Organization

1. **Logical Grouping**: Tests grouped by feature domain (Auth, Cart, Checkout)
2. **Balanced Files**: 1-2 tests per file (not too long, not too fragmented)
3. **Shared Context**: Related tests share beforeEach setup within same file
4. **Easy Navigation**: Clear file names indicate test content
5. **Maintainable**: Can add more tests to appropriate file as needed

### Test File Structure Overview

Each test file follows this pattern:

```typescript
// Example: tests/DemoBlaze/cart.spec.ts
import { test, expect } from '@playwright/test';
import { /* required page objects */ } from '../../pages';
import { TestDataLoader } from '../../utils/test-data-loader';

// Load test data once
const users = TestDataLoader.loadUsers();
const products = TestDataLoader.loadProducts();

test.describe('Cart Management Tests', () => {
  // Shared setup
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.demoblaze.com/');
    // Additional setup if needed for this group
  });

  test('TC2 - Cart - Add Multiple Items', async ({ page }) => {
    // Test implementation
  });

  test('TC4 - Cart - Remove Item', async ({ page }) => {
    // Test implementation
  });
});
```

### Key Features

1. **beforeEach Hook**: Shared setup for tests in same file
2. **Data Loading**: Test data loaded once per file
3. **Clear Naming**: Test descriptions match test case IDs
4. **Programmatic Setup**: Preconditions handled within tests
5. **Alert Handling**: Dialog listener setup where needed

---

## 6. Test Data Management

### Test Data Generation Strategy

#### 1. Static Test Data Files (Environment-Specific)
**Organization**: Test data is organized by environment (stg, dev, prod) in JSON or CSV format

**Location Structure**:
```
data/
├── stg/                             # Staging environment
│   ├── users.json
│   ├── products.json
│   └── checkout-data.json
├── dev/                             # Development environment
│   ├── users.json
│   ├── products.json
│   └── checkout-data.json
└── prod/                            # Production environment
    ├── users.json
    ├── products.json
    └── checkout-data.json
```

**Example: User Credentials (JSON)**
```json
// data/stg/users.json
[
  {
    "username": "autouser_20251005_1234",
    "password": "autouser_20251005_1234"
  }
]
```

**Example: Product Catalog (JSON)**
```json
// data/stg/products.json
[
  {
    "name": "Samsung galaxy s6",
    "category": "Phones"
  },
  {
    "name": "MacBook Pro",
    "category": "Laptops"
  },
  {
    "name": "MacBook Air",
    "category": "Laptops"
  },
  {
    "name": "Sony xperia z5",
    "category": "Phones"
  },
  {
    "name": "Sony vaio i5",
    "category": "Laptops"
  },
  {
    "name": "Apple monitor 24",
    "category": "Monitors"
  }
]
```

**Rationale**: Product prices are dynamic on DemoBlaze, so prices should be fetched during test execution rather than hardcoded in data files.

**Example: Checkout Information (JSON)**
```json
// data/stg/checkout-data.json
[
  {
    "name": "John Doe",
    "country": "USA",
    "city": "New York",
    "creditCard": "4111111111111111",
    "month": "12",
    "year": "2025"
  },
  {
    "name": "Anna",
    "country": "VN",
    "city": "HCM",
    "creditCard": "12345678",
    "month": "01",
    "year": "2026"
  }
]
```

#### 2. Data Reading Utilities
**Location**: `utils/` folder contains functions to load and parse test data files

**Data Reader Utility** (`utils/data-reader.ts`):
```typescript
import * as fs from 'fs';
import * as path from 'path';

export class DataReader {
  static readJSON<T>(filePath: string): T {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  static readCSV(filePath: string): any[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {} as any);
    });
  }
}
```

**Test Data Loader** (`utils/test-data-loader.ts`):
```typescript
import { DataReader } from './data-reader';
import * as path from 'path';
import { User } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';
import { CheckoutData } from '../interfaces/checkout.interface';

export class TestDataLoader {
  private static env = process.env.TEST_ENV || 'stg';
  private static dataPath = path.join(__dirname, '..', 'data', this.env);

  static loadUsers(): User[] {
    return DataReader.readJSON<User[]>(path.join(this.dataPath, 'users.json'));
  }

  static loadProducts(): Product[] {
    return DataReader.readJSON<Product[]>(path.join(this.dataPath, 'products.json'));
  }

  static loadCheckoutData(): CheckoutData[] {
    return DataReader.readJSON<CheckoutData[]>(path.join(this.dataPath, 'checkout-data.json'));
  }
}
```

#### 3. Usage in Tests
```typescript
// Import test data loader
import { TestDataLoader } from '../../../utils/test-data-loader';

test('TC1 - Login functionality', async ({ page }) => {
  // Load test data for current environment
  const users = TestDataLoader.loadUsers();
  const testUser = users[0];
  
  const products = TestDataLoader.loadProducts();
  const checkoutData = TestDataLoader.loadCheckoutData();
  
  // Use loaded data in test
  await loginPage.login(testUser.username, testUser.password);
});
```

**Benefits**:
- **Environment Isolation**: Each environment has its own test data
- **Easy Maintenance**: Update JSON/CSV files without modifying code
- **Centralized Reading Logic**: All file reading functions in `utils/` folder
- **Type Safety**: Data validated against TypeScript interfaces

### Managing Test State Between Runs

#### Browser State Management
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Clear browser state before each test
    storageState: undefined,
    
    // Clear cookies between tests
    contextOptions: {
      clearCookies: true,
    },
  },
});
```

#### Test Isolation Strategy
- **Each test starts with clean state**: No shared authentication or cart state between independent tests
- **Use fixtures for preconditions**: Tests requiring authentication use `authenticatedPage` fixture
- **Parallel execution safe**: Tests can run in parallel without interfering (4 workers configured)

### Handling Environmental Dependencies

#### Environment Configuration
**Location**: `.env` file (root directory)

```bash
# Test environment (determines which data folder to use)
TEST_ENV=stg                         # Options: stg, dev, prod

# Browser configuration
HEADED_MODE=false
BROWSER=chromium

# Application URLs
BASE_URL=https://www.demoblaze.com/

# Screenshot configuration
SCREENSHOT_PATH=./test-results/screenshots
```

**Access in tests**:
```typescript
import { config } from 'dotenv';
config();

const baseURL = process.env.BASE_URL || 'https://www.demoblaze.com/';
const testEnv = process.env.TEST_ENV || 'stg';
```

#### Multi-Environment Support
**Data Organization by Environment**:
```
data/
├── stg/                             # Staging environment data
│   ├── users.json
│   ├── products.json
│   └── checkout-data.json
├── dev/                             # Development environment data
│   ├── users.json
│   ├── products.json
│   └── checkout-data.json
└── prod/                            # Production environment data
    ├── users.json
    ├── products.json
    └── checkout-data.json
```

**Automatic Environment Selection**:
The `TestDataLoader` utility automatically loads data from the correct environment folder based on the `TEST_ENV` environment variable:

```typescript
// utils/test-data-loader.ts
export class TestDataLoader {
  private static env = process.env.TEST_ENV || 'stg';
  private static dataPath = path.join(__dirname, '..', 'data', this.env);
  
  // Automatically loads from data/{env}/users.json
  static loadUsers(): User[] {
    return DataReader.readJSON<User[]>(path.join(this.dataPath, 'users.json'));
  }
}
```

**Running Tests Against Different Environments**:
```bash
# Run tests against staging (default)
npx playwright test

# Run tests against development
TEST_ENV=dev npx playwright test

# Run tests against production
TEST_ENV=prod npx playwright test
```

### Cleanup Procedures

#### Post-Test Cleanup
```typescript
// tests/fixtures/cleanup.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);
    
    // Cleanup after test
    if (await page.locator('[id="logout2"]').isVisible()) {
      await page.locator('[id="logout2"]').click();
    }
    
    // Clear local storage
    await page.evaluate(() => localStorage.clear());
  },
});
```

#### Cart Cleanup
- **After TC3 and TC5**: Verify cart is empty after successful order
- **After TC2 and TC4**: No cleanup needed (cart state doesn't persist between tests)

#### Database/API Cleanup
- **Not applicable**: DemoBlaze is a demo site without backend access
- **Test data isolation**: Use unique order references (timestamps) if tracking needed

---

## 7. Verification Approach

### 1. Navigation Events Verification

**Strategy**: Use `expect.soft` to allow test continuation even if navigation fails

#### URL Verification
```typescript
// Verify page navigated to expected URL
await expect.soft(page).toHaveURL('https://www.demoblaze.com/index.html');
await loginPage.takeScreenshot('Navigation-HomePage');
```

#### Key Element Presence After Navigation
```typescript
// Verify key element visible after navigation
await expect.soft(homePage.locators.navbarWelcomeText).toBeVisible();
await homePage.takeScreenshot('Navigation-WelcomeVisible');
```

**Examples in Test Cases**:
- **TC1**: After login, verify URL is home page and modal is closed
- **TC2**: After clicking category, verify category products displayed
- **TC5**: After checkout, verify redirect to home page

---

### 2. UI State Verification

**Strategy**: Verify visibility, enabled/disabled state, and element presence using `expect.soft`

#### Visibility Verification
```typescript
// Verify element is visible
await expect.soft(homePage.locators.navbarLogoutButton).toBeVisible();
await homePage.takeScreenshot('UIState-LogoutVisible');

// Verify element is hidden
await expect.soft(homePage.locators.navbarLoginButton).toBeHidden();
await homePage.takeScreenshot('UIState-LoginHidden');
```

#### Enabled/Disabled State
```typescript
// Verify button is enabled
await expect.soft(cartPage.locators.placeOrderButton).toBeEnabled();
await cartPage.takeScreenshot('UIState-PlaceOrderEnabled');

// Verify input is editable
await expect.soft(checkoutPage.locators.nameInput).toBeEditable();
```

#### Element Count Verification
```typescript
// Verify number of cart items
const cartItems = cartPage.locators.cartItemRow;
await expect.soft(cartItems).toHaveCount(2);
await cartPage.takeScreenshot('UIState-CartItemCount');
```

**Examples in Test Cases**:
- **TC1**: Verify [Log out] button visible, [Log in] button hidden
- **TC2**: Verify 2 products displayed in cart
- **TC4**: Verify only 1 product remains after deletion

---

### 3. Error Message Validation

**Strategy**: Validate expected error texts using `expect.soft` for non-blocking assertions

#### Error Text Verification
```typescript
// Verify error message contains expected text
await expect.soft(loginPage.locators.errorMessage).toContainText('Wrong password');
await loginPage.takeScreenshot('Error-WrongPassword');
```

**Note**: DemoBlaze test cases don't include error scenarios, but this approach is ready for future negative test cases.

---

### 4. Text Content Verification

**Strategy**: Verify welcome messages, product names, prices, and other text content

#### Welcome Message Verification
```typescript
// Verify welcome message displays username
const welcomeText = await homePage.getText(homePage.locators.navbarWelcomeText);
await expect.soft(welcomeText).toContain('Welcome autouser_20251005_1234');
await homePage.takeScreenshot('Text-WelcomeMessage');
```

#### Product Name Verification
```typescript
// Verify cart contains specific product
await expect.soft(cartPage.locators.cartItemName).toContainText('Samsung galaxy s6');
await cartPage.takeScreenshot('Text-ProductName');
```

#### Price Verification
```typescript
// Verify product price matches expected value
const actualPrice = await cartPage.getPrice(productName);
await expect.soft(actualPrice).toBe(expectedPrice);
await cartPage.takeScreenshot('Text-ProductPrice');
```

**Examples in Test Cases**:
- **TC1**: Verify "Welcome autouser_20251005_1234" displayed
- **TC2**: Verify product names "Samsung galaxy s6" and "MacBook Pro" in cart
- **TC3**: Verify "Thank you for your purchase!" message

---

### 5. Cart Total Verification

**Strategy**: Calculate expected total from product prices and verify against displayed total

#### Total Calculation Verification
```typescript
// Get all product prices
const prices = await cartPage.getAllPrices();

// Calculate expected total
const expectedTotal = CartHelper.calculateTotal(prices);

// Get actual total from page
const actualTotal = await cartPage.getTotal();

// Verify totals match
await expect.soft(actualTotal).toBe(expectedTotal);
await cartPage.takeScreenshot('Cart-TotalVerified');
```

**Examples in Test Cases**:
- **TC2**: Verify total = Samsung galaxy s6 price + MacBook Pro price
- **TC4**: Verify total updated to only MacBook Air price after removing Sony xperia z5

---

### 6. Modal/Popup Verification

**Strategy**: Verify modal appearance, content, and button behavior using `expect.soft`

#### Modal Visibility
```typescript
// Verify modal is displayed
await expect.soft(loginPage.locators.loginModal).toBeVisible();
await loginPage.takeScreenshot('Modal-LoginVisible');
```

#### Modal Content Verification
```typescript
// Verify confirmation message in modal
await expect.soft(checkoutPage.locators.confirmationMessage).toContainText('Thank you for your purchase!');
await checkoutPage.takeScreenshot('Modal-ConfirmationMessage');
```

#### Modal Closure Verification
```typescript
// Verify modal is closed after action
await expect.soft(loginPage.locators.loginModal).toBeHidden();
await loginPage.takeScreenshot('Modal-LoginClosed');
```

#### Button Interaction in Modal
```typescript
// Click button in modal and verify navigation
await checkoutPage.click(checkoutPage.locators.confirmationOkButton);
await expect.soft(page).toHaveURL('https://www.demoblaze.com/index.html');
await checkoutPage.takeScreenshot('Modal-ClosedAfterOK');
```

**Examples in Test Cases**:
- **TC1**: Login modal opens, closes after successful login
- **TC3**: Checkout modal opens, confirmation modal displays after purchase
- **TC5**: Multiple modals in sequence (login → checkout → confirmation)

---

### 7. Alert Verification

**Strategy**: Setup dialog listener before actions that trigger alerts, verify alert message

#### Alert Handling and Verification
```typescript
// Setup listener to capture alert message
let alertMessage = '';
page.on('dialog', async (dialog) => {
  alertMessage = dialog.message();
  await dialog.accept();
});

// Trigger action that shows alert
await productPage.addToCart();

// Verify alert message (optional)
await expect.soft(alertMessage).toContain('Product added');
await productPage.takeScreenshot('Alert-ProductAdded');
```

**Examples in Test Cases**:
- **TC2**: Accept alerts after adding "Samsung galaxy s6" and "MacBook Pro"
- **TC5**: Accept alerts after adding "Sony vaio i5" and "Apple monitor 24"

---

### 8. Soft Assertions Usage

**Philosophy**: Use `expect.soft` for all verifications to ensure complete test execution and reporting

#### Benefits of Soft Assertions
1. **Complete reporting**: All failures captured, not just the first failure
2. **Better debugging**: See all verification issues in one test run
3. **Screenshot continuity**: Screenshots taken for all steps even after failures

#### Standard Pattern
```typescript
// All verifications use expect.soft
await expect.soft(element).toBeVisible();
await expect.soft(page).toHaveURL(expectedURL);
await expect.soft(text).toContain(expectedText);
await expect.soft(count).toBe(expectedCount);

// Screenshot after each soft assertion
await page.takeScreenshot('Step-Description');
```

#### When NOT to Use Soft Assertions
- **Critical preconditions**: If page navigation fails, hard assert to stop test early
  ```typescript
  await expect(page).toHaveURL(baseURL); // Hard assert for critical navigation
  ```

---

### Screenshot Strategy

**Requirement**: Screenshot after each verify step (per project requirements)

#### Naming Convention
```typescript
// Pattern: {TestCaseID}-{StepType}{StepNumber}-{Description}
await page.takeScreenshot('TC1-Step1-LoginModal');
await page.takeScreenshot('TC1-Verify2-WelcomeMessage');
await page.takeScreenshot('TC2-Step3-AddToCart');
```

#### Implementation in Page Objects
```typescript
// In CommonPage (already exists)
async takeScreenshot(name: string): Promise<void> {
  await Helper.takeScreenshot(this.page, name);
  const buffer = await this.page.screenshot();
  await test.info().attach(name, {
    body: buffer,
    contentType: 'image/png',
  });
}
```

#### Usage in Tests
```typescript
// After each action/verification
await loginPage.fillUsername(username);
await loginPage.takeScreenshot('TC1-Step2-UsernameEntered');

await expect.soft(homePage.locators.navbarLogoutButton).toBeVisible();
await homePage.takeScreenshot('TC1-Verify3-LogoutButtonVisible');
```

---

## 8. Special Considerations

### 1. Alert Handling

#### Challenge
DemoBlaze shows browser alerts after "Add to cart" actions (TC2, TC5). Playwright requires explicit handling of dialogs.

#### Solution
Setup dialog listener before actions that trigger alerts:

```typescript
// Setup alert listener to automatically accept alerts
page.on('dialog', async (dialog) => {
  console.log(`Alert message: ${dialog.message()}`);
  await dialog.accept();
});

// Now actions that trigger alerts will be automatically handled
await productPage.addToCart();
```

#### Best Practice
- Setup listener **once** at the beginning of the test or in beforeEach hook
- Log alert messages for debugging
- Use separate listener if alert dismissal is needed instead of acceptance

---

### 2. Timing and Synchronization

#### Challenge
Dynamic content loading, modal animations, and network requests require proper wait strategies.

#### Solutions

##### Wait for Element Visibility
```typescript
// Already implemented in CommonPage
await this.waitForVisible(locator);
await expect.soft(locator).toBeVisible();
```

##### Wait for Navigation
```typescript
// Wait for URL to match pattern
await page.waitForURL(/.*index\.html/);
```

##### Wait for Network Idle (if needed)
```typescript
await page.goto(url, { waitUntil: 'networkidle' });
```

##### Wait for Modal to Disappear
```typescript
await expect.soft(loginPage.locators.loginModal).toBeHidden();
```

#### Best Practice
- **Avoid hard waits** (`page.waitForTimeout()`) unless absolutely necessary
- Use Playwright's auto-waiting capabilities (click, fill automatically wait for actionability)
- Leverage `waitForLoadState()` for navigation events

---

### 3. Dynamic Content Handling

#### Challenge
Product prices on DemoBlaze are dynamic and may change.

#### Solution
Fetch prices during test execution instead of hardcoding:

```typescript
// Fetch price from product page
const productPrice = await productPage.getProductPrice();

// Use fetched price for verification
await cartPage.verifyProductPrice(productName, productPrice);
```

#### Cart Total Calculation
```typescript
// Get all prices from cart
const prices = await cartPage.getAllPrices();

// Calculate expected total
const expectedTotal = prices.reduce((sum, price) => sum + price, 0);

// Verify against displayed total
const actualTotal = await cartPage.getTotal();
await expect.soft(actualTotal).toBe(expectedTotal);
```

---

### 4. Environment-Specific Configuration

#### Browser Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config(); // Load .env file

export default defineConfig({
  testDir: './tests',
  
  // Run 4 tests in parallel (as required)
  workers: 4,
  
  // Full screen configuration
  use: {
    viewport: null, // null = full screen
    launchOptions: {
      args: ['--start-maximized'], // Start browser maximized
    },
    
    // Headed/headless mode from .env
    headless: process.env.HEADED_MODE === 'true',
    
    // Base URL
    baseURL: process.env.BASE_URL || 'https://www.demoblaze.com/',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Trace on failure
    trace: 'retain-on-failure',
  },
  
  // Browser projects
  projects: [
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
```

#### .env File Configuration
```bash
# Browser mode
HEADED_MODE=false

# Base URL
BASE_URL=https://www.demoblaze.com/

# Screenshot directory
SCREENSHOT_PATH=./test-results/screenshots
```

---

### 5. Error Handling Approach

#### Page Object Error Handling

```typescript
// In page object methods
async login(username: string, password: string): Promise<void> {
  try {
    await this.openLoginModal();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  } catch (error) {
    console.error('Login failed:', error);
    await this.takeScreenshot('Error-LoginFailed');
    throw error; // Re-throw to fail test
  }
}
```

#### Test-Level Error Handling

```typescript
test('TC1: Verify successful login', async ({ page }) => {
  try {
    // Test steps...
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'test-failure.png', fullPage: true });
    throw error;
  }
});
```

#### Graceful Failure with Soft Assertions

```typescript
// Continue test execution even if assertions fail
await expect.soft(element1).toBeVisible(); // Fails but continues
await expect.soft(element2).toBeVisible(); // Still executes
await expect.soft(element3).toBeVisible(); // Still executes

// All failures reported at end of test
```

---

### 6. Internationalization Considerations

#### Current State
DemoBlaze is in English, but project structure supports internationalization (Japanese text in common-locators.ts example).

#### Future-Proofing Strategy

```typescript
// constants/text-constants.ts
export const TEXT_CONSTANTS = {
  en: {
    loginButton: 'Log in',
    welcomeMessage: 'Welcome',
    thankYouMessage: 'Thank you for your purchase!',
  },
  ja: {
    loginButton: 'ログイン',
    welcomeMessage: 'ようこそ',
    thankYouMessage: 'ご購入ありがとうございます！',
  },
};

// Usage in tests
const lang = process.env.LANG || 'en';
const expectedText = TEXT_CONSTANTS[lang].welcomeMessage;
await expect.soft(welcomeText).toContain(expectedText);
```

---

### 7. Data-Driven Testing Preparation

#### Future Enhancement: Parameterized Tests

```typescript
// Example: Multiple user login scenarios
const testCases = [
  { username: 'user1', password: 'pass1', shouldSucceed: true },
  { username: 'user2', password: 'pass2', shouldSucceed: true },
  { username: 'invalid', password: 'wrong', shouldSucceed: false },
];

for (const testCase of testCases) {
  test(`Login with ${testCase.username}`, async ({ page }) => {
    // Test implementation
  });
}
```

---

## 9. Quality Assurance

### Peer Review Process

#### Code Review Checklist

**Page Objects Review**:
- [ ] Page object extends `CommonPage`
- [ ] Locators defined in separate file extending `CommonLocators`
- [ ] Methods use high-level business actions (not low-level clicks/fills)
- [ ] Methods use `@step` decorator for logging
- [ ] Methods call `takeScreenshot()` after verification steps
- [ ] No hardcoded waits (`waitForTimeout`) used
- [ ] Error handling implemented for critical actions

**Test Scripts Review**:
- [ ] Test description matches test case ID and description
- [ ] All expected results from test case are verified
- [ ] `expect.soft` used for all verifications
- [ ] Screenshot taken after each verification step
- [ ] Proper fixtures used for preconditions
- [ ] Alert handling setup before actions that trigger alerts
- [ ] Test data imported from centralized files (not hardcoded)

**Locators Review**:
- [ ] All locators use XPath selectors (REQUIRED - no CSS selectors allowed)
- [ ] Locator class extends `CommonLocators`
- [ ] `initializeLocators()` calls `super.initializeLocators()` first
- [ ] Placeholders updated with actual XPath expressions
- [ ] Dynamic locators use functions (e.g., `deleteButton(productName)`)
- [ ] All locators include `xpath=` prefix

#### Review Process Steps
1. **Self-Review**: Developer reviews own code against checklist
2. **Peer Review**: Another developer reviews PR with focus on:
   - Adherence to project structure
   - Code quality and maintainability
   - Test coverage completeness
3. **QA Review**: QA engineer validates:
   - Test scenarios match original test cases
   - All expected results verified
   - Screenshots captured correctly
4. **Approval**: Minimum 1 approval required before merge

---

### Validation Criteria for Completed Scripts

#### Test Execution Validation
- [ ] **Test passes on Edge**: Test runs successfully on Microsoft Edge browser
- [ ] **Test passes on Chrome**: Test runs successfully on Google Chrome browser
- [ ] **Parallel execution works**: Test runs correctly when executed with 4 workers
- [ ] **Screenshots captured**: All expected screenshots saved in test-results folder
- [ ] **Logs generated**: Step logs visible in test output with `@step` decorator

#### Test Coverage Validation
- [ ] **All steps implemented**: Every step from test case implemented in test script
- [ ] **All verifications implemented**: Every expected result verified with assertions
- [ ] **Soft assertions used**: All verifications use `expect.soft` for complete reporting
- [ ] **Screenshots after verifications**: Screenshot taken after each verification step

#### Code Quality Validation
- [ ] **No linting errors**: ESLint passes without errors
- [ ] **TypeScript compilation succeeds**: No TypeScript errors
- [ ] **No console errors**: No errors in browser console during test execution
- [ ] **Proper async/await**: All asynchronous operations properly awaited

#### Documentation Validation
- [ ] **Test case mapped**: Test script entry in test script mapping table
- [ ] **Comments added**: Complex logic explained with comments
- [ ] **README updated**: Test execution instructions in README if needed

---

### Documentation Requirements

#### Test Script Documentation

Each test file should include:

```typescript
/**
 * Test Suite: DemoBlaze Login Feature
 * Test Case ID: TC1
 * Description: Verify successful login with valid credentials
 * 
 * Pre-conditions:
 * - User account exists with username="autouser_20251005_1234"
 * 
 * Test Steps:
 * 1. Click [Log in] button
 * 2. Input Username
 * 3. Input Password
 * 4. Click [Log in] in modal
 * 
 * Expected Results:
 * 1. Modal closes, user stays on Home page
 * 2. Navbar shows text "Welcome autouser_20251005_1234"
 * 3. Display [Log out] button
 * 4. Hide [Log in] button
 * 
 * @author [Developer Name]
 * @date [Date Implemented]
 */
test('TC1: Verify successful login with valid credentials', async ({ page }) => {
  // Test implementation
});
```

#### Page Object Documentation

```typescript
/**
 * LoginPage
 * 
 * Handles all interactions with the login functionality on DemoBlaze.
 * 
 * Responsibilities:
 * - Opening and closing login modal
 * - Filling login credentials
 * - Submitting login form
 * - Verifying login success/failure
 * - Logging out
 * 
 * @extends CommonPage
 */
export class LoginPage extends CommonPage {
  // Implementation
}
```

#### README Updates

Add to project README.md:

```markdown
## Running DemoBlaze Tests

### Prerequisites
- Node.js v18+
- Playwright installed

### Configuration
Update `.env` file:
```bash
HEADED_MODE=false
BASE_URL=https://www.demoblaze.com/
TEST_ENV=stg               # Environment: stg, dev, or prod
```

### Test File Organization
Tests are organized by feature domain:
- `tests/DemoBlaze/auth.spec.ts` - Authentication tests (TC1)
- `tests/DemoBlaze/cart.spec.ts` - Cart management tests (TC2, TC4)
- `tests/DemoBlaze/checkout.spec.ts` - Checkout and E2E tests (TC3, TC5)

### Execution Commands
```bash
# Run all DemoBlaze tests
npx playwright test tests/DemoBlaze

# Run specific feature tests
npx playwright test tests/DemoBlaze/auth.spec.ts
npx playwright test tests/DemoBlaze/cart.spec.ts
npx playwright test tests/DemoBlaze/checkout.spec.ts

# Run specific test by name
npx playwright test -g "TC1"
npx playwright test -g "Add Multiple Items"

# Run with headed mode
HEADED_MODE=true npx playwright test tests/DemoBlaze

# Run on specific browser
npx playwright test tests/DemoBlaze --project="Microsoft Edge"
npx playwright test tests/DemoBlaze --project="Google Chrome"

# Run with 4 workers (parallel execution)
npx playwright test tests/DemoBlaze --workers=4
```

### Test Reports
```bash
# View HTML report
npx playwright show-report
```
```

---

### Maintenance Considerations

#### Locator Maintenance Strategy

**Problem**: Website changes break locators

**Solution**: Centralized locator management

1. **Use XPath selectors exclusively**: All locators MUST use XPath for consistency and reliability
2. **Locator abstraction**: All selectors in locator files, not in page objects
3. **Locator validation**: Add utility to validate locators exist on page
   ```typescript
   // utils/locator-validator.ts
   async validateLocators(page: Page, locators: CommonLocators): Promise<void> {
     // Check all locators are found on page
   }
   ```

#### Test Data Maintenance

**Problem**: Test data becomes stale (user accounts, product names)

**Solution**: Data validation before test execution

1. **Pre-test validation**: Verify test user exists before running login tests
2. **Dynamic product selection**: Select products dynamically rather than hardcoding names
3. **Data refresh process**: Document process for updating test data files

#### Test Suite Health Monitoring

**Metrics to track**:
- Test pass rate over time
- Flaky test identification (tests that fail intermittently)
- Test execution duration trends
- Screenshot storage size

**Monitoring Strategy**:
```typescript
// Add to playwright.config.ts
reporter: [
  ['html'],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
],
```

#### Refactoring Guidelines

**When to refactor**:
- Same code repeated in 3+ page objects → Create utility
- Locator changes affecting multiple tests → Update locator file
- Test structure inconsistent → Standardize based on this plan
- New feature requires existing page object changes → Extend, don't modify

**Refactoring checklist**:
- [ ] All affected tests still pass
- [ ] No breaking changes to existing page object APIs
- [ ] Documentation updated
- [ ] Peer review completed

---

## Conclusion

This comprehensive test plan provides a complete roadmap for implementing automated Playwright test scripts for the DemoBlaze e-commerce website. The plan ensures:

✅ **Logical Organization**: Tests grouped by feature domain (Auth, Cart, Checkout) in 3 balanced files  
✅ **Consistent Structure**: Page Object Model with centralized locators using XPath selectors  
✅ **Clear XPath Format**: All locators use XPath directly without `xpath=` prefix  
✅ **Quality**: Soft assertions, screenshots, and comprehensive verification  
✅ **Maintainability**: Programmatic setup with clear beforeEach hooks  
✅ **Scalability**: Clear patterns for data management and future expansion  
✅ **Documentation**: Guidelines focus on strategy, not verbose code examples  

### Key Improvements

1. **Balanced File Organization**: 3 files grouped by feature (auth, cart, checkout) - not too fragmented, not too long
2. **beforeEach Hook**: Shared setup within each feature group
3. **Programmatic Setup**: Authentication and cart setup visible within tests
4. **XPath Format**: Simplified locator format (no `xpath=` prefix needed)
5. **Plan-Focused Documentation**: Emphasizes strategy and patterns over complete code listings

### Test Organization Summary

| File | Test Cases | Purpose |
|------|-----------|---------|
| `auth.spec.ts` | TC1 | Authentication and login functionality |
| `cart.spec.ts` | TC2, TC4 | Cart operations (add, remove items) |
| `checkout.spec.ts` | TC3, TC5 | Checkout process and full E2E flow |

### Next Steps

1. **Implementation Phase**: Developers implement test scripts following this plan
2. **Review Phase**: Peer review using provided checklists
3. **Execution Phase**: Run tests on Edge and Chrome with 4 workers
4. **Validation Phase**: Verify all criteria met
5. **Maintenance Phase**: Monitor test health and refactor as needed

### Success Criteria

The implementation is considered complete when:
- All 5 test cases automated across 3 feature-grouped files
- beforeEach hooks properly handle shared setup in each file
- Tests run successfully on both Edge and Chrome browsers
- All screenshots captured after verification steps
- All locators use XPath format without `xpath=` prefix
- 4 workers run tests in parallel without issues
- Code passes peer review and QA validation
- Documentation complete and up-to-date

---

**Document Version**: 2.1  
**Last Updated**: October 22, 2025  
**Status**: Ready for Implementation  
**Changes**: 
- Reorganized into 3 feature-grouped files (auth, cart, checkout)
- Reduced verbose code examples - focus on plan and strategy
- Added beforeEach hook for shared setup within feature groups
- Simplified XPath locator format
- Removed unnecessary code listings - kept templates concise
