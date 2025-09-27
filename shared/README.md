# Shared Types

This folder contains all the shared TypeScript types used across the Saasan project (backend, dashboard, and mobile app).

## Structure

- `types/index.ts` - Main entry point with all types and enums
- `types/polling.ts` - Poll-related types and interfaces
- `types/reports.ts` - Report and corruption-related types
- `types/user.ts` - User and authentication types
- `types/politician.ts` - Politician and geographic hierarchy types
- `types/common.ts` - Common types like API responses, dashboard stats, etc.

## Usage

Import types from the shared folder:

```typescript
// Import specific types
import { User, UserRole } from "../../../shared/types/user";
import { Poll, PollStatus } from "../../../shared/types/polling";
import { CorruptionReport } from "../../../shared/types/reports";

// Or import from the main index
import { User, Poll, CorruptionReport } from "../../../shared/types";
```

## Migration

All type files have been consolidated from:

- `saasan-node-be/src/types/`
- `saasan-dashboard-react/src/types/`
- `saasan-mobile-rn/types/`

This ensures type consistency across all parts of the application.
