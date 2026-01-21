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
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../framework/services/productService';
import type { Product, Rider, ProductTier } from '../framework/types';

const ProductSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<ProductTier>('member_only');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRiders, setSelectedRiders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [riders, setRiders] = useState<Rider[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const productsRes = await ProductService.getProducts();
      const ridersRes = await ProductService.getRiders();

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
      }
      if (ridersRes.success && ridersRes.data) {
        setRiders(ridersRes.data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const currentProduct = products.find((p) => p.tier === selectedTier);

  const handleContinue = () => {
    if (currentProduct) {
      navigate('/onboarding/kyc', {
        state: {
          productId: currentProduct.id,
          selectedRiders,
        },
      });
    }
  };

  const toggleRider = (riderId: string) => {
    setSelectedRiders((prev) =>
      prev.includes(riderId)
        ? prev.filter((id) => id !== riderId)
        : [...prev, riderId]
    );
  };

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
          <IonTitle>Choose Your Coverage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2 style={{ marginBottom: '1rem' }}>Select Your Product</h2>

        <IonSegment
          value={selectedTier}
          onIonChange={(e) => setSelectedTier(e.detail.value as ProductTier)}
        >
          <IonSegmentButton value="member_only">
            <IonLabel>Member Only</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="member_family">
            <IonLabel>+ Family</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="member_extended">
            <IonLabel>+ Extended</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {currentProduct && (
          <IonCard style={{ marginTop: '1.5rem' }}>
            <IonCardContent>
              <h3>{currentProduct.name}</h3>
              <p>{currentProduct.description}</p>
              <h4 style={{ marginTop: '1rem' }}>
                R{currentProduct.basePrice}/month
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Coverage: {currentProduct.coverage.primary.join(', ')}
              </p>
            </IonCardContent>
          </IonCard>
        )}

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Add-On Riders</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {riders.map((rider) => (
            <IonCard key={rider.id}>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{rider.name}</h4>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                      {rider.description}
                    </p>
                    <div style={{ marginTop: '0.5rem' }}>
                      {rider.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} style={{ fontSize: '0.85rem', color: '#555' }}>
                          ✓ {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                    <IonBadge color="primary">
                      +R{rider.price}
                    </IonBadge>
                    <IonButton
                      fill={selectedRiders.includes(rider.id) ? 'solid' : 'outline'}
                      color={selectedRiders.includes(rider.id) ? 'primary' : 'medium'}
                      size="small"
                      onClick={() => toggleRider(rider.id)}
                      style={{ marginTop: '0.5rem' }}
                    >
                      {selectedRiders.includes(rider.id) ? '✓ Added' : 'Add'}
                    </IonButton>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <IonButton expand="block" color="primary" onClick={handleContinue}>
            Continue to Verification
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProductSelection;
