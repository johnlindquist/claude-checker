# CLAUDE.md - Observability Focus

## Logging Requirements

**MANDATORY: Comprehensive Structured Logging**

Every function MUST have proper logging:

### Required Log Points
1. **Function entry** - Log when entering significant functions
2. **Function exit** - Log return values (sanitized)
3. **Error conditions** - Full context on errors
4. **State changes** - Log before/after for mutations

### Log Format (Structured JSON)
```typescript
import { logger } from './logger';

function processUser(userId: string): User {
  logger.info('processUser:enter', { userId });

  try {
    const user = fetchUser(userId);
    logger.info('processUser:success', { userId, userName: user.name });
    return user;
  } catch (error) {
    logger.error('processUser:error', {
      userId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
```

### Log Levels
- `debug` - Detailed debugging info
- `info` - Normal operations
- `warn` - Potential issues
- `error` - Failures with stack traces

### Correlation
Pass `requestId` or `correlationId` through all functions for tracing.

NEVER use `console.log` directly. Always use structured logger.
