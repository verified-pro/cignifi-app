# Application Flow Enhancement Plan - STRUCTURE.md Alignment

## Overview

The current implementation provides a solid foundation but needs significant enhancements to match the sophisticated requirements from STRUCTURE.md. This document outlines the comprehensive flow that needs to be implemented.

---

## Complete Application Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     APP ENTRY POINTS                            │
├─────────────────────────────────────────────────────────────────┤
│ ├─ Direct Download (Show Welcome with optional referral code)  │
│ ├─ Referral Link (Pre-fill referral code)                      │
│ └─ QR Code Scan (Redirect to app with code parameter)          │
└──────────────┬──────────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│ ├─ Check if user has token (logged in)                         │
│ │  └─ YES → Go to Dashboard                                    │
│ └─ NO → Show Welcome Screen                                     │
│        ├─ Login Link → Login Flow                              │
│        ├─ Signup Link → Signup Flow                            │
│        └─ Referral Code Input → Store & Continue               │
└──────────────┬──────────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 1: SEAMLESS KYC (5 Minutes)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ STEP 1: Phone Verification & Pre-Population                   │
│ ├─ User enters phone number                                    │
│ ├─ Request OTP to phone                                        │
│ ├─ Verify OTP received                                         │
│ └─ AUTO-POPULATE from APIs:                                    │
│    ├─ Name from mobile provider                                │
│    ├─ Personal details from credit bureau                      │
│    ├─ Occupation from public records                           │
│    └─ Pre-fill all available fields                            │
│                                                                 │
│ STEP 2: ID Document Capture & OCR                             │
│ ├─ Launch camera                                               │
│ ├─ Capture ID document (front side)                            │
│ ├─ OCR technology extracts:                                    │
│    ├─ Full names                                               │
│    ├─ ID number                                                │
│    ├─ Date of birth                                            │
│    ├─ Gender                                                   │
│    ├─ Address                                                  │
│    └─ Citizenship status                                       │
│ ├─ Real-time validation with Home Affairs API                 │
│ └─ Auto-populate form                                          │
│                                                                 │
│ STEP 3: Biometric Verification (FICA)                         │
│ ├─ Request device permissions (Face ID / Fingerprint)          │
│ ├─ Capture live selfie with liveness detection                │
│ ├─ Face match against ID document (facial recognition)        │
│ ├─ Fingerprint match (if available)                            │
│ └─ FICA compliance verification                                │
│                                                                 │
│ STEP 4: Personal Details Confirmation                         │
│ ├─ Review auto-populated data                                  │
│ ├─ Allow edits if needed                                       │
│ ├─ Additional fields:                                          │
│    ├─ Employment status                                        │
│    ├─ Income bracket (optional)                                │
│    ├─ Marital status                                           │
│    └─ Number of dependents                                     │
│ └─ Confirm & save                                              │
│                                                                 │
│ COMPLETION: User is now KYC verified ✓                        │
└──────────────┬──────────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────────────┐
│            PHASE 2: PRODUCT SELECTION & CONFIGURATION          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ STEP 1: Product Tier Selection                                 │
│ ├─ Display 3 options with pricing:                             │
│ │  ├─ Member Only                                              │
│ │  │  ├─ Individual cover                                      │
│ │  │  └─ Starting from R150/month                              │
│ │  ├─ Member + Immediate Family                                │
│ │  │  ├─ Member + spouse + children                            │
│ │  │  └─ Starting from R250/month                              │
│ │  └─ Member + 10 Extended Dependents                          │
│ │     ├─ Large family/community cover                          │
│ │     └─ Starting from R500/month                              │
│ ├─ Show benefits comparison                                     │
│ └─ User selects one (with ability to upgrade later)           │
│                                                                 │
│ STEP 2: Dependent Management                                   │
│ ├─ If "Family" or "Extended" selected:                         │
│ │  ├─ Add spouse (if applicable)                               │
│ │  ├─ Add children:                                            │
│ │  │  ├─ Name                                                  │
│ │  │  ├─ Date of birth                                         │
│ │  │  ├─ Relationship                                          │
│ │  │  └─ ID number (optional for children)                     │
│ │  ├─ Add extended dependents:                                 │
│ │  │  └─ (With bulk upload option)                             │
│ │  └─ Maximum 10 for Extended product                          │
│ └─ Calculate total cover amount                                │
│                                                                 │
│ STEP 3: Optional Add-Ons/Riders Selection                     │
│ ├─ Digital Legacy Rider (+R25/month):                          │
│ │  ├─ Social media memorialization                             │
│ │  ├─ Digital asset transfer                                   │
│ │  └─ Final message service                                    │
│ ├─ Grief Support & Logistics Concierge (+R50/month):          │
│ │  ├─ 24/7 bereavement hotline                                 │
│ │  ├─ Funeral director coordination                            │
│ │  └─ Logistics assistance (first 72 hours)                    │
│ ├─ Flexible Payout Option (+R15/month):                        │
│ │  ├─ Choice: Lump sum vs Structured payout                    │
│ │  └─ Direct funeral home payment option                       │
│ └─ Health & Wellness Booster (Conditional):                    │
│    ├─ Optional fitness tracking integration                    │
│    ├─ Premium discount for active members                      │
│    └─ Annual increase without extra cost                       │
│                                                                 │
│ STEP 4: Price Calculation & Display                           │
│ ├─ Base premium × dependents                                   │
│ ├─ Add selected riders                                         │
│ ├─ Apply any discounts (referred, group, etc.)                 │
│ ├─ Show total monthly/annual cost                              │
│ └─ Display savings breakdown                                   │
│                                                                 │
│ COMPLETION: Product configured ✓                              │
└──────────────┬──────────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────────────┐
│        PHASE 3: DYNAMIC UNDERWRITING & INSTANT DECISION        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ INTELLIGENT QUESTIONNAIRE FLOW                                 │
│ ├─ System analyzes user profile:                               │
│ │  ├─ Age (from KYC)                                           │
│ │  ├─ Employment (from KYC)                                    │
│ │  ├─ Product selected                                         │
│ │  ├─ Number of dependents                                     │
│ │  └─ Referral status (waived waiting period?)                │
│ │                                                              │
│ ├─ RISK TIER ASSIGNMENT:                                       │
│ │  ├─ LOW RISK (Young, healthy, employed)                     │
│ │  │  └─ Ask 3 quick questions:                               │
│ │  │     ├─ Any serious health conditions?                     │
│ │  │     ├─ Dangerous occupation?                              │
│ │  │     └─ High-risk activities?                              │
│ │  │                                                           │
│ │  ├─ MEDIUM RISK (Older, pre-existing conditions)            │
│ │  │  └─ Ask 10 questions:                                    │
│ │  │     ├─ Medical history                                    │
│ │  │     ├─ Current medications                                │
│ │  │     ├─ Recent hospitalization                             │
│ │  │     ├─ Smoking status                                     │
│ │  │     ├─ Alcohol consumption                                │
│ │  │     ├─ Exercise frequency                                 │
│ │  │     ├─ Family health history                              │
│ │  │     ├─ Occupation hazards                                │
│ │  │     ├─ Travel plans                                       │
│ │  │     └─ Previous claims                                    │
│ │  │                                                           │
│ │  └─ HIGH RISK (Rare cases - auto-flagged)                   │
│ │     └─ Ask 20+ detailed questions                            │
│ │        └─ Scheduled for manual review                        │
│ │                                                              │
│ ├─ ADAPTIVE QUESTIONING:                                       │
│ │  └─ Questions adapt based on previous answers               │
│ │     └─ If "yes" to condition → Ask follow-ups               │
│ │     └─ If "no" → Skip irrelevant questions                   │
│ │                                                              │
│ └─ Question presentation:                                      │
│    ├─ One question per screen (mobile-optimized)              │
│    ├─ Simple yes/no or multiple choice                         │
│    ├─ Progress indicator                                       │
│    └─ Estimated time to complete                               │
│                                                                 │
│ INSTANT DECISION ENGINE                                        │
│ ├─ After questions submitted:                                  │
│ │                                                              │
│ ├─ DECISION LOGIC:                                             │
│ │  ├─ Apply underwriting rules:                                │
│ │  │  ├─ Age < 65 + no serious conditions → APPROVE           │
│ │  │  ├─ Age 65-75 + minor conditions → APPROVE               │
│ │  │  ├─ Age > 75 → PENDING (manual review)                   │
│ │  │  ├─ Serious terminal condition → DECLINE                 │
│ │  │  └─ Complex case → PENDING                               │
│ │  │                                                           │
│ │  └─ Calculate risk score (0-100):                           │
│ │     ├─ Score < 30 → INSTANT APPROVE (80%+ cases)           │
│ │     ├─ Score 30-70 → PENDING REVIEW (15% cases)             │
│ │     └─ Score > 70 → DECLINE or COUNTER-OFFER               │
│ │                                                              │
│ ├─ WAITING PERIOD LOGIC:                                       │
│ │  ├─ If APPROVED and referred (has referral code):           │
│ │  │  ├─ Waiting period WAIVED                                │
│ │  │  ├─ Cover effective: IMMEDIATELY                         │
│ │  │  └─ Accidental: Covered from inception                   │
│ │  │                                                           │
│ │  └─ If APPROVED and not referred:                           │
│ │     ├─ Waiting period: 3-6 months (natural causes)          │
│ │     ├─ Accidental: Covered from inception                   │
│ │     └─ Premium: Natural > Accidental death                   │
│ │                                                              │
│ └─ DECISION OUTCOMES:                                         │
│    ├─ APPROVED (most common)                                   │
│    │  ├─ Show green checkmark                                  │
│    │  ├─ Display message: "You're Approved!"                   │
│    │  ├─ Show cover effective date                             │
│    │  ├─ Show waiting period status                            │
│    │  └─ Proceed to payment                                    │
│    │                                                           │
│    ├─ PENDING MANUAL REVIEW                                    │
│    │  ├─ Show yellow warning                                   │
│    │  ├─ Display message: "Almost there!"                      │
│    │  ├─ Show timeline: "We'll review within 24 hours"        │
│    │  ├─ Option: Proceed to payment (policy subject to review) │
│    │  └─ Show support contact                                  │
│    │                                                           │
│    └─ DECLINED (rare)                                          │
│       ├─ Show red X with empathy                              │
│       ├─ Explain reason clearly                                │
│       ├─ Offer alternatives:                                   │
│       │  ├─ Lower cover amount                                 │
│       │  ├─ Higher premium                                     │
│       │  ├─ Re-application after 6 months                      │
│       │  └─ Customer support consultation                      │
│       └─ Suggest related products                              │
│                                                                 │
│ COMPLETION: Instant decision delivered ✓                      │
└──────────────┬──────────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────────────┐
│           PHASE 4: PAYMENT & POLICY ISSUANCE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ STEP 1: Payment Method Setup (eMandate)                       │
│ ├─ Display available payment options:                          │
│ │  ├─ Debit order (preferred - lowest fees)                    │
│ │  ├─ Credit card                                              │
│ │  ├─ Bank transfer (one-time)                                 │
│ │  └─ Mobile wallet (M-Pesa, Zalo Pay, etc.)                  │
│ │                                                              │
│ ├─ eMANDATE INTEGRATION (for debit order):                     │
│ │  ├─ Instant bank account verification                        │
│ │  ├─ Link to banking API (Directly, MyBucks, etc.)           │
│ │  ├─ User authorizes once                                     │
│ │  ├─ Recurring debit order auto-setup                         │
│ │  └─ First debit in 7 days                                    │
│ │                                                              │
│ └─ Payment confirmation:                                       │
│    ├─ Show selected method                                     │
│    ├─ Show amount to be charged                                │
│    ├─ Show frequency (monthly)                                 │
│    └─ Confirm & proceed                                        │
│                                                                 │
│ STEP 2: Policy Document Generation                            │
│ ├─ Backend generates official policy document:                 │
│ │  ├─ Policy number (auto-assigned)                            │
│ │  ├─ Cover amount                                             │
│ │  ├─ Beneficiaries listed                                     │
│ │  ├─ Riders included                                          │
│ │  ├─ Premium amount and frequency                             │
│ │  ├─ Waiting period details                                   │
│ │  ├─ Terms and conditions                                     │
│ │  └─ Digital signature/seal                                   │
│ │                                                              │
│ ├─ Send to user via:                                           │
│ │  ├─ Email (PDF attachment)                                   │
│ │  ├─ WhatsApp (optional)                                      │
│ │  └─ In-app download                                          │
│ │                                                              │
│ └─ Store in digital wallet                                     │
│                                                                 │
│ COMPLETION: Payment confirmed, policy issued ✓                │
└──────────────┬──────────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────────────┐
│          PHASE 5: POST-APPROVAL & REFERRAL ACTIVATION          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ WELCOME & ONBOARDING SUMMARY                                   │
│ ├─ Show success screen with confetti                           │
│ ├─ Display key policy details:                                 │
│ │  ├─ Policy number                                            │
│ │  ├─ Cover amount                                             │
│ │  ├─ Monthly premium                                          │
│ │  ├─ Waiting period status                                    │
│ │  ├─ Effective date                                           │
│ │  └─ Next payment date                                        │
│ │                                                              │
│ ├─ Download policy document                                    │
│ └─ Set up beneficiaries (optional now, can edit later)        │
│                                                                 │
│ REFERRAL PROGRAM INTRODUCTION                                  │
│ ├─ Explain P2P system:                                         │
│ │  ├─ User gets unique referral code                           │
│ │  ├─ Share code to earn commissions                           │
│ │  ├─ Every successful referral = money earned                 │
│ │  ├─ Bonus for waiving waiting periods                        │
│ │  └─ Track earnings in agent portal                           │
│ │                                                              │
│ ├─ Display user's unique code:                                 │
│ │  ├─ Format: UserFirstName#UniqueID (e.g., John#A7K3Q)       │
│ │  ├─ Generate referral link                                   │
│ │  ├─ Generate QR code                                         │
│ │  ├─ Copy to clipboard option                                 │
│ │  └─ Share via (WhatsApp, Facebook, SMS, Email)              │
│ │                                                              │
│ ├─ Commission Structure display:                               │
│ │  ├─ Base commission: R20-50 per successful referral         │
│ │  ├─ Bonus commission (waived waiting): +R10 per              │
│ │  ├─ Example: Refer 10 people with waived = R300/month       │
│ │  └─ Paid monthly to registered bank account                  │
│ │                                                              │
│ └─ Call to action:                                             │
│    ├─ "Start Earning" button → Agent Portal                    │
│    └─ "Continue to Dashboard" button                           │
│                                                                 │
│ COMPLETION: User onboarded and referral activated ✓           │
└──────────────┬──────────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────────────┐
│        PHASE 6: DASHBOARD & ONGOING EXPERIENCE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ PRIMARY DASHBOARD SECTIONS                                      │
│                                                                 │
│ 1. ACTIVE POLICIES SECTION                                     │
│    ├─ Card for each active policy:                             │
│    │  ├─ Policy number & name                                  │
│    │  ├─ Current cover amount                                  │
│    │  ├─ Monthly premium                                       │
│    │  ├─ Next payment date                                     │
│    │  ├─ Status (Active, Pending, etc.)                        │
│    │  └─ Quick actions (Details, Edit, Upgrade)                │
│    │                                                           │
│    ├─ Add more cover button                                    │
│    └─ View policy details                                      │
│                                                                 │
│ 2. DIGITAL WALLET                                              │
│    ├─ Policy documents:                                        │
│    │  ├─ Original policy PDF                                   │
│    │  ├─ Proof of cover letter                                 │
│    │  ├─ Beneficiary updates                                   │
│    │  ├─ Premium payment receipts                              │
│    │  └─ Claims documents                                      │
│    │                                                           │
│    └─ Download any document                                    │
│                                                                 │
│ 3. BENEFICIARY MANAGEMENT                                      │
│    ├─ View current beneficiaries                               │
│    ├─ Add new beneficiary:                                     │
│    │  ├─ Name                                                  │
│    │  ├─ Relationship                                          │
│    │  ├─ ID number                                             │
│    │  ├─ Contact details                                       │
│    │  └─ Percentage of cover allocation                        │
│    │                                                           │
│    ├─ Edit existing beneficiary                                │
│    ├─ Remove beneficiary                                       │
│    └─ Update instructions                                      │
│                                                                 │
│ 4. PAYMENT MANAGEMENT                                          │
│    ├─ Payment method:                                          │
│    │  ├─ Current method (debit order/card/etc.)                │
│    │  ├─ Last 4 digits of account                              │
│    │  └─ Change method option                                  │
│    │                                                           │
│    ├─ Payment history:                                         │
│    │  ├─ Last 12 months of payments                            │
│    │  ├─ Amount, date, status                                  │
│    │  └─ Download receipts                                     │
│    │                                                           │
│    ├─ Failed payment recovery                                  │
│    └─ Manual payment option                                    │
│                                                                 │
│ 5. CLAIMS SECTION                                              │
│    ├─ "Start a Claim" button:                                  │
│    │  ├─ Select deceased policy                                │
│    │  ├─ Declare relationship to deceased                      │
│    │  ├─ Upload death certificate                              │
│    │  ├─ Provide bank details for payout                       │
│    │  └─ Submit claim                                          │
│    │                                                           │
│    ├─ View active claims:                                      │
│    │  ├─ Status tracking                                       │
│    │  ├─ Claim number                                          │
│    │  ├─ Amount requested                                      │
│    │  ├─ Timeline                                              │
│    │  └─ Documents required                                    │
│    │                                                           │
│    └─ Claim history (resolved claims)                          │
│                                                                 │
│ 6. REFERRAL & AGENT SECTION                                    │
│    ├─ Quick stats:                                             │
│    │  ├─ Your referral code                                    │
│    │  ├─ People referred                                       │
│    │  ├─ Earnings this month                                   │
│    │  └─ Total lifetime earnings                               │
│    │                                                           │
│    ├─ Share code buttons (WhatsApp, SMS, etc.)                 │
│    └─ "Go to Agent Portal" button                              │
│                                                                 │
│ SECONDARY SECTIONS                                              │
│                                                                 │
│ 7. AGENT PORTAL (Dedicated Page)                               │
│    ├─ DASHBOARD:                                               │
│    │  ├─ Total earnings (paid + pending)                       │
│    │  ├─ Referrals this month                                  │
│    │  ├─ Conversion rate (referrals → sales)                   │
│    │  ├─ Average commission per referral                       │
│    │  └─ Rank on leaderboard                                   │
│    │                                                           │
│    ├─ REFERRALS LIST:                                          │
│    │  ├─ Name of referred person                               │
│    │  ├─ Date referred                                         │
│    │  ├─ Status (Referred, Approved, Active, Paid)            │
│    │  ├─ Commission earned (or pending)                        │
│    │  ├─ Waiting period waived? (Yes/No)                       │
│    │  └─ Payout date (if applicable)                           │
│    │                                                           │
│    ├─ COMMISSIONS BREAKDOWN:                                   │
│    │  ├─ Base commission (standard)                            │
│    │  ├─ Bonus commission (waived waiting)                     │
│    │  ├─ Total this month                                      │
│    │  └─ Trend (chart showing monthly earnings)                │
│    │                                                           │
│    ├─ PAYOUT HISTORY:                                          │
│    │  ├─ Monthly payout date                                   │
│    │  ├─ Amount paid                                           │
│    │  ├─ Bank account (last 4 digits)                          │
│    │  ├─ Download receipt                                      │
│    │  └─ Dispute claim option                                  │
│    │                                                           │
│    ├─ LEADERBOARD:                                             │
│    │  ├─ Top 10 agents this month                              │
│    │  ├─ Your rank                                             │
│    │  ├─ Total earnings vs competitors                         │
│    │  ├─ Referrals vs competitors                              │
│    │  └─ Incentives for reaching milestones                    │
│    │                                                           │
│    ├─ MARKETING MATERIALS:                                     │
│    │  ├─ Pre-made social media graphics                        │
│    │  ├─ Short video ads (for TikTok, Instagram, WhatsApp)     │
│    │  ├─ Email templates                                       │
│    │  ├─ SMS templates                                         │
│    │  ├─ WhatsApp status designs                               │
│    │  └─ Download all as a zip                                 │
│    │                                                           │
│    └─ BANK DETAILS MANAGEMENT:                                 │
│       ├─ Current registered account                            │
│       ├─ Add new account                                       │
│       └─ Change payout account                                 │
│                                                                 │
│ 8. SUPPORT & SETTINGS                                          │
│    ├─ FAQ                                                       │
│    ├─ Live chat support                                        │
│    ├─ Call support (hotline)                                   │
│    ├─ Email support                                            │
│    ├─ Profile settings                                         │
│    ├─ Notification preferences                                 │
│    ├─ Language & currency                                      │
│    └─ Logout                                                   │
│                                                                 │
│ COMPLETION: Dashboard fully functional ✓                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management Enhancements Needed

