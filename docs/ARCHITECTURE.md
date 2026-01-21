# Cignifi App - Architecture & Implementation Guide

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Ionic)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Pages Layer (User Interfaces)                             │
│  ├── Welcome → Onboarding → Products → Underwriting       │
│  ├── Payment → Dashboard                                   │
│  └── Agent Portal, Claims                                  │
│                                                             │
│  ↓                                                          │
│                                                             │
│  Components Layer (Reusable UI)                            │
│  └── SocialAuthButtons, Forms, Cards                       │
│                                                             │
│  ↓                                                          │
│                                                             │
│  Services Layer (Business Logic)                           │
│  ├── AuthService          (Authentication)                 │
│  ├── ProductService       (Products & Riders)              │
│  ├── PolicyService        (Policies & Underwriting)        │
│  ├── AgentService         (Commission & Referrals)         │
│  └── ClaimService         (Claims Management)              │
│                                                             │
│  ↓                                                          │
│                                                             │
│  API Client Layer (HTTP Communication)                     │
│  └── ApiClient (REST Client with Auth)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    (REST API Communication)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Server                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Authentication Module                                     │
│  ├── User signup/login                                     │
│  ├── OTP verification                                      │
│  └── Token management                                      │
│                                                             │
│  Product Management                                        │
│  ├── Product tiers & pricing                               │
│  ├── Riders & add-ons                                      │
│  └── Price calculations                                    │
│                                                             │
│  Policy Engine                                             │
│  ├── Policy creation                                       │
│  ├── Underwriting (with AI/ML)                             │
│  ├── Waiting period management                             │
│  └── Policy lifecycle                                      │
│                                                             │
│  Referral & Commission System                              │
│  ├── Referral code generation                              │
│  ├── Commission calculation                                │
│  ├── Agent leaderboard                                     │
│  └── Payout processing                                     │
│                                                             │
│  Claims Processing                                         │
│  ├── Claim submission                                      │
│  ├── Document verification                                 │
│  ├── Status tracking                                       │
│  └── Approval workflow                                     │
│                                                             │
│  Integrations                                              │
│  ├── KYC/FICA Providers                                    │
│  ├── Banking APIs (eMandate)                               │
│  ├── Sanlam Backend                                        │
│  └── Payment Gateways                                      │
│                                                             │
│  Database                                                  │
│  ├── Users                                                 │
│  ├── Policies                                              │
│  ├── Referrals & Commissions                               │
│  ├── Claims                                                │
│  └── Transactions                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 User Flow Data Model

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id              │
│ phone           │
│ email           │
│ firstName       │
│ lastName        │
│ idNumber        │
│ referralCode    │◄──────┐
│ referredBy      │◄──┐   │
└────────┬────────┘   │   │
         │            │   │
         ├────────────┼───┤
         │            │   │
         ▼            │   │
    ┌────────────┐    │   │
    │  Policy    │    │   │
    ├────────────┤    │   │
    │ id         │    │   │
    │ userId     │    │   │
    │ productId  │    │   │
    │ status     │    │   │
    │ premium    │    │   │
    │ riders[]   │    │   │
    │ beneficiaries│  │   │
    └────┬───────┘    │   │
         │            │   │
         ├──────┐     │   │
         │      │     │   │
         ▼      ▼     │   │
    ┌────────────────┐│   │
    │  Beneficiary   ││   │
    ├────────────────┤│   │
    │ id             ││   │
    │ name           ││   │
    │ relationship   ││   │
    │ percentage     ││   │
    └────────────────┘│   │
                      │   │
     ┌────────────────┴───┘
     │
     ▼
┌─────────────────────┐
│  ReferralRecord     │
├─────────────────────┤
│ id                  │
│ agentId             │ (User who referred)
│ userId              │ (New user)
│ status              │ (pending/active/paid)
│ baseCommission      │
│ bonusCommission     │ (if waiting period waived)
│ totalCommission     │
│ createdAt           │
│ paidAt              │
└──────────┬──────────┘
           │
           ▼
    ┌────────────────┐
    │ CommissionPayout
    ├────────────────┤
    │ id             │
    │ agentId        │
    │ amount         │
    │ status         │
    │ bankAccount    │
    │ processedAt    │
    └────────────────┘
```

## 📋 Component Hierarchy

```
App.tsx
├── Welcome
│   └── [Referral Code Entry]
├── Onboarding
│   ├── [Phone Verification]
│   └── [Personal Info]
├── ProductSelection
│   ├── [Product Tiers]
│   └── [Rider Selection]
├── Underwriting
│   └── [Health Questions]
├── Payment
│   └── [Bank Details Setup]
├── Dashboard
│   ├── [Policy Summary]
│   ├── [Referral Stats]
│   ├── [Documents]
│   └── [Settings]
├── AgentPortal
│   ├── [Statistics]
│   ├── [Referrals List]
│   ├── [Payouts]
│   └── [Marketing Materials]
├── NewClaim
│   ├── [Policy Selection]
│   └── [Claim Details]
├── Login
│   └── [Email/Password]
└── Signup
    └── [Registration Form]
