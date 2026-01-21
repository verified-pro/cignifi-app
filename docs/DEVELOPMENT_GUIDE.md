# Cignifi - Digital Funeral Insurance Platform

An innovative, fully digital funeral insurance application built with Ionic React, featuring seamless onboarding, peer-to-peer referral system, and agent commission tracking.

## 📋 Project Vision

Cignifi is a first-of-its-kind digital funeral insurance platform that disrupts the market with:

- **5-Minute Onboarding**: OCR-based ID verification, biometric authentication, instant underwriting
- **Three Product Tiers**: Member Only, Member + Immediate Family, Member + 10 Extended Dependents
- **Innovative Add-Ons**: Digital Legacy, Grief Support Concierge, Flexible Payout, Health & Wellness Booster
- **Peer-to-Peer Sales**: Every user is a potential agent earning commissions through referrals
- **Waiting Period Waivers**: Incentivize referrals with instant coverage for referred customers
- **Fully Digital Journey**: No paperwork, no branches, end-to-end digital experience

## 🏗️ Project Structure

```
src/
├── pages/                      # Main page components
│   ├── Login.tsx              # User login
│   ├── Signup.tsx             # User registration
│   ├── Welcome.tsx            # Landing page with referral entry
│   ├── Onboarding.tsx         # Phone verification & personal info
│   ├── ProductSelection.tsx   # Product & rider selection
│   ├── Underwriting.tsx       # Health questions & instant decision
│   ├── Payment.tsx            # Payment setup (eMandate)
│   ├── Dashboard.tsx          # User's policy dashboard
│   └── AgentPortal.tsx        # Agent dashboard & commission tracking
│
├── components/                 # Reusable UI components
│   └── SocialAuthButtons.tsx
│
├── services/                   # API service clients
│   ├── apiClient.ts           # Base HTTP client with auth
│   ├── authService.ts         # Authentication endpoints
│   ├── productService.ts      # Product & rider endpoints
│   ├── policyService.ts       # Policy management endpoints
│   ├── agentService.ts        # Agent portal endpoints
│   └── claimService.ts        # Claims endpoints
│
├── types/                      # TypeScript interfaces
│   └── index.ts               # All type definitions
│
├── constants/                  # App constants & configurations
│   └── index.ts               # Status codes, API endpoints, rates
│
├── utils/                      # Utility functions
│   └── index.ts               # Formatters, validators, helpers
│
├── hooks/                      # Custom React hooks (placeholder)
├── context/                    # React context providers (placeholder)
├── styles/                     # Global CSS
├── theme/                      # Ionic theme variables
└── App.tsx                     # Main app router

```

## 🎯 User Journey Flow

### Phase 1: Entry & Referral Handling
- User downloads app or visits website
- Optional: Enter referral code (waives waiting period)
- Navigate to onboarding

### Phase 2: Phone Verification (Onboarding)
- Enter phone number
- Receive OTP
- Verify OTP
- Fill personal information
- Account created

### Phase 3: Product Selection
- Choose product tier (Member Only, Member + Family, Member + Extended)
- Select optional add-on riders (Digital Legacy, Grief Support, etc.)
- View pricing

### Phase 4: Instant Underwriting
- Answer dynamic health questions
- Instant decision (80%+ approved)
- Some cases pending manual review
- Instant policy generation for approved

### Phase 5: Payment Setup
- Enter bank account details
- Verify via eMandate API
- Confirm debit order setup
- Policy activated

### Phase 6: Dashboard & Agent Portal
- View active policy & documents
- Manage beneficiaries
- Share unique referral code
- Track commissions (for agents)
- View earning statistics
- Request payouts

## 🔑 Key Features

### For Users
- **Seamless Onboarding**: OCR ID scanning, biometric verification, OTP-based authentication
- **Instant Decisions**: AI-powered underwriting for majority of applicants
- **Digital Wallet**: Access policies, documents, and claims from one place
- **Flexible Coverage**: Three product tiers with customizable add-ons
- **Easy Claims**: Simple claim initiation and document submission

