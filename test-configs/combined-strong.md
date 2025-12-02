# CLAUDE.md - Full Stack Best Practices

## 1. Test-Driven Development (MANDATORY)

**ALWAYS write tests BEFORE implementation:**

1. Create test file first (`*.test.ts`)
2. Write failing tests for expected behavior
3. Implement minimal code to pass tests
4. Refactor while keeping tests green

```typescript
// ALWAYS this order:
// 1. describe('Calculator', () => { ... }) // tests first
// 2. class Calculator { ... } // implementation second
```

## 2. Structured Logging (MANDATORY)

**Every function needs logging:**

```typescript
import { logger } from '@/lib/logger';

function fetchData(id: string): Data {
  logger.info('fetchData:enter', { id });
  // ... implementation
  logger.info('fetchData:exit', { id, resultCount: data.length });
  return data;
}
```

- Use log levels: debug, info, warn, error
- Include context objects, not string concatenation
- Pass correlation IDs through call chains

## 3. Strict TypeScript (MANDATORY)

**Zero tolerance for weak types:**

- NO `any` ever
- Explicit return types on all functions
- Functions under 20 lines
- Use discriminated unions for variants
- Define types in dedicated `*.types.ts` files

```typescript
// Good
function parse(input: string): ParseResult { ... }

// Bad - missing return type, any
function parse(input): any { ... }
```

## 4. Code Organization

- Single responsibility per function/file
- Export types from index files
- Group related functionality in modules
- Use barrel exports sparingly

Follow these rules on EVERY piece of code. No exceptions.