### New State Domains Required

```typescript
// Enhanced AppContextState additions

// 1. Underwriting Domain
underwriting: {
  riskTier: 'low' | 'medium' | 'high' | null
  riskScore: number | null
  questions: DynamicQuestion[]
  answers: Record<string, unknown>
  status: 'pending' | 'approved' | 'pending_review' | 'declined' | null
  message: string | null
  waitingPeriodWaived: boolean
  waitingPeriodMonths: number
  policyId: string | null
  loading: boolean
  error: string | null
}

// 2. Waiting Period Domain
waitingPeriod: {
  status: 'waived' | 'active' | null
  effectiveDate: string | null
  expiryDate: string | null
  accidentalCoverFrom: 'inception' | 'after_period'
  isReferred: boolean
}

// 3. Commission Domain
commission: {
  baseCommission: number
  bonusCommission: number | null
  totalEarned: number
  totalPending: number
  referrals: ReferralRecord[]
  payoutHistory: CommissionPayout[]
  nextPayoutDate: string | null
  loading: boolean
  error: string | null
}

// 4. Leaderboard Domain
leaderboard: {
  topAgents: LeaderboardEntry[]
  userRank: number | null
  userScore: number | null
  updateFrequency: 'daily' | 'weekly' | 'monthly'
  loading: boolean
  error: string | null
}
```

