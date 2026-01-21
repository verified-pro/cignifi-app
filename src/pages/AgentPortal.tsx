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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/react';
import { trendingUpOutline, cashOutline, statsChartOutline, settingsOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import AgentService from '../framework/services/agentService';
import type { AgentDashboard, ReferralRecord } from '../framework/types';

const AgentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [dashboard, setDashboard] = useState<AgentDashboard | null>(null);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralFilter, setReferralFilter] = useState<'all' | 'pending' | 'active' | 'paid'>('all');

  useEffect(() => {
    const fetchData = async () => {
      const dashRes = await AgentService.getAgentDashboard();
      if (dashRes.success && dashRes.data) {
        setDashboard(dashRes.data);
      }

      const refRes = await AgentService.getReferrals();
      if (refRes.success && refRes.data?.referrals) {
        setReferrals(refRes.data.referrals);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredReferrals = referrals.filter((ref) =>
    referralFilter === 'all' ? true : ref.status === referralFilter
  );

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Agent Portal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonTabs>
          <div style={{ paddingBottom: '4rem' }}>
            {activeTab === 'stats' && dashboard && (
              <div className="ion-padding" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Your Statistics</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <IonCard>
                    <IonCardContent>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                        Total Referrals
                      </p>
                      <h3 style={{ margin: '0', fontSize: '2rem' }}>
                        {dashboard.stats.totalReferrals}
                      </h3>
                    </IonCardContent>
                  </IonCard>

                  <IonCard>
                    <IonCardContent>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                        Successful
                      </p>
                      <h3 style={{ margin: '0', fontSize: '2rem', color: '#4caf50' }}>
                        {dashboard.stats.successfulReferrals}
                      </h3>
                    </IonCardContent>
                  </IonCard>

                  <IonCard>
                    <IonCardContent>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                        Total Earnings
                      </p>
                      <h3 style={{ margin: '0', fontSize: '2rem' }}>
                        R{dashboard.stats.totalEarnings}
                      </h3>
                    </IonCardContent>
                  </IonCard>

                  <IonCard>
                    <IonCardContent>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                        Pending
                      </p>
                      <h3 style={{ margin: '0', fontSize: '2rem', color: '#ff9800' }}>
                        R{dashboard.stats.pendingEarnings}
                      </h3>
                    </IonCardContent>
                  </IonCard>
                </div>

                <IonCard>
                  <IonCardContent>
                    <h4>Leaderboard Position</h4>
                    {dashboard.leaderboardPosition ? (
                      <>
                        <p style={{ fontSize: '2.5rem', margin: '1rem 0', textAlign: 'center' }}>
                          🏆 #{dashboard.leaderboardPosition}
                        </p>
                        <p style={{ textAlign: 'center', color: '#666' }}>
                          Keep referring to climb the leaderboard!
                        </p>
                      </>
                    ) : (
                      <p>Get your first referral to appear on the leaderboard</p>
                    )}
                  </IonCardContent>
                </IonCard>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="ion-padding" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Your Referrals</h2>

                <IonSegment
                  value={referralFilter}
                  onIonChange={(e) => setReferralFilter(e.detail.value as typeof referralFilter)}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <IonSegmentButton value="all">
                    <IonLabel>All</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="pending">
                    <IonLabel>Pending</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="active">
                    <IonLabel>Active</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="paid">
                    <IonLabel>Paid</IonLabel>
                  </IonSegmentButton>
                </IonSegment>

                {filteredReferrals.length > 0 ? (
                  filteredReferrals.map((ref) => (
                    <IonCard key={ref.id}>
                      <IonCardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                              Customer: {ref.userId.substring(0, 8)}...
                            </p>
                            <p style={{ margin: '0.5rem 0' }}>
                              <strong>Status:</strong>{' '}
                              <IonBadge
                                color={
                                  ref.status === 'paid'
                                    ? 'success'
                                    : ref.status === 'active'
                                    ? 'primary'
                                    : 'warning'
                                }
                              >
                                {ref.status}
                              </IonBadge>
                            </p>
                            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                              Created: {new Date(ref.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#4caf50' }}>
                              R{ref.totalCommission}
                            </p>
                            <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>
                              Base: R{ref.baseCommission}
                              {ref.bonusCommission && ` + R${ref.bonusCommission}`}
                            </p>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))
                ) : (
                  <IonCard>
                    <IonCardContent style={{ textAlign: 'center' }}>
                      <p>No referrals in this category yet</p>
                    </IonCardContent>
                  </IonCard>
                )}
              </div>
            )}

            {activeTab === 'payouts' && dashboard && (
              <div className="ion-padding" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Payout History</h2>

                {dashboard.payouts.length > 0 ? (
                  dashboard.payouts.map((payout) => (
                    <IonCard key={payout.id}>
                      <IonCardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                              {new Date(payout.createdAt).toLocaleDateString()}
                            </p>
                            <IonBadge
                              color={
                                payout.status === 'completed'
                                  ? 'success'
                                  : payout.status === 'failed'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {payout.status}
                            </IonBadge>
                          </div>
                          <p style={{ margin: '0', fontSize: '1.3rem', fontWeight: 'bold' }}>
                            R{payout.amount}
                          </p>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))
                ) : (
                  <IonCard>
                    <IonCardContent style={{ textAlign: 'center' }}>
                      <p>No payouts yet. Start referring to earn!</p>
                    </IonCardContent>
                  </IonCard>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="ion-padding" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Marketing Materials</h2>

                <IonCard>
                  <IonCardContent>
                    <h4>Coming Soon</h4>
                    <p>Download social media images and videos to share with your network</p>
                    <IonButton fill="outline">Browse Materials</IonButton>
                  </IonCardContent>
                </IonCard>
              </div>
            )}
          </div>

          <IonTabBar slot="bottom">
            <IonTabButton tab="stats" onClick={() => setActiveTab('stats')}>
              <IonIcon icon={statsChartOutline} />
              <IonLabel>Stats</IonLabel>
            </IonTabButton>
            <IonTabButton tab="referrals" onClick={() => setActiveTab('referrals')}>
              <IonIcon icon={trendingUpOutline} />
              <IonLabel>Referrals</IonLabel>
            </IonTabButton>
            <IonTabButton tab="payouts" onClick={() => setActiveTab('payouts')}>
              <IonIcon icon={cashOutline} />
              <IonLabel>Payouts</IonLabel>
            </IonTabButton>
            <IonTabButton tab="materials" onClick={() => setActiveTab('materials')}>
              <IonIcon icon={settingsOutline} />
              <IonLabel>Materials</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonContent>
    </IonPage>
  );
};

export default AgentPortal;
