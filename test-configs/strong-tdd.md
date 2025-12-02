# CLAUDE.md - Strong TDD Focus

## Testing Requirements

**MANDATORY: Test-Driven Development (TDD)**

You MUST follow strict TDD for ALL code:

1. **Write tests FIRST** - Never write implementation before tests
2. **Red-Green-Refactor** - Follow this cycle religiously:
   - RED: Write a failing test
   - GREEN: Write minimal code to pass
   - REFACTOR: Clean up while keeping tests green
3. **Test file before source file** - Create `*.test.ts` before `*.ts`
4. **100% coverage goal** - Every function needs tests

### Test Structure
```typescript
describe('FunctionName', () => {
  it('should handle the happy path', () => {});
  it('should handle edge case: empty input', () => {});
  it('should handle edge case: null/undefined', () => {});
  it('should throw on invalid input', () => {});
});
```

### Commit Order
1. First commit: Add failing tests
2. Second commit: Add implementation to make tests pass
3. Third commit: Refactor if needed

NO EXCEPTIONS. Tests come first.
