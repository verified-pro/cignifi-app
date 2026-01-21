# Cignifi App - Quick Start Guide

## 🚀 Get Up and Running in 3 Steps

### Step 1: Install Dependencies
```bash
cd cignifi-app
pnpm install
```

### Step 2: Start Development Server
```bash
pnpm run dev
```
Open browser: `http://localhost:5173`

### Step 3: Build for Production
```bash
pnpm run build
```
Output in `dist/` folder

---

## 📋 File Structure Quick Reference

### Pages (User Interfaces)
```
src/pages/
├── Welcome.tsx           ← Landing page
├── Onboarding.tsx        ← Phone & personal info
├── ProductSelection.tsx  ← Choose product tier & riders
├── Underwriting.tsx      ← Health questions
├── Payment.tsx           ← Bank setup
├── Dashboard.tsx         ← User policy hub
├── AgentPortal.tsx       ← Commission tracking
└── NewClaim.tsx          ← Claims initiation
```

### Services (API Communication)
```
src/services/
├── apiClient.ts          ← HTTP base client
├── authService.ts        ← Auth endpoints
├── productService.ts     ← Products & riders
├── policyService.ts      ← Policy management
├── agentService.ts       ← Commission & referrals
└── claimService.ts       ← Claims processing
```

### Types & Config
```
src/
├── types/index.ts        ← All TypeScript interfaces
├── constants/index.ts    ← API endpoints & configs
└── utils/index.ts        ← Helper functions
```

---

## 🔗 Key Entry Points

### User Journey Flow
```
/ (root)
↓
/welcome                  ← Show referral entry
↓
/onboarding              ← Phone verification
↓
/onboarding/products     ← Product selection
↓
/onboarding/kyc          ← Underwriting
↓
/onboarding/payment      ← Payment setup
↓
/dashboard               ← User dashboard (policy hub)
↓
/agent/dashboard         ← Agent portal (commissions)
```

---

## 🛠️ Common Commands

```bash
# Development
pnpm run dev              # Start dev server

# Building
pnpm run build            # Production build
pnpm run preview          # Preview prod build locally

# Code Quality
pnpm run lint             # Check linting
pnpm run lint --fix       # Auto-fix linting issues

# Package Management
pnpm install             # Install all dependencies
pnpm add <package>       # Add new package
pnpm remove <package>    # Remove package
```

---

## 🎨 Component Usage Examples

### Use Service in a Component
```typescript
import { useEffect, useState } from 'react';
import ProductService from '../services/productService';
import type { Product } from '../types';

export const MyComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await ProductService.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
};
```

### Use Navigation
```typescript
import { useNavigate } from 'react-router-dom';

export const MyComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard', { 
      state: { data: 'some data' } 
    });
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
};
```

### Use Types
```typescript
import type { Policy, User, AgentDashboard } from '../types';

const myPolicy: Policy = {
  id: 'pol-001',
  userId: 'user-001',
  productId: 'prod-001',
  riderIds: ['rider-001'],
  premiumAmount: 150,
  status: 'active',
  // ... other required fields
};
```

---

## 🔌 API Integration Checklist

Before connecting to real API:

- [ ] Set environment variables (`VITE_API_URL`)
- [ ] Configure authentication endpoint
- [ ] Test all service methods
- [ ] Implement error handling
- [ ] Add request/response logging
- [ ] Verify CORS configuration
- [ ] Test on different networks
- [ ] Add timeout handling

### Environment Setup
```bash
# Create .env.local file
VITE_API_URL=https://your-api-domain.com/v1
```

---

## 🐛 Debugging Tips

### Browser DevTools
- Use Network tab to inspect API calls
- Check Console for errors
- Use React DevTools extension
- Check Application tab for localStorage

### Common Issues

**Issue**: App won't build  
**Solution**: Run `pnpm install` then `pnpm run build`

**Issue**: API calls failing  
**Solution**: Check `VITE_API_URL` env variable

**Issue**: Routes not working  
**Solution**: Verify routes in `App.tsx`

**Issue**: Type errors  
**Solution**: Check `src/types/index.ts`

---

## 📱 Responsive Design

The app uses **Ionic React** which is fully responsive:
- Mobile: 320px - 576px
- Tablet: 576px - 992px
- Desktop: 992px+

Test with browser DevTools mobile view.

---

## 🚢 Deployment Options

### Web Deployment
```bash
pnpm run build
# Upload dist/ folder to hosting (Vercel, Netlify, etc.)
```

### Mobile App (Future)
```bash
# Using Capacitor to build iOS/Android
pnpm add -D @capacitor/cli @capacitor/core
npx cap init
npx cap add ios
npx cap add android
npx cap open ios
npx cap open android
```

---

## 📚 Documentation Files

- **README.md** - Project overview
- **DEVELOPMENT_GUIDE.md** - Detailed development reference
- **ARCHITECTURE.md** - System architecture & data flow
- **IMPLEMENTATION_SUMMARY.md** - What's been built
- **This File** - Quick reference

---

## 🎓 Learning Resources

**For understanding the app:**
1. Read `ARCHITECTURE.md` - Understand system design
2. Check `src/types/index.ts` - Understand data models
3. Review `src/services/` - See how API calls work
4. Explore `src/pages/` - See UI implementations

**For making changes:**
1. Add new service? → Create in `src/services/`
2. Add new page? → Create in `src/pages/` + add route in `App.tsx`
3. Add new types? → Add to `src/types/index.ts`
4. Add utilities? → Add to `src/utils/index.ts`

---

## ✅ Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Linter shows no errors
- [ ] Build produces no errors
- [ ] Bundle size optimized
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] User flows tested
- [ ] Mobile responsive verified
- [ ] Performance checked
- [ ] Security audit done

---

## 🆘 Getting Help

### Documentation
- Check `DEVELOPMENT_GUIDE.md` for detailed info
- Review `ARCHITECTURE.md` for system design
- See `src/types/index.ts` for data structures

### Debugging
- Check browser console for errors
- Use Network tab to inspect API calls
- Look at TypeScript compiler errors
- Check `src/constants/index.ts` for configuration

### Common Tasks
- **Add new API endpoint**: Update service in `src/services/`
- **Create new page**: Add component in `src/pages/` + route
- **Change styling**: Modify CSS files in `src/styles/` or theme in `src/theme/`
- **Add utility function**: Extend `src/utils/index.ts`

---

**Happy Coding! 🚀 Cignifi is ready for launch.**
