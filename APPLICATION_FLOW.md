# Application Flow Implementation Guide

## Overview

The Cignifi application implements a sophisticated flow management system using React Context and custom hooks, ensuring seamless state management across the entire user journey.

## Architecture

### State Management Stack

```
AppContext (Provider)
    ↓
useApp() (Main Hook)
    ↓
Specialized Hooks (useAuth, useOnboarding, etc.)
    ↓
React Components
```

### Flow Layers

```
1. Navigation Layer
   └─ Manages current step and flow
   └─ Handles back navigation
   └─ Stores route history

2. Authentication Layer
   └─ User login/signup
   └─ Token management
   └─ Session handling

3. Onboarding Layer
   └─ Phone verification
   └─ Personal information
   └─ OTP handling
   └─ Referral validation

4. Product Layer
   └─ Product selection
   └─ Rider management
   └─ Dependent tracking
   └─ Price calculation

5. Underwriting Layer
   └─ Health questionnaire
   └─ Instant decision
   └─ Policy generation

6. Payment Layer
   └─ Bank account setup
   └─ Payment verification
   └─ Debit order activation

7. Policy Layer
   └─ Policy management
   └─ Document access
   └─ Claim initiation
```

---

## Application Steps

### Welcome
```
Flow: Initial entry point
├─ Display referral code entry (optional)
├─ Show product overview
├─ Provide login/signup options
└─ Handle referral validation
```

### Onboarding
```
Flow: User registration and verification
├─ Phone Verification
│  ├─ Request OTP
│  ├─ Verify OTP
│  └─ Proceed to personal info
├─ Personal Information
│  ├─ Collect name, ID, DOB
│  ├─ Validate data
│  └─ Create account
└─ Complete → Set to products step
```

### Products
```
Flow: Product and rider selection
├─ Display 3 product tiers
├─ Show available riders
├─ Allow dependent addition
├─ Calculate total price
└─ Proceed → Set to underwriting step
```

### Underwriting
```
Flow: Health assessment and approval
├─ Display dynamic questionnaire
├─ Collect answers
├─ Submit for underwriting
├─ Receive instant/pending decision
└─ Proceed → Set to payment step
```

### Payment
```
Flow: Payment method setup
├─ Collect bank details
├─ Verify account
├─ Activate debit order
└─ Proceed → Set to dashboard step
```

### Dashboard
```
Flow: User's policy hub
├─ Display active policies
├─ Show referral code
├─ Display earnings (if agent)
├─ Allow claims initiation
└─ Manage beneficiaries
```

---

## State Management Details

### AppContextState Structure

```typescript
{
  // Navigation
  currentStep: 'welcome' | 'onboarding' | 'products' | 'underwriting' | 'payment' | 'dashboard'
  previousStep: string | null
  
  // Authentication
  auth: {
    isAuthenticated: boolean
    user: User | null
    token: string | null
    loading: boolean
    error: string | null
  }
  
  // Onboarding
  onboarding: {
    step: 'phone_verification' | 'personal_info' | 'kyc_verification' | 'complete'
    phone: string
    otp: string
    otpSent: boolean
    firstName: string
    lastName: string
    idNumber: string
    dateOfBirth: string
    referralCode?: string
    loading: boolean
    error: string | null
  }
  
  // Product Selection
  productSelection: {
    selectedProductId: string | null
    selectedRiderIds: string[]
    dependents: Array<{ name, relationship, dateOfBirth }>
    totalPrice: number
    loading: boolean
    error: string | null
  }
  
  // Underwriting
  underwriting: {
    policyId: string | null
    answers: Record<string, unknown>
    status: 'pending' | 'approved' | 'rejected' | null
    message: string | null
    loading: boolean
    error: string | null
  }
  
  // Payment
  payment: {
    bankAccount: string
    bankCode: string
    accountHolder: string
    verificationStatus: 'pending' | 'verified' | 'failed' | null
    loading: boolean
    error: string | null
  }
  
  // Policies
  policies: Policy[]
  activePolicyId: string | null
}
```