---

## Action Handlers Needed

### Underwriting Actions
```typescript
// Dynamic question fetching
fetchUnderwritingQuestions(productId: string, riskTier: string): Promise<DynamicQuestion[]>

// Answer submission
submitUnderwritingAnswers(answers: Record<string, unknown>): Promise<Decision>

// Decision evaluation
evaluateUnderwriting(): Promise<{
  status: 'approved' | 'pending' | 'declined'
  riskScore: number
  message: string
}>

// Waiting period calculation
calculateWaitingPeriod(isReferred: boolean): {
  waived: boolean
  months: number
  effectiveDate: string
  expiryDate: string
}
```

### Commission Actions
```typescript
// Fetch referrals
fetchReferrals(page?: number, limit?: number): Promise<ReferralRecord[]>

// Calculate commissions
calculateCommissions(referral: ReferralRecord): {
  baseCommission: number
  bonusCommission: number | null
  total: number
}

// Fetch payout history
fetchPayoutHistory(): Promise<CommissionPayout[]>

// Request payout
requestPayout(): Promise<{ success: boolean; message: string }>
```

### Leaderboard Actions
```typescript
// Fetch leaderboard
fetchLeaderboard(): Promise<LeaderboardEntry[]>

// Get user rank
getUserRank(): Promise<{ rank: number; score: number }>
```

