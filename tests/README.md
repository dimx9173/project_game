# Game Platform V6 - Test Suite

## Overview

This test suite covers the game platform V6 standard edition, ensuring core functionality works correctly.

## Test Structure

```
tests/
├── unit/           # Unit tests
│   ├── auth.test.ts         # Authentication logic
│   └── transaction.test.ts  # Transaction logic (開分/洗分)
├── integration/    # Integration tests
│   └── api.test.ts          # API endpoint tests
└── e2e/           # E2E tests
    └── flow.test.ts         # Business flow tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

### Unit Tests
- **Auth**: Login, token generation, role authorization
- **Transaction**: Credit in (開分), credit out (洗分), bet, win settlement

### Integration Tests
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- GET /api/v1/machines
- GET /api/v1/machines/:id
- GET /api/v1/players
- GET /api/v1/players/:id
- GET /api/v1/transactions
- POST /api/v1/transactions

### E2E Tests
- PIN authentication flow
- Credit in (開分) flow
- Credit out (洗分) flow
- Complete game session flow
- Error handling flows

## Test Results

```
Test Files: 4 passed
Tests: 40 passed
```

## Tech Stack

- **Framework**: Vitest
- **HTTP Testing**: Supertest
- **Coverage**: @vitest/coverage-v8