---

## Custom Hooks Guide

### useApp()
Main hook providing full app state and actions
```typescript
const { currentStep, auth, onboarding, setStep, signup, ... } = useApp();
```

### useAuth()
Auth-specific hook
```typescript
const { isAuthenticated, user, login, logout, signup, ... } = useAuth();
```

### useOnboarding()
Onboarding flow hook
```typescript
const { phone, otp, otpSent, requestOTP, verifyOTP, ... } = useOnboarding();
```

### useProductSelection()
Product selection hook
```typescript
const { selectedProductId, selectedRiderIds, selectProduct, toggleRider, ... } = useProductSelection();
```

### useUnderwriting()
Underwriting hook
```typescript
const { answers, status, updateUnderwritingAnswers, submitUnderwriting, ... } = useUnderwriting();
```

### usePayment()
Payment hook
```typescript
const { bankAccount, verificationStatus, setupPayment, ... } = usePayment();
```

### useNavigation()
Navigation hook
```typescript
const { currentStep, previousStep, setStep, goBack } = useNavigation();
```

### usePolicies()
Policies hook
```typescript
const { policies, activePolicy, fetchPolicies, setActivePolicy } = usePolicies();
```

---

## Component Usage Examples

### Welcome Component
```typescript
import { useApp } from '../framework/hooks/useApp'

export function Welcome() {
  const { setStep, currentStep } = useApp()
  
  const handleStartApplication = () => {
    setStep('onboarding')
  }
  
  return (
    <div>
      <button onClick={handleStartApplication}>
        Start Application
      </button>
    </div>
  )
}
```

### Onboarding Component
```typescript
import { useOnboarding } from '../framework/hooks/useApp'

export function Onboarding() {
  const { 
    phone, 
    otp, 
    otpSent, 
    requestOTP, 
    verifyOTP 
  } = useOnboarding()
  
  const handleSendOTP = async () => {
    await requestOTP(phone)
  }
  
  const handleVerifyOTP = async () => {
    await verifyOTP(phone, otp)
  }
  
  return (
    <div>
      {!otpSent ? (
        <button onClick={handleSendOTP}>Send OTP</button>
      ) : (
        <button onClick={handleVerifyOTP}>Verify OTP</button>
      )}
    </div>
  )
}
```

### Product Selection Component
```typescript
import { useProductSelection } from '../framework/hooks/useApp'

export function ProductSelection() {
  const {
    selectedProductId,
    selectedRiderIds,
    selectProduct,
    toggleRider,
    calculatePrice
  } = useProductSelection()
  
  const handleSelectProduct = (id: string) => {
    selectProduct(id)
    calculatePrice()
  }
  
  const handleToggleRider = (id: string) => {
    toggleRider(id)
    calculatePrice()
  }
  
  return (
    <div>
      {/* Product selection UI */}
      <button onClick={() => handleSelectProduct('prod-1')}>
        Member Only
      </button>
      {/* Rider selection */}
      <input 
        type="checkbox" 
        onChange={() => handleToggleRider('rider-1')}
      />
    </div>
  )
}
```

### Dashboard Component
```typescript
import { useAuth, usePolicies } from '../framework/hooks/useApp'

export function Dashboard() {
  const { user, logout } = useAuth()
  const { policies, fetchPolicies } = usePolicies()
  
  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <div>
        {policies.map(policy => (
          <div key={policy.id}>{policy.id}</div>
        ))}
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## Action Flow Diagram

```
User Opens App
    ↓
Check if authenticated
    ├─ Yes → Go to Dashboard
    └─ No → Go to Welcome
        ↓
Welcome Page
    ├─ Login → Go to Dashboard
    ├─ Signup → Go to Onboarding
    └─ Referral Code → Validate & Go to Onboarding
        ↓