---

## Implementation Priority (PHASES)

### MVP Phase 1 (Weeks 1-4) - CORE FUNCTIONALITY
- ✅ Referral code validation
- ❌ Dynamic underwriting questions (basic)
- ❌ Instant decision logic (rule-based)
- ❌ Waiting period calculation
- ❌ Commission calculation
- ❌ Agent dashboard (basic)

### Phase 2 (Weeks 5-8) - ENHANCED FEATURES
- ❌ ID OCR integration
- ❌ Biometric verification
- ❌ Pre-population APIs
- ❌ eMandates integration
- ❌ Advanced underwriting (AI-based)
- ❌ Full agent portal
- ❌ Leaderboard
- ❌ Payout automation

### Phase 3 (Weeks 9-12) - SCALE FEATURES
- ❌ Group/Stokvel features
- ❌ Bulk upload
- ❌ Marketing materials portal
- ❌ Fitness app integration
- ❌ QR code referral entry
- ❌ Advanced analytics

---

## Integration Points with Services

### AuthService (Already Integrated)
- `validateReferralCode()` - Already implemented ✓
- Signup/Login with referral tracking

### PolicyService (Needs Enhancement)
- `submitToUnderwriting()` - Needs decision logic
- `calculateWaitingPeriod()` - New method
- `recordCommission()` - New method
- `getPolicyWithReferralData()` - New method

