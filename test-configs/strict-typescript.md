# CLAUDE.md - Strict TypeScript

## TypeScript Requirements

**MANDATORY: Zero `any`, Maximum Type Safety**

### Forbidden Patterns
- `any` type - NEVER use, no exceptions
- `as` type assertions without justification
- `@ts-ignore` or `@ts-expect-error` without comment
- Implicit `any` from missing types
- `object` type (use specific interfaces)

### Required Patterns
```typescript
// Explicit return types on ALL functions
function getUser(id: string): User { ... }

// Generic constraints
function process<T extends BaseEntity>(item: T): ProcessedResult<T> { ... }

// Discriminated unions for variants
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

// Branded types for IDs
type UserId = string & { readonly __brand: 'UserId' };
```

### Function Guidelines
- Maximum 20 lines per function
- Single responsibility
- Explicit parameter and return types
- No default `any[]` - always `T[]` with specific type

### Type Organization
- Types in `types.ts` or `*.types.ts` files
- Export all public types
- Document complex types with JSDoc

If you must use `any`, explain why in a comment (but try harder not to).