Onboarding
    ├─ Request OTP
    ├─ Verify OTP
    └─ Enter Personal Info → Signup → Go to Products
        ↓
Product Selection
    ├─ Select Product
    ├─ Select Riders
    ├─ Add Dependents
    └─ Calculate Price → Go to Underwriting
        ↓
Underwriting
    ├─ Answer Questions
    └─ Submit → Instant Decision → Go to Payment
        ↓
Payment
    ├─ Enter Bank Details
    ├─ Verify Account
    └─ Activate Policy → Go to Dashboard
        ↓
Dashboard
    ├─ View Policies
    ├─ Share Referral Code
    ├─ Initiate Claims
    └─ View Earnings (if agent)
```

---

## Error Handling

All async actions include error handling:

```typescript
try {
  const response = await authService.signup(data)
  if (response.success) {
    dispatch({ type: 'SET_AUTH_SUCCESS', payload: response.data })
  } else {
    dispatch({ type: 'SET_AUTH_ERROR', payload: response.error })
  }
} catch (error) {
  dispatch({ 
    type: 'SET_AUTH_ERROR', 
    payload: error instanceof Error ? error.message : 'An error occurred'
  })
}
```

---

## State Persistence

### Auto-saved in localStorage
- Authentication token
- User session

### Managed in memory
- Current step
- Form data
- Selections

### Fetched from backend
- Policies
- Products
- Riders

---

## Navigation Methods

### Forward Navigation
```typescript
setStep('products') // Go to specific step
```

### Back Navigation
```typescript
goBack() // Go to previous step
```

### Conditional Navigation
```typescript
if (isAuthenticated) {
  setStep('dashboard')
} else {
  setStep('welcome')
}
```

---

## Best Practices

### 1. Always use specialized hooks
```typescript
// ✅ Good
const { phone, requestOTP } = useOnboarding()

// ❌ Avoid
const { onboarding, requestOTP } = useApp()
```

### 2. Handle loading states
```typescript
const { loading, error } = useOnboarding()

if (loading) return <Spinner />
if (error) return <Error message={error} />
```

### 3. Update state immutably
```typescript
// Context handles immutability internally
// Just call actions
updateOnboarding({ phone: '+27123456789' })
```

### 4. Clean up resources
```typescript
useEffect(() => {
  return () => {
    // Clean up if needed
  }
}, [])
```

---

## Performance Optimization

### Memoization
Components using hooks should be memoized to prevent unnecessary re-renders:
```typescript
export const OnboardingForm = React.memo(() => {
  const { phone, requestOTP } = useOnboarding()
  // Component logic
})
```

### Selective State Usage
Use specialized hooks instead of main hook:
```typescript
// ✅ Only subscribes to onboarding changes
const { phone } = useOnboarding()

// ❌ Subscribes to all state changes
const { onboarding: { phone } } = useApp()
```

---

## Future Enhancements

1. **Persist Form Data**
   - Save draft onboarding data
   - Resume incomplete applications

2. **Real-time Sync**
   - WebSocket for live updates
   - Policy status notifications

3. **Offline Support**
   - Cache policies locally
   - Queue actions for sync

4. **Analytics**
   - Track step transitions
   - Monitor conversion rates

---

## Troubleshooting

### "useApp must be used within AppContextProvider"
- Ensure App.tsx wraps components with `<AppContextProvider>`

### State not updating
- Check action type names in reducer
- Verify dispatch calls are correct

### Navigation not working
- Verify currentStep matches route
- Check setStep is called correctly

---

## File Structure

```
src/
├── framework/
│   ├── context/
│   │   ├── AppContext.tsx          (Context provider)
│   │   └── appContextTypes.ts      (Type definitions)
│   └── hooks/
│       └── useApp.ts               (Custom hooks)
└── App.tsx                         (Updated with context)
```

---

**Version**: 1.0  
**Last Updated**: December 18, 2024  
**Status**: Production Ready
