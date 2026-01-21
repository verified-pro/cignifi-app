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
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonBadge,
  IonSpinner,
} from '@ionic/react';
import { homeOutline, peopleOutline, documentTextOutline, settingsOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import PolicyService from '../framework/services/policyService';
import type { Policy } from '../framework/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const fetchPolicies = async () => {
      const response = await PolicyService.getPolicies();
      if (response.success && response.data) {
        setPolicies(response.data);
      }
      setLoading(false);
    };

    fetchPolicies();
  }, []);

  const handleInitiateClaim = () => {
    navigate('/claims/new');
  };

  const handleViewAgentPortal = () => {
    navigate('/agent/dashboard');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Cignifi Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonTabs>
          <div style={{ paddingBottom: '4rem' }}>
            {activeTab === 'home' && (
              <div className="ion-padding">
                <h2 style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>Your Policies</h2>

                {loading ? (
                  <IonSpinner />
                ) : policies.length > 0 ? (
                  policies.map((policy) => (
                    <IonCard key={policy.id}>
                      <IonCardContent>
                        <h3>Policy #{policy.id}</h3>
                        <p>
                          <strong>Status:</strong>{' '}
                          <IonBadge
                            color={
                              policy.status === 'active'
                                ? 'success'
                                : policy.status === 'pending_underwriting'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {policy.status}
                          </IonBadge>
                        </p>
                        <p>
                          <strong>Premium:</strong> R{policy.premiumAmount}/month
                        </p>
                        <p>
                          <strong>Next Payment:</strong> {policy.nextPaymentDate}
                        </p>
                        {policy.waitingPeriodWaived ? (
                          <p style={{ color: '#4caf50' }}>✓ Waiting period waived</p>
                        ) : (
                          <p>
                            <strong>Waiting Period Ends:</strong>{' '}
                            {policy.waitingPeriodEndDate}
                          </p>
                        )}

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <IonButton
                            size="small"
                            fill="outline"
                            onClick={() => navigate(`/policies/${policy.id}`)}
                          >
                            View Details
                          </IonButton>
                          <IonButton
                            size="small"
                            onClick={handleInitiateClaim}
                          >
                            Make Claim
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))
                ) : (
                  <IonCard>
                    <IonCardContent style={{ textAlign: 'center' }}>
                      <p>No policies yet. Start your application today!</p>
                    </IonCardContent>
                  </IonCard>
                )}
              </div>
            )}

            {activeTab === 'referral' && (
              <div className="ion-padding" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Referral & Earnings</h2>

                <IonCard>
                  <IonCardContent>
                    <h3>Share Your Code</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      Invite friends and earn commissions
                    </p>

                    <div style={{
                      backgroundColor: '#f0f0f0',
                      padding: '1rem',
                      borderRadius: '8px',
                      textAlign: 'center',
                      marginBottom: '1rem',
                    }}>
                      <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0', color: '#666' }}>
                        Your Code:
                      </p>
                      <h3 style={{ margin: '0', fontSize: '1.8rem', fontFamily: 'monospace' }}>
                        JOHN#ABC123
                      </h3>
                    </div>

                    <IonButton
                      expand="block"
                      color="primary"
                      onClick={handleViewAgentPortal}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      View Full Agent Portal
                    </IonButton>
                  </IonCardContent>
                </IonCard>

                <IonCard>
                  <IonCardContent>
                    <h4>Commission Structure</h4>
                    <p style={{ fontSize: '0.9rem' }}>
                      🎯 Base commission for every referral<br />
                      🎯 Bonus commission if waiting period is waived<br />
                      🎯 Monthly payouts to your bank account
                    </p>
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="ion-padding" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Documents</h2>

                <IonCard>
                  <IonCardContent>
                    <p>Policy documents will appear here once active</p>
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="ion-padding" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Settings</h2>

                <IonCard>
                  <IonCardContent>
                    <IonButton
                      expand="block"
                      fill="outline"
                      color="danger"
                      onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                      }}
                    >
                      Log Out
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </div>
            )}
          </div>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" onClick={() => setActiveTab('home')}>
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="referral" onClick={() => setActiveTab('referral')}>
              <IonIcon icon={peopleOutline} />
              <IonLabel>Referrals</IonLabel>
              <IonBadge color="danger">2</IonBadge>
            </IonTabButton>
            <IonTabButton tab="documents" onClick={() => setActiveTab('documents')}>
              <IonIcon icon={documentTextOutline} />
              <IonLabel>Documents</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" onClick={() => setActiveTab('settings')}>
              <IonIcon icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