```

## 🔌 Service Layer Details

### AuthService
```typescript
// signup(data) - Create account with referral tracking
// login(data) - User authentication
// verifyOTP(phone, otp) - OTP verification
// requestOTP(phone) - Request OTP
// getCurrentUser() - Fetch logged-in user
// validateReferralCode(code) - Check referral validity
```

### ProductService
```typescript
// getProducts() - List all 3 product tiers
// getProductById(id) - Get specific product
// getRiders() - List all available riders
// getRiderById(id) - Get specific rider
// calculatePrice(productId, riderIds) - Get total price
```

### PolicyService
```typescript
// createPolicy(productId, riders, dependents, referralCode)
// getPolicies() - Get user's policies
// getPolicyById(id) - Get policy details
// submitToUnderwriting(policyId, kycData) - Start underwriting
// addBeneficiary(policyId, beneficiary) - Add beneficiary
// cancelPolicy(policyId, reason) - Cancel policy
```

### AgentService
```typescript
// getAgentDashboard() - Get stats & summary
// getReferrals(page, limit) - Get referral list
// getPayoutHistory(page, limit) - Get payout list
// getLeaderboard(limit) - Get top agents
// getMarketingMaterials() - Get shareable content
// setupPayout(bankDetails) - Setup bank account
// requestPayout(amount) - Request manual payout
```

### ClaimService
```typescript
// initiateClaim(policyId, beneficiary, details)
// getClaims() - Get user's claims
// getClaimById(id) - Get claim details
// submitClaimDocuments(claimId, documents) - Upload docs
// getClaimStatus(id) - Get current status
```

## 🗄️ Data Flow: New User Journey

```
1. WELCOME
   User enters referral code (optional)
   ↓
2. ONBOARDING
   OTP verification
   Personal info collection
   Account creation
   ↓
3. PRODUCT SELECTION
   Choose tier + riders
   Calculate price
   ↓
4. UNDERWRITING
   Answer health questions
   Instant decision
   Generate policy
   ↓
5. PAYMENT SETUP
   Bank account details
   eMandate verification
   Debit order activation
   ↓
6. SUCCESS
   Policy activated
   Get referral code
   User becomes agent
   ↓
7. DASHBOARD
   View policy
   Share referral code
   Track referrals (optional)
   ↓
[Future: Make claims, manage beneficiaries, view documents]
```

## 🎯 Commission Calculation Flow

```
User A signs up using referral code from Agent B
      ↓
Policy created, status: pending_underwriting
      ↓
Underwriting complete, status: active
      ↓
System calculates:
   - Base Commission = Premium × 5%
   - If waiting period waived:
     - Bonus Commission = Premium × 2%
     - Total = Premium × 7%
   - Else:
     - Total = Premium × 5%
      ↓
Commission record created in DB
      ↓
Commission status tracked:
   - pending (policy active but waiting period active)
   - active (premium being collected)
   - paid (payout processed)
      ↓
Monthly reconciliation:
   - Aggregate all active commissions for agent
   - Process payout to bank account
   - Update status to paid
```

## 🔐 Authentication Flow

```
1. Phone Number Entry
   ↓
2. OTP Request
   Send OTP to phone
   ↓
3. OTP Verification
   User enters OTP
   Verify against backend
   ↓
4. Personal Info
   Fill in name, ID, DOB
   ↓
5. Account Creation
   POST /auth/signup
   Backend creates user
   Returns JWT token
   ↓
6. Token Storage
   Store in localStorage
   Add to API headers
   ↓
7. Authenticated Requests
   All API calls include:
   Authorization: Bearer <token>
```

## 📊 State Management Strategy

Currently using:
- **Local Storage**: Auth token, user data persistence
- **React State**: Component-level state management
- **URL Params**: Navigation state

Future considerations:
- Redux or Zustand for global state
- Context API for user data
- React Query for API caching

## 🚀 Deployment Architecture

```
Development
├── Local dev environment
├── Mock API responses
└── Vite dev server

Staging
├── Docker containers
├── Staging backend API
├── Test data
└── QA testing

Production
├── Ionic build (iOS/Android)
├── Web version (Progressive Web App)
├── Production API
├── CDN for static assets
├── Analytics & monitoring
└── Crashlytics
```

## 📱 Platform Support

- **Web**: Responsive design via Ionic
- **iOS**: Native app build via Capacitor
- **Android**: Native app build via Capacitor
- **PWA**: Install as app on mobile web

## 🔗 External Integrations

```
Cignifi Backend
├── Home Affairs (ID verification)
├── Credit Bureaus (KYC pre-fill)
├── Banking APIs (eMandate)
├── SMS Gateway (OTP delivery)
├── Email Service (Notifications)
├── Sanlam API (Policy issuance)
├── Payment Gateway (Premium collection)
└── Storage (Documents, media)
```

## 🛡️ Security Implementation

- JWT-based authentication
- HTTPS-only communication
- Biometric verification (fingerprint/face)
- Bank account encryption
- FICA compliance for KYC
- Regular security audits
- PCI compliance for payments

## 📈 Performance Optimization

- Lazy loading of pages
- Vite code splitting
- Asset optimization
- API request caching
- Local storage caching
- Progressive image loading
- Minimal animations

## 🧪 Testing Strategy

- Unit tests for services
- Component tests for UI
- Integration tests for flows
- End-to-end tests for critical paths
- Performance testing

## 📚 Development Workflow

1. Create feature branch
2. Develop & test locally
3. Run linter: `pnpm run lint`
4. Build: `pnpm run build`
5. Create pull request
6. Code review
7. Merge to main
8. Auto-deploy to staging
9. Production release

---

**Version**: 1.0  
**Last Updated**: December 2024