### AgentService (Needs Implementation)
- `getAgentDashboard()` - Mostly done, needs commission calculations
- `getReferrals()` - Needs decision status tracking
- `getCommissions()` - Completely new
- `getLeaderboard()` - New method
- `requestPayout()` - New method
- `getPayoutHistory()` - New method

### New Service Needed
```typescript
// UnderwritingService
interface IUnderwritingService {
  // Get dynamic questions based on risk tier
  getDynamicQuestions(riskTier: string, productId: string): Promise<DynamicQuestion[]>
  
  // Calculate risk score
  calculateRiskScore(answers: Record<string, unknown>): number
  
  // Make underwriting decision
  makeDecision(riskScore: number): 'approved' | 'pending' | 'declined'
  
  // Get decision message
  getDecisionMessage(status: string, riskScore: number): string
}

// CommissionService
interface ICommissionService {
  // Calculate commission for referral
  calculateCommission(referral: ReferralRecord, waived: boolean): number
  
  // Get agent commissions
  getAgentCommissions(agentId: string): Promise<CommissionData>
  
  // Process monthly payout
  processMonthlyPayout(): Promise<void>
  
  // Get leaderboard
  getLeaderboard(): Promise<LeaderboardEntry[]>
}
```

---

## Summary

The current flow implementation provides a solid foundation but needs significant enhancements to match the STRUCTURE.md vision. The most critical additions are:

1. **Dynamic Underwriting** - Questions that adapt based on profile
2. **Instant Decision Logic** - AI/rule-based approval engine
3. **Waiting Period Management** - Smart logic for waiver tracking
4. **Commission System** - Calculation and tracking
5. **Agent Portal Depth** - Full dashboard with leaderboard and payouts

These enhancements will transform the app from a basic onboarding flow to a sophisticated "5-minute cover" system that truly is "first of its kind" in the digital era.

---

**Status**: Enhancement plan ready for implementation  
**Complexity**: Medium-High  
**Estimated Timeline**: 12 weeks for complete implementation  
**Impact**: Transforms app into market-leading product  

