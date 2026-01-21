import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonInput,
  IonProgressBar,
  IonSpinner,
  IonAlert,
} from '@ionic/react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { LocationState } from '../framework/types';
import AuthService from '../framework/services/authService';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOtp = async () => {
    if (!phone) {
      setErrorMsg('Please enter a phone number');
      setShowError(true);
      return;
    }

    setLoading(true);
    const response = await AuthService.requestOTP(phone);
    setLoading(false);

    if (response.success) {
      setOtpSent(true);
    } else {
      setErrorMsg(response.error || 'Failed to send OTP');
      setShowError(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMsg('Please enter the OTP');
      setShowError(true);
      return;
    }

    setLoading(true);
    const response = await AuthService.verifyOTP({ phone, otp });
    setLoading(false);

    if (response.success) {
      setStep(2);
      setOtpSent(false);
    } else {
      setErrorMsg(response.error || 'Invalid OTP');
      setShowError(true);
    }
  };

  const handleSubmitPersonalInfo = async () => {
    if (!firstName || !lastName || !idNumber || !dateOfBirth) {
      setErrorMsg('Please fill in all fields');
      setShowError(true);
      return;
    }

    setLoading(true);
    const response = await AuthService.signup({
      phone,
      firstName,
      lastName,
      idNumber,
      dateOfBirth,
      password: 'temp-password', // Will be set properly in real app
      referralCode: state?.referralCode,
    });
    setLoading(false);

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      navigate('/onboarding/products');
    } else {
      setErrorMsg(response.error || 'Failed to create account');
      setShowError(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Verify Your Identity</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonProgressBar value={(step - 1) / 2} />

        {step === 1 && (
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h2>Phone Verification</h2>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                We'll send an OTP to verify your phone number
              </p>

              {!otpSent ? (
                <>
                  <IonInput
                    label="Phone Number"
                    placeholder="+27..."
                    type="tel"
                    value={phone}
                    onIonChange={(e) => setPhone(e.detail.value || '')}
                    style={{ marginBottom: '1.5rem' }}
                  />
                  <IonButton
                    expand="block"
                    onClick={handleRequestOtp}
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="dots" /> : 'Send OTP'}
                  </IonButton>
                </>
              ) : (
                <>
                  <IonInput
                    label="Enter OTP"
                    placeholder="000000"
                    type="text"
                    value={otp}
                    onIonChange={(e) => setOtp(e.detail.value || '')}
                    style={{ marginBottom: '1.5rem' }}
                  />
                  <IonButton
                    expand="block"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="dots" /> : 'Verify OTP'}
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => setOtpSent(false)}
                  >
                    Back
                  </IonButton>
                </>
              )}
            </IonCardContent>
          </IonCard>
        )}

        {step === 2 && (
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h2>Personal Information</h2>
              <IonInput
                label="First Name"
                placeholder="John"
                value={firstName}
                onIonChange={(e) => setFirstName(e.detail.value || '')}
                style={{ marginBottom: '1rem' }}
              />
              <IonInput
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onIonChange={(e) => setLastName(e.detail.value || '')}
                style={{ marginBottom: '1rem' }}
              />
              <IonInput
                label="ID Number"
                placeholder="YYMMDDGGGGGGG"
                value={idNumber}
                onIonChange={(e) => setIdNumber(e.detail.value || '')}
                style={{ marginBottom: '1rem' }}
              />
              <IonInput
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                type="date"
                value={dateOfBirth}
                onIonChange={(e) => setDateOfBirth(e.detail.value || '')}
                style={{ marginBottom: '1.5rem' }}
              />
              <IonButton
                expand="block"
                onClick={handleSubmitPersonalInfo}
                disabled={loading}
              >
                {loading ? <IonSpinner name="dots" /> : 'Continue'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header="Error"
          message={errorMsg}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