### For Agents
- **Automatic Agent Status**: Every user gets a unique referral code
- **Real-Time Dashboard**: Track referrals, earnings, and payouts
- **Commission Tracking**: Base + bonus commissions for waived waiting periods
- **Leaderboard**: Gamified competition for top performers
- **Marketing Materials**: Downloadable social media assets
- **Monthly Payouts**: Automatic transfers to registered bank account

### For Underwriter (Sanlam)
- **Low Cost Acquisition**: Digital channel reduces customer acquisition costs
- **Instant Decisions**: Streamlined underwriting process
- **Risk Management**: Health questionnaires and biometric verification
- **Data Analytics**: Real-time insights into customer base and performance
- **New Distribution**: Peer-to-peer model reaches new demographics

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Mobile Framework**: Ionic React 8.7.9
- **Routing**: React Router DOM 7.9.5
- **Build Tool**: Vite 7.1.7
- **Language**: TypeScript 5.9.3
- **Icons**: Ionicons 8.0.13
- **Linting**: ESLint 9.36.0
- **Package Manager**: pnpm

## 📦 Dependencies

```json
{
  "@ionic/react": "^8.7.9",
  "@ionic/react-router": "^8.7.9",
  "ionicons": "^8.0.13",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.5"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone repository
git clone <repo-url>
cd cignifi-app

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run linter
pnpm run lint
```

## 📡 API Integration

The app communicates with backend via REST API. Key service endpoints:

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `POST /auth/verify-otp` - Verify OTP
- `GET /auth/me` - Get current user

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `GET /riders` - List available riders
- `POST /products/calculate-price` - Calculate total price

### Policies
- `POST /policies` - Create new policy
- `GET /policies` - List user's policies
- `POST /policies/:id/underwrite` - Submit for underwriting
- `POST /policies/:id/beneficiaries` - Add beneficiary

### Agent Portal
- `GET /agent/dashboard` - Agent statistics
- `GET /agent/referrals` - List referrals
- `GET /agent/payouts` - Payout history
- `GET /agent/leaderboard` - Top agents ranking

### Claims
- `POST /claims` - Initiate claim
- `GET /claims/:id` - Get claim details
- `POST /claims/:id/documents` - Submit claim documents

See `src/constants/index.ts` for complete endpoint mappings.

## 🔐 Security Considerations

- Token-based authentication stored in localStorage
- HTTPS-only API communication
- Biometric verification for identity confirmation
- FICA compliance for KYC
- Encrypted sensitive data (passwords, bank details)
- OTP-based phone verification

## 📊 Commission Structure

- **Base Commission**: 5% of policy premium
- **Bonus Commission**: Additional 2% if waiting period is waived
- **Payout Schedule**: Monthly automatic transfers
- **Minimum Payout**: To be determined

Example:
- Policy premium: R100/month
- Referral creates policy: Base = R5, Bonus (if waived) = R2
- Total commission per month: R5-R7

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Ionic Components**: Pre-built mobile UI components
- **Dark Theme Support**: Optional dark mode
- **Accessibility**: WCAG compliance in progress
- **Performance**: Optimized load times < 3s
- **Offline Capability**: Basic offline support planned

## 📈 Next Steps (MVP to Full Release)

### Phase 1 (Weeks 1-4) ✅
- [x] Core product selection
- [x] Single applicant onboarding
- [x] ID OCR verification structure
- [x] Instant underwriting flow
- [x] Basic referral tracking

### Phase 2 (Weeks 5-8)
- [ ] Family & group applications
- [ ] Full agent portal with commissions
- [ ] Digital wallet with documents
- [ ] Claims initiation portal
- [ ] Advanced add-on products
- [ ] Backend API development

### Phase 3 (Weeks 9-12)
- [ ] Bulk upload for groups
- [ ] Advanced analytics dashboard
- [ ] Fitness app integration
- [ ] AI underwriting optimization
- [ ] Sanlam system integration
- [ ] Production deployment

## 🤝 Contributing

See the main project documentation for contribution guidelines.

## 📝 License

This project is proprietary and confidential.

## 📞 Support

For questions or issues, contact the development team.

---

**Built by:** Cignifi Development Team  
**Last Updated:** December 2024  
**Status:** MVP Development
