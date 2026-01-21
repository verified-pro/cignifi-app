# Project Structure - Cignifi App

## Overview

The Cignifi app follows a **clean architecture pattern** with a clear separation between infrastructure (framework) and presentation (pages).

## Directory Structure

```
cignifi-app/
├── src/
│   ├── App.tsx                 # Main router component
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles
│   ├── App.css                 # App component styles
│   │
│   ├── framework/              # ⭐ All infrastructure code
│   │   ├── services/           # API service layer (6 files)
│   │   │   ├── apiClient.ts    # Base HTTP client with auth
│   │   │   ├── authService.ts  # Auth endpoints
│   │   │   ├── productService.ts
│   │   │   ├── policyService.ts
│   │   │   ├── agentService.ts
│   │   │   └── claimService.ts
│   │   │
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts        # 40+ interfaces
│   │   │
│   │   ├── constants/          # Configuration & constants
│   │   │   └── index.ts        # API endpoints, status codes, rates
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   └── index.ts        # Formatters, validators, helpers
│   │   │
│   │   ├── components/         # Reusable UI components
│   │   │   └── SocialAuthButtons.tsx
│   │   │
│   │   ├── styles/             # Global CSS files
│   │   │   ├── auth_pages.css
│   │   │   ├── global.css
│   │   │   └── social_auth_buttons.css
│   │   │
│   │   ├── theme/              # Ionic theme configuration
│   │   │   └── variables.css
│   │   │
│   │   ├── hooks/              # Custom React hooks (reserved)
│   │   │
│   │   └── context/            # React context providers (reserved)
│   │
│   ├── pages/                  # ⭐ Page components only
│   │   ├── Welcome.tsx         # Landing page
│   │   ├── Onboarding.tsx      # Phone verification & personal info
│   │   ├── ProductSelection.tsx # Product tier selection
│   │   ├── Underwriting.tsx    # Health questions
│   │   ├── Payment.tsx         # Payment setup
│   │   ├── Dashboard.tsx       # User dashboard
│   │   ├── AgentPortal.tsx     # Agent commission tracking
│   │   ├── NewClaim.tsx        # Claims workflow
│   │   ├── Login.tsx           # Authentication
│   │   └── Signup.tsx          # Registration
│   │
│   └── assets/                 # Static assets
│       └── react.svg
│
├── index.html                  # HTML entry point
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies
├── pnpm-lock.yaml              # Lock file
│
└── Documentation files
    ├── README.md               # Project overview
    ├── QUICKSTART.md          # Get started in 3 steps
    ├── ARCHITECTURE.md        # System architecture
    ├── DEVELOPMENT_GUIDE.md   # Developer reference
    ├── IMPLEMENTATION_SUMMARY.md # What's built
    └── PROJECT_STRUCTURE.md   # This file
```

## Architectural Layers

### Framework Layer (`src/framework/`)

Contains all infrastructure code that is **reusable and framework-agnostic**:

#### Services (`framework/services/`)
- **apiClient.ts** - Base HTTP client with JWT authentication
- **authService.ts** - Authentication, OTP, signup/login
- **productService.ts** - Products, riders, pricing
- **policyService.ts** - Policy management, underwriting
- **agentService.ts** - Agent portal, commissions, referrals
- **claimService.ts** - Claims management

#### Types (`framework/types/`)
- Complete TypeScript type definitions
- 40+ interfaces for data models
- Ensures type safety across the app

#### Constants (`framework/constants/`)
- API endpoints mapped
- Status codes and enums
- Commission rates and configurations
- Error messages and codes

#### Utils (`framework/utils/`)
- String formatters (phone, currency, ID masking)
- Date utilities (formatting, age calculation)
- Validation functions (email, phone, ID, bank account)
- Storage utilities

#### Components (`framework/components/`)
- Reusable UI components
- SocialAuthButtons for auth pages
- Easily extensible for new components

#### Styling (`framework/styles/`)
- Global CSS files
- Page-specific styles
- Organized by feature/concern

#### Theme (`framework/theme/`)
- Ionic theme variables
- Color schemes, typography
- Centralized theming

#### Hooks & Context (Reserved)
- Ready for custom React hooks
- Ready for context providers
- Currently empty, available for expansion

### Pages Layer (`src/pages/`)

Contains only **presentation components** (React page components):

- No business logic
- No API calls directly
- Uses framework services for data
- Focuses on UI and user interaction
- 10 page components for complete user journeys

### Root Level (`src/`)

- **App.tsx** - Main router and layout
- **main.tsx** - React entry point
- **index.css** - Global styles
- **App.css** - App component styles

