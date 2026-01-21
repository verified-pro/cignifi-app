import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { useNavigate } from "react-router-dom"; // Updated import
import SocialAuthButtons from "../framework/components/SocialAuthButtons";
import "../framework/styles/auth_pages.css";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt:", { email, password, confirmPassword });
    // Implement signup logic here
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>cignifi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="auth-content">
        <div className="auth-container">
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
                <div className="auth-card">
                  <h1 className="auth-title">Create your Account</h1>

                  <form onSubmit={handleSignup}>
                    <IonItem className="auth-input">
                      <IonLabel position="floating">Email</IonLabel>
                      <IonInput
                        type="email"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem className="auth-input">
                      <IonLabel position="floating">Password</IonLabel>
                      <IonInput
                        type="password"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem className="auth-input">
                      <IonLabel position="floating">Confirm Password</IonLabel>
                      <IonInput
                        type="password"
                        value={confirmPassword}
                        onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonButton
                      expand="block"
                      type="submit"
                      className="auth-submit-button"
                    >
                      Sign up
                    </IonButton>
                  </form>

                  <SocialAuthButtons type="signup" />

                  <div className="auth-footer">
                    <IonText color="medium">
                      Already have an account?{" "}
                      <IonText
                        color="primary"
                        className="auth-link"
                        onClick={() => navigate("/login")} // Using navigate
                      >
                        Sign in
                      </IonText>
                    </IonText>
                  </div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
