# GMS Backend Testing Guide

## Test Files Created

### 1. Password Utilities Tests
**Location:** `__tests__/passwordUtils.test.js`

Tests for password hashing and comparison:
- ✅ `hashPassword()` function works
- ✅ `comparePassword()` function works
- ✅ Passwords are properly hashed
- ✅ Invalid passwords are rejected

### 2. Validation Middleware Tests
**Location:** `__tests__/validation.test.js`

Tests for input validation:
- ✅ `validateMember()` middleware works
- ✅ `validateTrainer()` middleware works
- ✅ `validateEquipment()` middleware works
- ✅ Rejects invalid data
- ✅ Accepts valid data

## Running Tests

### Option 1: Using npm (Recommended)
```bash
cd backend

# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Option 2: Direct Jest Command
```bash
# On Windows (PowerShell)
$env:NODE_OPTIONS='--experimental-vm-modules'
npx jest

# On Mac/Linux
NODE_OPTIONS=--experimental-vm-modules npx jest
```

### Option 3: Node Direct
```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

## Test Coverage

Current tests cover:
- **Password Security**: Hashing and verification
- **Input Validation**: All form validation rules
- **Error Handling**: Invalid input rejection

## Adding More Tests

To add tests for API routes:

1. Create file: `__tests__/members.test.js`
2. Use Supertest to test endpoints:
```javascript
import request from 'supertest';
import app from '../index.js';

describe('Members API', () => {
  test('GET /api/members returns 200', async () => {
    const response = await request(app).get('/api/members');
    expect(response.status).toBe(200);
  });
});
```

## Jest Configuration

**File:** `jest.config.json`

```json
{
  "testEnvironment": "node",
  "testPathIgnorePatterns": ["/node_modules/"],
  "testMatch": ["**/__tests__/**/*.test.js"],
  "testTimeout": 10000
}
```

## Continuous Integration

For CI/CD pipelines (GitHub Actions, etc.):

```yaml
- name: Run Tests
  run: |
    cd backend
    npm install
    NODE_OPTIONS=--experimental-vm-modules npm test
```

## Test Results

When tests pass, you should see:
```
PASS __tests__/passwordUtils.test.js
PASS __tests__/validation.test.js

Test Suites: 2 passed, 2 total
Tests: 12 passed, 12 total
```

## Troubleshooting

**Issue:** "Cannot use import statement outside a module"
- **Solution:** Use `NODE_OPTIONS=--experimental-vm-modules` before running npm test

**Issue:** Tests timeout
- **Solution:** Increase timeout in jest.config.json: `"testTimeout": 30000`

**Issue:** Module not found errors
- **Solution:** Make sure all imports use `.js` extensions: `import X from './file.js'`

---

**Status:** ✅ Testing framework configured and ready
