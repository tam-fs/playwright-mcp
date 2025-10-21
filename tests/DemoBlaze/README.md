# DemoBlaze Test Automation

Automated test scripts for DemoBlaze e-commerce website using Playwright and TypeScript.

## Project Structure

```
├── data/
│   └── stg/                          # Staging environment test data
│       ├── users.json                # Test user credentials
│       ├── products.json             # Product catalog
│       └── checkout-data.json        # Checkout form data
├── interfaces/
│   ├── user.interface.ts             # User data interface
│   ├── product.interface.ts          # Product data interface
│   └── checkout.interface.ts         # Checkout data interface
├── locators/
│   ├── common-locators.ts            # Base locators class
│   ├── login-locators.ts             # Login page locators
│   ├── home-locators.ts              # Home page locators
│   ├── product-locators.ts           # Product page locators
│   ├── cart-locators.ts              # Cart page locators
│   └── checkout-locators.ts          # Checkout page locators
├── pages/
│   ├── common-pages.ts               # Base page object class
│   ├── login-page.ts                 # Login page object
│   ├── home-page.ts                  # Home page object
│   ├── product-page.ts               # Product page object
│   ├── cart-page.ts                  # Cart page object
│   └── checkout-page.ts              # Checkout page object
└── tests/
    ├── base-test.ts                  # Fixture for page object injection
    └── DemoBlaze/
        ├── login.spec.ts             # TC1: Login functionality
        ├── addMultipleItems.spec.ts  # TC2: Add multiple items to cart
        └── placeOrder.spec.ts        # TC3: Place order with checkout
```

## Test Cases

### TC1 - Login Functionality
- **File**: `tests/DemoBlaze/login.spec.ts`
- **Description**: Verify successful login with valid credentials
- **Steps**:
  1. Open login modal
  2. Enter username and password
  3. Submit login form
  4. Verify welcome message, logout button visible, login button hidden

### TC2 - Add Multiple Items to Cart
- **File**: `tests/DemoBlaze/addMultipleItems.spec.ts`
- **Description**: Add multiple products from different categories to cart
- **Pre-condition**: User is logged in
- **Steps**:
  1. Select Phones category and add Samsung galaxy s6
  2. Navigate to Laptops category and add MacBook Pro
  3. Verify cart displays both items with correct total

### TC3 - Place Order
- **File**: `tests/DemoBlaze/placeOrder.spec.ts`
- **Description**: Complete checkout process with valid customer information
- **Pre-condition**: User is logged in with items in cart
- **Steps**:
  1. Navigate to cart and click Place Order
  2. Fill checkout form with customer information
  3. Submit order and verify confirmation
  4. Verify cart is cleared after successful purchase

### TC4 - Remove Item from Cart
- **File**: `tests/DemoBlaze/removeItem.spec.ts`
- **Description**: Remove single item from cart and verify cart updates correctly
- **Pre-condition**: User is logged in with 2 items in cart
- **Steps**:
  1. Add Sony xperia z5 and MacBook Air to cart
  2. Navigate to cart page
  3. Remove Sony xperia z5 from cart
  4. Verify only MacBook Air remains with correct total

### TC5 - Full Shopping Flow (Integration Test)
- **File**: `tests/DemoBlaze/fullShoppingFlow.spec.ts`
- **Description**: End-to-end test covering complete shopping journey
- **Steps**:
  1. Login with valid credentials
  2. Browse and add products from different categories (Sony vaio i5, Apple monitor 24)
  3. Navigate to cart and verify items
  4. Complete checkout process
  5. Verify order confirmation
  6. Verify cart cleared after purchase
  7. Logout successfully

## Setup

### Prerequisites
- Node.js v18+
- Playwright installed

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Run all DemoBlaze tests
```bash
npx playwright test tests/DemoBlaze
```

### Run specific test file
```bash
# Run login test (TC1)
npx playwright test tests/DemoBlaze/login.spec.ts

# Run add items test (TC2)
npx playwright test tests/DemoBlaze/addMultipleItems.spec.ts

# Run place order test (TC3)
npx playwright test tests/DemoBlaze/placeOrder.spec.ts

# Run remove item test (TC4)
npx playwright test tests/DemoBlaze/removeItem.spec.ts

# Run full shopping flow test (TC5)
npx playwright test tests/DemoBlaze/fullShoppingFlow.spec.ts
```

### Run with headed mode (see browser)
```bash
npx playwright test tests/DemoBlaze --headed
```

### Run on specific browser
```bash
npx playwright test tests/DemoBlaze --project="chromium"
npx playwright test tests/DemoBlaze --project="firefox"
npx playwright test tests/DemoBlaze --project="webkit"
```

### Run with debug mode
```bash
npx playwright test tests/DemoBlaze --debug
```

### Run tests in parallel
```bash
# Run with 4 workers (default configuration)
npx playwright test tests/DemoBlaze
```

## View Test Reports

```bash
# View HTML report
npx playwright show-report
```

## Key Features

### Page Object Model (POM)
- All page interactions are abstracted into page objects
- Reusable methods for common actions
- Centralized locator management using XPath selectors

### Fixture-Based Architecture
- `base-test.ts` provides page object fixtures
- Automatic page object initialization
- Clean test code with injected dependencies

### Screenshot Capture
- Screenshots taken after each verification step
- Naming convention: `TC{id}-{StepType}{Number}-{Description}`
- Attached to test reports for debugging

### Data-Driven Testing
- Test data stored in JSON files under `data/stg/`
- Separate data files for users, products, and checkout information
- Easy to update test data without modifying code

### Soft Assertions
- All verifications use `expect.soft()` for complete test execution
- All failures reported at end of test
- Better debugging with comprehensive failure reports

### Alert Handling
- Automatic alert acceptance for "Add to cart" actions
- Dialog listeners set up before triggering actions

## Test User Credentials

The test account is pre-configured in `data/stg/users.json`:
- **Username**: `autouser_20251005_1234`
- **Password**: `autouser_20251005_1234`

**Note**: This user account must exist on the DemoBlaze website before running tests.

## Troubleshooting

### Tests fail with "Cannot find module" errors
Run TypeScript compilation:
```bash
npx tsc --noEmit
```

### Browsers not installed
Install Playwright browsers:
```bash
npx playwright install
```

### Tests timeout or fail intermittently
Increase timeout in `playwright.config.ts` or run with retries:
```bash
npx playwright test tests/DemoBlaze --retries=2
```

### Screenshots not captured
Check that `test-results/` directory exists and has write permissions.

## Contributing

When adding new test cases:
1. Create locator class extending `CommonLocators` in `locators/` folder
2. Create page object extending `CommonPage` in `pages/` folder
3. Update `base-test.ts` fixture to include new page object
4. Create test file in `tests/DemoBlaze/` folder
5. Import page objects from fixtures, not directly
6. Follow naming conventions for screenshots
7. Use `expect.soft()` for all assertions

## Architecture Principles

1. **Separation of Concerns**: Locators, page objects, and tests are separate
2. **Reusability**: Common utilities in `common-pages.ts` and `utils/`
3. **Maintainability**: XPath locators centralized in locator classes
4. **Readability**: Business-level methods in page objects, not low-level actions
5. **Testability**: Fixtures provide clean test setup and teardown

## License

This project is for testing and educational purposes.
