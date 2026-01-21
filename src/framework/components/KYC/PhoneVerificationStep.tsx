import { useState } from "react";
import { useKYC } from "../../hooks/useKYC";
import { kycService } from "../../services/kycService";
// import "../../styles/KYCSteps.css";
// import '../styles/KYCSteps.css';

interface PhoneVerificationStepProps {
  onComplete: () => void;
}

export const PhoneVerificationStep = ({
  onComplete,
}: PhoneVerificationStepProps) => {
  const { kycData, updateKYCData, setError, setLoading, error, isLoading } =
    useKYC();
  const [phone, setPhone] = useState(kycData.phone || "");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone format
    const phoneRegex = /^(\+27|0)[6-8]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid South African phone number");
      return;
    }

    setLoading(true);
    const result = await kycService.verifyPhoneNumber(phone);

    if (result.success) {
      updateKYCData({ phone });
      setShowOTP(true);
    } else {
      setError(result.error || "Failed to send OTP");
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    const result = await kycService.verifyOTP(phone, otp);

    if (result.success) {
      updateKYCData({ phone });
      onComplete();
    } else {
      setOtpError(result.error || "Invalid OTP");
    }

    setLoading(false);
  };

  return (
    <div className="kyc-step-container">
      <div className="kyc-step-header">
        <h2>Verify Your Phone Number</h2>
        <p>We'll send you an OTP to verify your identity</p>
      </div>

      {!showOTP ? (
        <form onSubmit={handleSendOTP} className="kyc-form">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+27 60 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              className="phone-input"
            />
            <small className="help-text">
              Enter your South African phone number
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !phone}
            className="btn btn-primary"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="kyc-form">
          <div className="form-group">
            <label htmlFor="otp">Enter OTP Code</label>
            <input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              disabled={isLoading}
              className="otp-input"
            />
            <small className="help-text">Check your SMS for the code</small>
          </div>

          {otpError && <div className="error-message">{otpError}</div>}

          <div className="button-group">
            <button
              type="button"
              onClick={() => setShowOTP(false)}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="btn btn-primary"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
