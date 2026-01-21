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
  IonAlert,
  IonSpinner,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bankAccount, setBankAccount] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSetupPayment = async () => {
    if (!bankAccount || !bankCode || !accountHolder) {
      setErrorMsg('Please fill in all payment details');
      setShowError(true);
      return;
    }

    setLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    setStep(2);
  };

  const handleConfirmSetup = async () => {
    setLoading(true);
    // Mock API call to setup debit order
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    setConfirmed(true);
  };

  const handleViewPolicy = () => {
    navigate('/dashboard');
  };

  if (confirmed) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="success">
            <IonTitle>Welcome! 🎉</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>✓</h1>
              <h2 style={{ marginBottom: '1rem' }}>You're Covered!</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Your policy is now active and your first payment will be deducted on the 1st of next month.
              </p>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                You can now share your unique referral code with friends and earn commissions.
              </p>

              <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0', color: '#666' }}>
                  Your Referral Code:
                </p>
                <h3 style={{ margin: '0', fontSize: '1.5rem' }}>JOHN#ABC123</h3>
              </div>

              <IonButton expand="block" color="primary" onClick={handleViewPolicy}>
                Go to Dashboard
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Set Up Payment</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>
            {step === 1 ? 'Bank Details' : 'Confirm Setup'}
          </h2>

          {step === 1 && (
            <IonCard>
              <IonCardContent>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                  We'll set up an automatic debit order for your monthly premium
                </p>

                <IonInput
                  label="Account Number"
                  placeholder="0123456789"
                  value={bankAccount}
                  onIonChange={(e) => setBankAccount(e.detail.value || '')}
                  style={{ marginBottom: '1rem' }}
                />

                <IonInput
                  label="Bank Code"
                  placeholder="ABCDZAJJ"
                  value={bankCode}
                  onIonChange={(e) => setBankCode(e.detail.value || '')}
                  style={{ marginBottom: '1rem' }}
                />

                <IonInput
                  label="Account Holder Name"
                  placeholder="John Doe"
                  value={accountHolder}
                  onIonChange={(e) => setAccountHolder(e.detail.value || '')}
                  style={{ marginBottom: '2rem' }}
                />

                <IonButton
                  expand="block"
                  onClick={handleSetupPayment}
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="dots" /> : 'Verify Details'}
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}

          {step === 2 && (
            <IonCard>
              <IonCardContent>
                <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Account Number:</strong> {bankAccount}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Bank Code:</strong> {bankCode}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Account Holder:</strong> {accountHolder}
                  </p>
                  <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', color: '#d32f2f' }}>
                    ⚠️ Please verify these details are correct before confirming
                  </p>
                </div>

                <IonButton
                  expand="block"
                  color="primary"
                  onClick={handleConfirmSetup}
                  disabled={loading}
                  style={{ marginBottom: '0.5rem' }}
                >
                  {loading ? <IonSpinner name="dots" /> : 'Confirm & Activate Policy'}
                </IonButton>

                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={() => setStep(1)}
                >
                  Edit
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Payment;
