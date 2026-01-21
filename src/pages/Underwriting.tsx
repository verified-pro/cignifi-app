import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonAlert,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import type { UnderwritingResponse } from '../framework/types';

const Underwriting: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Array<{ id: string; question: string; type: string }>>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [underwritingResult, setUnderwritingResult] = useState<UnderwritingResponse | null>(null);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    // Mock questions for demo - in real app these would come from API
    setQuestions([
      { id: 'age', question: 'Are you between 18 and 65 years old?', type: 'yes-no' },
      { id: 'health', question: 'Do you have any chronic illnesses?', type: 'yes-no' },
      { id: 'hospitalization', question: 'Have you been hospitalized in the last 12 months?', type: 'yes-no' },
    ]);
  }, []);

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitUnderwriting = async () => {
    if (Object.keys(answers).length < questions.length) {
      setErrorMsg('Please answer all questions');
      setShowError(true);
      return;
    }

    setLoading(true);
    // Mock underwriting response - in real app, this would call the API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result: UnderwritingResponse = {
      status: 'approved',
      message: 'Congratulations! You have been approved instantly.',
      nextSteps: 'Set up your payment method to activate your policy.',
    };

    setUnderwritingResult(result);
    setApproved(result.status === 'approved');
    setLoading(false);
  };

  const handleContinueToPayment = () => {
    navigate('/onboarding/payment');
  };

  if (approved && underwritingResult) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="success">
            <IonTitle>🎉 Approved!</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent>
              <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>✓</h1>
              <h2 style={{ marginBottom: '1rem' }}>{underwritingResult.message}</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                {underwritingResult.nextSteps}
              </p>
              <IonButton expand="block" color="primary" onClick={handleContinueToPayment}>
                Set Up Payment
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
          <IonTitle>Final Verification</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2 style={{ marginBottom: '1.5rem' }}>Answer a Few Health Questions</h2>
        <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '2rem' }}>
          This helps us provide you with instant coverage
        </p>

        {questions.map((question, idx) => (
          <IonCard key={question.id} style={{ marginBottom: '1rem' }}>
            <IonCardContent>
              <p style={{ marginBottom: '1rem', fontWeight: '500' }}>
                {idx + 1}. {question.question}
              </p>
              {question.type === 'yes-no' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <IonButton
                    size="small"
                    color={answers[question.id] === 'yes' ? 'primary' : 'medium'}
                    fill={answers[question.id] === 'yes' ? 'solid' : 'outline'}
                    onClick={() => handleAnswerChange(question.id, 'yes')}
                  >
                    Yes
                  </IonButton>
                  <IonButton
                    size="small"
                    color={answers[question.id] === 'no' ? 'primary' : 'medium'}
                    fill={answers[question.id] === 'no' ? 'solid' : 'outline'}
                    onClick={() => handleAnswerChange(question.id, 'no')}
                  >
                    No
                  </IonButton>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        ))}

        <IonButton
          expand="block"
          color="primary"
          onClick={handleSubmitUnderwriting}
          disabled={loading || Object.keys(answers).length < questions.length}
          style={{ marginTop: '2rem' }}
        >
          {loading ? <IonSpinner name="dots" /> : 'Submit for Underwriting'}
        </IonButton>

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

export default Underwriting;
