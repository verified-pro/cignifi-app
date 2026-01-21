import React from "react";
import { IonButton, IonGrid, IonRow, IonCol } from "@ionic/react";
import "../styles/social_auth_buttons.css";

interface SocialAuthButtonsProps {
  type: "signin" | "signup";
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ type }) => {
  const handleSocialAuth = (provider: string) => {
    console.log(`${type} with ${provider}`);
    // Implement social authentication logic here
  };

  return (
    <div className="social-auth-container">
      <div className="divider">
        <span>Or {type} with:</span>
      </div>

      <IonGrid>
        <IonRow className="social-buttons-row">
          <IonCol>
            <IonButton
              expand="block"
              fill="outline"
              className="social-button google-button"
              onClick={() => handleSocialAuth("google")}
            >
              <span className="social-button-content">
                <strong>G</strong>
              </span>
            </IonButton>
          </IonCol>

          <IonCol>
            <IonButton
              expand="block"
              fill="outline"
              className="social-button facebook-button"
              onClick={() => handleSocialAuth("facebook")}
            >
              <span className="social-button-content">
                <strong>f</strong>
              </span>
            </IonButton>
          </IonCol>

          <IonCol>
            <IonButton
              expand="block"
              fill="outline"
              className="social-button windows-button"
              onClick={() => handleSocialAuth("windows")}
            >
              <span className="social-button-content">
                <strong>W</strong>
              </span>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default SocialAuthButtons;
