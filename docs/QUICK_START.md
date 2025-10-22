# Quick Start Guide - DemoBlaze Tests

## Prerequisites
```bash
# Ensure Node.js v18+ is installed
node --version

# Install dependencies (if not done)
npm install

# Install Playwright browsers
npx playwright install
```

## Run All DemoBlaze Tests
```bash
# Run all 5 test cases (TC1-TC5)
npx playwright test tests/DemoBlaze

# Run with UI mode (interactive)
npx playwright test tests/DemoBlaze --ui

# Run in headed mode (see browser)
npx playwright test tests/DemoBlaze --headed
```

## Run Specific Tests

### By File
```bash
# TC1: Login functionality
npx playwright test tests/DemoBlaze/auth.spec.ts

# TC2, TC4: Cart management
npx playwright test tests/DemoBlaze/cart.spec.ts

# TC3, TC5: Checkout and E2E
npx playwright test tests/DemoBlaze/checkout.spec.ts
```

### By Test Case ID
```bash
npx playwright test -g "TC1"
npx playwright test -g "TC2"
npx playwright test -g "TC3"
npx playwright test -g "TC4"
npx playwright test -g "TC5"
```

### By Description
```bash
npx playwright test -g "Login functionality"
npx playwright test -g "Add multiple products"
npx playwright test -g "Checkout functionality"
npx playwright test -g "Remove item"
npx playwright test -g "Full shopping flow"
```

## Run on Specific Browsers

```bash
# Chromium
npx playwright test tests/DemoBlaze --project=chromium

# Microsoft Edge
npx playwright test tests/DemoBlaze --project="Microsoft Edge"

# Google Chrome
npx playwright test tests/DemoBlaze --project="Google Chrome"

# All browsers
npx playwright test tests/DemoBlaze
```

## Parallel Execution

```bash
# Run with 4 workers (default)
npx playwright test tests/DemoBlaze --workers=4

# Run with 2 workers
npx playwright test tests/DemoBlaze --workers=2

# Run sequentially (1 worker)
npx playwright test tests/DemoBlaze --workers=1
```

## Debug Mode

```bash
# Debug with Playwright Inspector
npx playwright test tests/DemoBlaze --debug

# Debug specific test
npx playwright test tests/DemoBlaze/auth.spec.ts --debug

# Debug from specific line
npx playwright test tests/DemoBlaze/auth.spec.ts:13 --debug
```

## View Reports

```bash
# View last test report
npx playwright show-report

# View specific report
npx playwright show-report playwright-report/
```

## Test Results

### Screenshots Location
```
test-results/screenshots/
```

### Videos Location (if enabled)
```
videos/
```

### HTML Report Location
```
playwright-report/index.html
```

## Environment Configuration

### Use Different Environment
```bash
# Staging (default)
npx playwright test tests/DemoBlaze

# Development
TEST_ENV=dev npx playwright test tests/DemoBlaze

# Production
TEST_ENV=prod npx playwright test tests/DemoBlaze
```

## Common Commands

```bash
# Clean test results
rm -rf test-results playwright-report videos

# Run and open report automatically
npx playwright test tests/DemoBlaze && npx playwright show-report

# Run with retries
npx playwright test tests/DemoBlaze --retries=2

# Run with timeout
npx playwright test tests/DemoBlaze --timeout=60000

# Run with specific reporter
npx playwright test tests/DemoBlaze --reporter=list
npx playwright test tests/DemoBlaze --reporter=dot
npx playwright test tests/DemoBlaze --reporter=json
```

## Test Status

| Test Case | File | Status |
|-----------|------|--------|
| TC1 - Login | auth.spec.ts | ✅ Implemented & Verified |
| TC2 - Add Multiple Items | cart.spec.ts | ✅ Implemented |
| TC3 - Checkout | checkout.spec.ts | ✅ Implemented |
| TC4 - Remove Item | cart.spec.ts | ✅ Implemented |
| TC5 - Full Shopping Flow | checkout.spec.ts | ✅ Implemented |

## Troubleshooting

### Tests are slow
```bash
# Reduce workers
npx playwright test tests/DemoBlaze --workers=2

# Run specific browser only
npx playwright test tests/DemoBlaze --project=chromium
```

### Tests failing
```bash
# Run with more debug info
DEBUG=pw:api npx playwright test tests/DemoBlaze

# Run in headed mode to see what's happening
npx playwright test tests/DemoBlaze --headed

# Check screenshots in test-results/screenshots/
```

### Browser installation issues
```bash
# Reinstall browsers
npx playwright install --force

# Install with system dependencies
npx playwright install --with-deps
```

## Next Steps

1. ✅ Run all tests: `npx playwright test tests/DemoBlaze`
2. ✅ View report: `npx playwright show-report`
3. ✅ Check screenshots in `test-results/screenshots/`
4. ✅ Review test results and logs

## Support

For detailed documentation, see:
- `README.md` - Full project documentation
- `docs/plan_demoblaze.md` - Test plan
- `docs/IMPLEMENTATION_SUMMARY.md` - Implementation details

---

**Ready to Run**: ✅ YES
**Test Coverage**: 5 Test Cases (TC1-TC5)
**Browsers**: Chromium, Microsoft Edge, Google Chrome
