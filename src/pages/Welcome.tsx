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
  IonSpinner,
  IonAlert,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../framework/services/authService';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartApplication = async () => {
    if (referralCode) {
      setLoading(true);
      const response = await AuthService.validateReferralCode(referralCode);
      setLoading(false);

      if (!response.success) {
        setShowError(true);
        return;
      }
    }
    navigate('/onboarding', { state: { referralCode: referralCode || undefined } });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Welcome to Cignifi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="welcome-container" style={{ marginTop: '2rem' }}>
          <IonCard>
            <IonCardContent>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                ☂️ Funeral Insurance Made Simple
              </h1>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                Get covered in just 5 minutes. No paperwork. No waiting.
              </p>

              <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                Our Products
              </h2>
              <ul style={{ marginBottom: '2rem' }}>
                <li>💼 Member Only - Basic cover for you</li>
                <li>👨‍👩‍👧 Member + Immediate Family - Protect your loved ones</li>
                <li>👥 Member + 10 Extended Dependents - Comprehensive family protection</li>
              </ul>

              <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                Have a Referral Code?
              </h2>
              <IonInput
                placeholder="Enter referral code (optional)"
                value={referralCode}
                onIonChange={(e) => setReferralCode(e.detail.value || '')}
                style={{ marginBottom: '1rem' }}
              />
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Know someone? Use their code to get your waiting period waived!
              </p>

              <IonButton
                expand="block"
                onClick={handleStartApplication}
                disabled={loading}
              >
                {loading ? <IonSpinner name="dots" /> : 'Start Application'}
              </IonButton>

              <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <IonButton
                  fill="clear"
                  onClick={() => navigate('/login')}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Log In
                </IonButton>
              </p>
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header="Invalid Referral Code"
          message="The referral code you entered is not valid. Please check and try again."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
