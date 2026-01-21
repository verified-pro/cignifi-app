import { useNavigate, useLocation } from 'react-router-dom';
import { useKYC } from '../framework/hooks/useKYC';
import { PhoneVerificationStep } from '../framework/components/KYC/PhoneVerificationStep';
import { IDCaptureStep } from '../framework/components/KYC/IDCaptureStep';
import { BiometricVerificationStep } from '../framework/components/KYC/BiometricVerificationStep';
import { PersonalDetailsStep } from '../framework/components/KYC/PersonalDetailsStep';
import '../framework/styles/KYCSteps.css';

interface LocationState {
  referralCode?: string;
}

export const KYCFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStep, nextStep, previousStep, kycData, resetKYC } = useKYC();
  const locationState = (location.state as LocationState) || {};

  const steps = [
    { id: 1, title: 'Phone Verification', description: 'Verify your phone number' },
    { id: 2, title: 'ID Capture', description: 'Upload your ID document' },
    { id: 3, title: 'Biometric', description: 'Verify your identity' },
    { id: 4, title: 'Personal Details', description: 'Confirm your information' },
  ];

  const handleStepComplete = () => {
    if (currentStep === 4) {
      // KYC complete, navigate to product selection
      navigate('/product-selection', {
        state: {
          referralCode: locationState.referralCode,
          kycData,
        },
      });
    } else {
      nextStep();
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your progress will be lost.')) {
      resetKYC();
      navigate('/');
    }
  };

  return (
    <div className="kyc-flow-container">
      <div className="kyc-header">
        <button onClick={handleCancel} className="btn-close">
          ✕
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="progress-steps">
          {steps.map(step => (
            <div
              key={step.id}
              className={`progress-step ${
                step.id <= currentStep ? 'active' : ''
              } ${step.id === currentStep ? 'current' : ''}`}
            >
              <div className="step-number">{step.id}</div>
              <div className="step-label">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="kyc-content">
        {currentStep === 1 && (
          <PhoneVerificationStep onComplete={handleStepComplete} />
        )}
        {currentStep === 2 && <IDCaptureStep onComplete={handleStepComplete} />}
        {currentStep === 3 && (
          <BiometricVerificationStep onComplete={handleStepComplete} />
        )}
        {currentStep === 4 && (
          <PersonalDetailsStep onComplete={handleStepComplete} />
        )}
      </div>

      {/* Navigation */}
      <div className="kyc-navigation">
        {currentStep > 1 && (
          <button
            onClick={previousStep}
            className="btn btn-secondary"
          >
            ← Back
          </button>
        )}
        <div className="step-indicator">
          Step {currentStep} of {steps.length}
        </div>
      </div>
    </div>
  );
};
