# DemoBlaze Test Automation

Automated test suite for DemoBlaze e-commerce website using Playwright with TypeScript.

## Test Coverage

This project contains automated tests for the DemoBlaze website (https://www.demoblaze.com/) covering:

- **Authentication**: Login and logout functionality
- **Cart Management**: Adding multiple products, removing items
- **Checkout Process**: Complete purchase flow with order confirmation
- **End-to-End Flow**: Full shopping journey from login to logout

## Test Cases

### TC1 - Login Functionality
**Location**: `tests/DemoBlaze/auth.spec.ts`
- Verifies successful login with valid credentials
- Validates welcome message display
- Confirms logout button visibility

### TC2 - Add Multiple Products to Cart
**Location**: `tests/DemoBlaze/cart.spec.ts`
- Adds products from different categories (Phones, Laptops)
- Verifies cart displays all items
- Validates cart total calculation

### TC3 - Checkout Functionality
**Location**: `tests/DemoBlaze/checkout.spec.ts`
- Places an order with valid customer information
- Verifies order confirmation message
- Validates order ID and amount

### TC4 - Remove Item from Cart
**Location**: `tests/DemoBlaze/cart.spec.ts`
- Removes a single item from cart
- Verifies remaining item and updated total

### TC5 - Full Shopping Flow (E2E)
**Location**: `tests/DemoBlaze/checkout.spec.ts`
- Complete flow: login → browse → add to cart → checkout → logout
- Tests multiple categories (Laptops, Monitors)
- Validates entire purchase process

## Project Structure

```
mcp/
├── data/
│   └── stg/                      # Test data for staging environment
│       ├── users.json            # User credentials
│       ├── products.json         # Product catalog
│       └── checkout-data.json    # Checkout information
├── interfaces/
│   ├── user.interface.ts
│   ├── product.interface.ts
│   └── checkout.interface.ts
├── locators/
│   ├── common-locators.ts        # Base locator class
│   ├── login-locators.ts
│   ├── home-locators.ts
│   ├── product-locators.ts
│   ├── cart-locators.ts
│   └── checkout-locators.ts
├── pages/
│   ├── common-pages.ts           # Base page class
│   ├── login-page.ts
│   ├── home-page.ts
│   ├── product-page.ts
│   ├── cart-page.ts
│   └── checkout-page.ts
├── tests/
│   ├── base-test.ts              # Test fixtures
│   └── DemoBlaze/
│       ├── auth.spec.ts          # TC1: Authentication tests
│       ├── cart.spec.ts          # TC2, TC4: Cart management tests
│       └── checkout.spec.ts      # TC3, TC5: Checkout and E2E tests
├── utils/
│   ├── helper.ts                 # Utility functions
│   ├── logging.ts                # Logging decorator
│   └── test-data-loader.ts       # Test data loading utility
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```bash
# Test environment (determines which data folder to use)
TEST_ENV=stg                      # Options: stg, dev, prod

# Browser configuration
HEADED_MODE=false                 # Set to true for headed mode
BROWSER=chromium                  # Options: chromium, firefox, webkit

# Application URL
BASE_URL=https://www.demoblaze.com/

# Screenshot path
SCREENSHOT_PATH=./test-results/screenshots
```

### Test Data

Test data is organized by environment in the `data/` folder:

- `data/stg/` - Staging environment (default)
- `data/dev/` - Development environment
- `data/prod/` - Production environment

Each environment folder contains:
- `users.json` - Test user credentials
- `products.json` - Product catalog
- `checkout-data.json` - Sample checkout information

## Running Tests

### Run All DemoBlaze Tests
```bash
npx playwright test tests/DemoBlaze
```

### Run Specific Test Files
```bash
# Authentication tests (TC1)
npx playwright test tests/DemoBlaze/auth.spec.ts

# Cart management tests (TC2, TC4)
npx playwright test tests/DemoBlaze/cart.spec.ts

# Checkout and E2E tests (TC3, TC5)
npx playwright test tests/DemoBlaze/checkout.spec.ts
```

### Run Specific Test by Name
```bash
# Run by test case ID
npx playwright test -g "TC1"
npx playwright test -g "TC2"

# Run by description keyword
npx playwright test -g "Login functionality"
npx playwright test -g "Add Multiple Items"
```

### Run with Different Browsers
```bash
# Microsoft Edge
npx playwright test tests/DemoBlaze --project="Microsoft Edge"

# Google Chrome
npx playwright test tests/DemoBlaze --project="Google Chrome"

# Chromium
npx playwright test tests/DemoBlaze --project="chromium"
```

### Run in Headed Mode
```bash
npx playwright test tests/DemoBlaze --headed
```

### Run with Different Environments
```bash
# Run against staging (default)
npx playwright test tests/DemoBlaze

# Run against development
TEST_ENV=dev npx playwright test tests/DemoBlaze

# Run against production
TEST_ENV=prod npx playwright test tests/DemoBlaze
```

### Run with Parallel Workers
```bash
# Run with 4 workers (default in config)
npx playwright test tests/DemoBlaze --workers=4

# Run with specific number of workers
npx playwright test tests/DemoBlaze --workers=2
```

### Debug Mode
```bash
# Run in debug mode with Playwright Inspector
npx playwright test tests/DemoBlaze --debug

# Debug specific test
npx playwright test tests/DemoBlaze/auth.spec.ts --debug
```

## Test Reports

### View HTML Report
After test execution, view the HTML report:
```bash
npx playwright show-report
```

The report includes:
- Test execution results
- Screenshots for each step
- Error logs and stack traces
- Execution time and status

### Screenshots
Screenshots are automatically captured after each verification step and saved to:
```
test-results/screenshots/
```

Screenshot naming convention:
```
{TestCaseID}-{StepType}{StepNumber}-{Description}.png

Examples:
- TC1-Step1-LoginModalOpened.png
- TC2-Verify1-CartItemCount.png
- TC3-Step3-PurchaseClicked.png
```

### Videos (if enabled)
Test execution videos are saved to:
```
videos/
```

## Test Execution Strategy

### Test Organization
Tests are organized by feature domain:
- **auth.spec.ts**: Authentication and login tests
- **cart.spec.ts**: Cart management operations
- **checkout.spec.ts**: Checkout process and end-to-end flows

### Preconditions
- **TC1**: No preconditions (clean browser state)
- **TC2, TC4**: Requires user login (handled in beforeEach)
- **TC3**: Requires user login + product in cart (handled in test)
- **TC5**: Complete flow from clean state

### Test Isolation
- Each test starts with a clean browser context (no cookies/storage)
- Tests can run in parallel without interfering with each other
- Fixtures ensure proper page object initialization

## Page Object Model (POM)

### Architecture
All page objects follow a consistent pattern:
- Extend `CommonPage` base class
- Use locator classes that extend `CommonLocators`
- All locators use XPath selectors
- Methods use `@step` decorator for logging
- Screenshots captured after each verification

### Key Classes

#### LoginPage
- `login(username, password)` - Complete login flow
- `verifyLoginSuccess(username)` - Verify successful login
- `logout()` - Logout user

#### HomePage
- `selectCategory(category)` - Select product category
- `selectProduct(productName)` - Select specific product
- `goToCart()` - Navigate to cart page

#### ProductPage
- `addToCart()` - Add product to cart (handles alerts)
- `getProductPrice()` - Get current product price
- `navigateHome()` - Return to home page

#### CartPage
- `getCartItems()` - Get all items in cart
- `verifyCartItemCount(count)` - Verify number of items
- `removeItem(productName)` - Remove specific item
- `clickPlaceOrder()` - Proceed to checkout

#### CheckoutPage
- `fillCheckoutForm(data)` - Fill checkout information
- `completePurchase(data)` - Complete full purchase flow
- `verifyOrderConfirmation()` - Verify success message

## Utilities

### TestDataLoader
Loads test data from JSON files based on environment:
```typescript
const users = TestDataLoader.loadUsers();
const testUser = TestDataLoader.getUser(0);
const products = TestDataLoader.getProductsByCategory('Phones');
const checkoutData = TestDataLoader.getCheckoutData(0);
```

### Helper
Common utility functions:
- Screenshot capture
- Wait for elements
- Alert handling

### Logging
`@step` decorator for automatic test step logging

## Maintenance

### Updating Test Data
1. Navigate to appropriate environment folder (e.g., `data/stg/`)
2. Edit JSON files:
   - `users.json` - Update credentials
   - `products.json` - Update product names/categories
   - `checkout-data.json` - Update customer information
3. Re-run tests

### Updating Locators
If website structure changes:
1. Update locator definitions in `locators/` folder
2. All locators use XPath selectors
3. Run tests to verify changes

### Adding New Tests
1. Create new test file in `tests/DemoBlaze/`
2. Import fixtures from `base-test.ts`
3. Use existing page objects and utilities
4. Follow naming convention: `TC{number} - {Feature} - {Scenario}`

## Troubleshooting

### Tests Failing
1. **Check test user exists**: Verify user in `data/stg/users.json` is registered on DemoBlaze
2. **Product names match**: Ensure product names in test data match website exactly
3. **Network issues**: Check internet connection and website availability
4. **Timing issues**: Adjust wait times if needed (increase timeouts in page objects)

### Screenshots Not Captured
- Verify `SCREENSHOT_PATH` environment variable is set
- Check disk space availability
- Ensure `test-results/` directory exists

### Parallel Execution Issues
- Reduce number of workers: `--workers=2`
- Check if tests share state (they shouldn't)
- Review test isolation in `base-test.ts`

## CI/CD Integration

### GitHub Actions Example
```yaml
name: DemoBlaze Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test tests/DemoBlaze
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Contributing

1. Follow existing code structure and naming conventions
2. Use XPath selectors for all locators
3. Add `@step` decorator to page object methods
4. Capture screenshots after each verification
5. Update documentation for new tests

## Support

For issues or questions:
1. Check troubleshooting section
2. Review test execution logs
3. Examine screenshots in `test-results/`
4. Check browser console errors

## License

This project is for educational and testing purposes.

## Test User Credentials

Default test user (from `data/stg/users.json`):
- Username: `autouser_20251005_1234`
- Password: `autouser_20251005_1234`

**Note**: Ensure this user is registered on DemoBlaze before running tests.