## Import Patterns

### In Page Components

```typescript
// Importing from framework
import type { User, Policy } from '../framework/types'
import { AuthService } from '../framework/services/authService'
import { POLICY_STATUS } from '../framework/constants'
import { StringUtil } from '../framework/utils'

// Using framework in a page
export default function MyPage() {
  const [data, setData] = useState<User[]>([])
  
  const handleFetch = async () => {
    const response = await AuthService.getCurrentUser()
    // ...
  }
  
  return <div>Page content</div>
}
```

### In Framework Services

```typescript
// Service imports (internal framework)
import type { Policy } from '../types'
import { POLICY_STATUS } from '../constants'
import ApiClient from './apiClient'

export class PolicyService {
  static async getPolicy(id: string): Promise<Policy> {
    return ApiClient.get(`/policies/${id}`)
  }
}
```

## Adding New Features

### Adding a New Page

1. Create component in `src/pages/NewPage.tsx`
2. Import framework services/types as needed
3. Add route to `App.tsx`

```typescript
// src/pages/MyNewPage.tsx
import type { SomeType } from '../framework/types'
import SomeService from '../framework/services/someService'

export default function MyNewPage() {
  // Page implementation
}
```

### Adding a New Service

1. Create file in `src/framework/services/myService.ts`
2. Define API methods
3. Use in pages via import

```typescript
// src/framework/services/myService.ts
import type { MyType } from '../types'
import ApiClient from './apiClient'

export class MyService {
  static async getData(): Promise<MyType[]> {
    return ApiClient.get('/my-endpoint')
  }
}
```

### Adding New Types

1. Add to `src/framework/types/index.ts`
2. Export for use across app

```typescript
// src/framework/types/index.ts
export interface MyNewType {
  id: string
  name: string
  // ...
}
```

### Adding Utility Functions

1. Add to `src/framework/utils/index.ts`
2. Use across services and pages

```typescript
export const MyUtil = {
  someFunction: (input: string) => {
    // implementation
  }
}
```

## Build Process

```bash
# Development
pnpm run dev          # Start dev server with HMR

# Production
pnpm run build        # TypeScript + Vite build
pnpm run preview      # Preview production build locally

# Code Quality
pnpm run lint         # Check linting
pnpm run lint --fix   # Auto-fix issues
```

## Architecture Benefits

✅ **Separation of Concerns**
- Framework layer handles all infrastructure
- Pages layer focuses on UI

✅ **Scalability**
- Add pages without cluttering root
- Framework easily extensible

✅ **Maintainability**
- All infrastructure in one place
- Easy to locate any service/util

✅ **Reusability**
- Framework can be extracted to shared package
- Consistent patterns across projects

✅ **Testing**
- Services can be tested independently
- Pages can mock framework layer

## Best Practices

### Do's ✅

- Keep pages focused on UI
- Use framework services for all API calls
- Import types from framework/types
- Use constants from framework/constants
- Keep styles organized in framework/styles

### Don'ts ❌

- Don't import services directly in other services (use types instead)
- Don't put business logic in pages
- Don't create multiple type definition files
- Don't hardcode API endpoints in components
- Don't import pages in other pages (use router instead)

## Import Aliases (Future Enhancement)

Consider adding path aliases to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@services/*": ["./framework/services/*"],
      "@types/*": ["./framework/types/*"],
      "@utils/*": ["./framework/utils/*"],
      "@constants/*": ["./framework/constants/*"]
    }
  }
}
```

Then import as:
```typescript
import AuthService from '@services/authService'
import type { User } from '@types'
```

## Folder Purposes Reference

| Folder | Purpose | Example |
|--------|---------|---------|
| `services/` | API communication | `authService.ts` |
| `types/` | TypeScript interfaces | `User`, `Policy` |
| `constants/` | Configuration & enums | `API_ENDPOINTS` |
| `utils/` | Helper functions | `formatPhone()` |
| `components/` | Reusable UI | `SocialAuthButtons` |
| `styles/` | CSS files | `global.css` |
| `theme/` | Ionic theming | `variables.css` |
| `hooks/` | Custom hooks | `useAuth()` (future) |
| `context/` | Context providers | `AuthContext` (future) |
| `pages/` | Page components | `Dashboard.tsx` |

## Migration from Old Structure

If migrating an existing project:

1. Create `src/framework/` directory
2. Move all infrastructure folders into framework
3. Update imports in all files
4. Verify build passes
5. Update documentation

Example import update:
```typescript
// Old
import AuthService from '../services/authService'

// New
import AuthService from '../framework/services/authService'
```

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Production Ready
