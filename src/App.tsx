import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./framework/theme/variables.css";

/* Pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import { KYCFlow } from "./pages/KYC";
import ProductSelection from "./pages/ProductSelection";
import Underwriting from "./pages/Underwriting";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import AgentPortal from "./pages/AgentPortal";
import NewClaim from "./pages/NewClaim";

/* Context Providers */
import { AppContextProvider } from "./framework/context/AppContext";
import { KYCProvider } from "./framework/context/KYCContext";
import { useNavigation, useAuth } from "./framework/hooks/useApp";

setupIonicReact();

/**
 * AppRouter - Manages routing based on app state
 * Extracted to use hooks
 */
const AppRouter: React.FC = () => {
  const { currentStep, setStep } = useNavigation();
  const { isAuthenticated } = useAuth();

  // Route to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentStep === 'welcome') {
      setStep('dashboard');
    }
  }, [isAuthenticated, currentStep, setStep]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Onboarding flow */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/kyc"
        element={
          <KYCProvider>
            <KYCFlow />
          </KYCProvider>
        }
      />
      <Route path="/product-selection" element={<ProductSelection />} />
      <Route path="/onboarding/products" element={<ProductSelection />} />
      <Route path="/onboarding/kyc" element={<Underwriting />} />
      <Route path="/onboarding/payment" element={<Payment />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agent/dashboard" element={<AgentPortal />} />
      <Route path="/claims/new" element={<NewClaim />} />
      
      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={isAuthenticated ? "/dashboard" : "/welcome"} 
            replace 
          />
        } 
      />
    </Routes>
  );
};

/**
 * Main App component
 */
const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonApp>
        <AppRouter />
      </IonApp>
    </AppContextProvider>
  );
};

export default App;
