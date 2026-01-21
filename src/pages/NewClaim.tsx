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
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonSpinner,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import ClaimService from '../framework/services/claimService';

const NewClaim: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [policyId, setPolicyId] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [claimDetails, setClaimDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContinue = () => {
    if (!policyId) {
      setErrorMsg('Please select a policy');
      setShowError(true);
      return;
    }
    setStep(2);
  };

  const handleSubmitClaim = async () => {
    if (!beneficiaryName || !claimDetails) {
      setErrorMsg('Please fill in all required fields');
      setShowError(true);
      return;
    }

    setLoading(true);
    const response = await ClaimService.initiateClaim({
      policyId,
      beneficiaryName,
      claimDetails,
    });
    setLoading(false);

    if (response.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(response.error || 'Failed to submit claim');
      setShowError(true);
    }
  };

  if (submitted) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="success">
            <IonTitle>Claim Submitted</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>✓</h1>
              <h2 style={{ marginBottom: '1rem' }}>Claim Submitted</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Your claim has been received. We'll review it shortly and keep you updated on the status.
              </p>
              <IonButton expand="block" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
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
          <IonTitle>Initiate Claim</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {step === 1 && (
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h2>Select Policy</h2>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                Which policy are you making a claim against?
              </p>

              <IonSelect
                label="Policy"
                placeholder="Select a policy"
                value={policyId}
                onIonChange={(e) => setPolicyId(e.detail.value)}
                style={{ marginBottom: '2rem' }}
              >
                <IonSelectOption value="policy-001">
                  Policy #001 - Member Only (R150/month)
                </IonSelectOption>
                <IonSelectOption value="policy-002">
                  Policy #002 - Member + Family (R250/month)
                </IonSelectOption>
              </IonSelect>

              <IonButton expand="block" onClick={handleContinue}>
                Continue
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {step === 2 && (
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h2>Claim Details</h2>

              <IonInput
                label="Beneficiary Name"
                placeholder="John Doe"
                value={beneficiaryName}
                onIonChange={(e) => setBeneficiaryName(e.detail.value || '')}
                style={{ marginBottom: '1.5rem' }}
              />

              <IonTextarea
                label="Claim Details"
                placeholder="Describe the circumstances of the claim..."
                value={claimDetails}
                onIonChange={(e) => setClaimDetails(e.detail.value || '')}
                rows={6}
                style={{ marginBottom: '2rem' }}
              />

              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
                You'll be able to upload supporting documents in the next step.
              </p>

              <IonButton
                expand="block"
                onClick={handleSubmitClaim}
                disabled={loading}
                style={{ marginBottom: '0.5rem' }}
              >
                {loading ? <IonSpinner name="dots" /> : 'Submit Claim'}
              </IonButton>

              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setStep(1)}
              >
                Back
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

export default NewClaim;
