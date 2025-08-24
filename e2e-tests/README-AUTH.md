# E2E Tests Authentication Setup

## Overview

This project implements a professional authentication setup for e2e tests that logs in once and reuses the session state across all tests. This approach significantly improves test performance and reliability.

## How It Works

### Global Authentication Setup

1. **Global Setup File (`global-setup.ts`)**
   - Runs once before all tests
   - Performs login with default user credentials
   - Saves authentication state to `auth-state.json`
   - This file is automatically excluded from version control

2. **Playwright Configuration**
   - Configured to use the global setup
   - All tests automatically use the saved authentication state
   - No need for individual login in each test

3. **Auth Helper Utility (`utils/auth-helper.ts`)**
   - Provides convenient methods for authenticated operations
   - Handles authentication verification
   - Manages dataset selection for file operations

## Usage Examples

### Basic Authenticated Test

```typescript
import { test, expect } from '@playwright/test';
import { AuthHelper } from '../utils/auth-helper';
import { SomePage } from '../pages/SomePage';

test.beforeEach(async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.ensureAuthenticated();
});

test('should perform authenticated operation', async ({ page }) => {
    // Test code here - user is already authenticated
});
```

### Test Requiring Dataset Access

```typescript
import { test, expect } from '@playwright/test';
import { AuthHelper } from '../utils/auth-helper';
import { FilesPage } from '../pages/FilesPage';

test.beforeEach(async ({ page }) => {
    const authHelper = new AuthHelper(page);
    await authHelper.ensureAuthenticatedWithDataset();
});

test('should perform file operations', async ({ page }) => {
    const filesPage = new FilesPage(page);
    // User is authenticated and has dataset access
});
```

### Updated files.spec.ts Pattern

The `files.spec.ts` now follows the new pattern:

```typescript
import { expect, test } from '@playwright/test';
import { FilesPage } from '../pages/FilesPage';
import { AuthHelper } from '../utils/auth-helper';

let filesPage: FilesPage;
let authHelper: AuthHelper;

test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    filesPage = new FilesPage(page);
    
    // Single call that ensures authentication and dataset access
    await authHelper.ensureAuthenticatedWithDataset();
});
```

## Benefits

1. **Performance**: Login happens only once, not before each test
2. **Reliability**: Reduces flakiness from repeated authentication
3. **Maintainability**: Central authentication logic
4. **Flexibility**: Easy to switch between different user types
5. **Professional**: Industry-standard approach used by major testing frameworks

## Alternative Approaches

### Project-Level Authentication

For more complex scenarios, you can use project-level authentication setup instead of global setup. See `playwright-project-auth.example.ts` for configuration example.

### Different User Types

To test with different user types, create additional setup files:

```typescript
// auth-admin.setup.ts
setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loggedInAsUser({
    email: 'admin@example.com',
    password: 'admin@example.com'
  });
  await page.context().storageState({ path: 'auth-admin-state.json' });
});
```

## Troubleshooting

### Authentication State Expired

If you see errors about authentication state expiring:
1. Delete `auth-state.json`
2. Run tests again - global setup will recreate the auth state

### Tests Failing After User Changes

If user credentials or authentication flow changes:
1. Update the `LoginPage.loggedInAsDefaultUser()` method
2. Update the global setup accordingly
3. Delete `auth-state.json` to force recreation

## Files Structure

```
e2e-tests/
├── global-setup.ts          # Global authentication setup
├── auth.setup.ts            # Alternative project-level setup
├── auth-state.json          # Generated auth state (gitignored)
├── utils/
│   └── auth-helper.ts       # Authentication utility
├── tests/
│   └── files.spec.ts        # Example using new pattern
└── README-AUTH.md           # This documentation
```

## Migration Guide

To migrate existing tests to use the new authentication pattern:

1. Remove `await new LoginPage(page).loggedInAsDefaultUser();` from `beforeEach`
2. Add `AuthHelper` import and initialization
3. Use `authHelper.ensureAuthenticated()` or `authHelper.ensureAuthenticatedWithDataset()`
4. Tests will now run faster with shared authentication state