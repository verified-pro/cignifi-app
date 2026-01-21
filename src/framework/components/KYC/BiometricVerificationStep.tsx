import { useRef, useState } from 'react';
import { useKYC } from '../../hooks/useKYC';
import { kycService } from '../../services/kycService';
import '../../styles/KYCSteps.css';

interface BiometricVerificationStepProps {
  onComplete: () => void;
}

export const BiometricVerificationStep = ({ onComplete }: BiometricVerificationStepProps) => {
  const { kycData, updateKYCData, setError, setLoading, error, isLoading } = useKYC();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selfieCapture, setSelfieCapture] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setSelfieCapture(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const handleVerifyBiometric = async () => {
    if (!selfieCapture || !kycData.documentUrl) {
      setError('Please capture a selfie');
      return;
    }

    setLoading(true);
    const result = await kycService.verifyBiometric(selfieCapture, kycData.documentUrl);

    if (result.success && result.data?.verified) {
      updateKYCData({ biometricVerified: true });
      onComplete();
    } else {
      setSelfieCapture(null);
      setError(
        'Biometric verification failed. Please ensure your face is clearly visible and matches your ID.'
      );
    }

    setLoading(false);
  };

  const handleRetry = () => {
    setSelfieCapture(null);
    startCamera();
  };

  return (
    <div className="kyc-step-container">
      <div className="kyc-step-header">
        <h2>Verify Your Identity</h2>
        <p>Take a selfie to verify it's really you</p>
      </div>

      <form onSubmit={e => e.preventDefault()} className="kyc-form">
        {!cameraActive && !selfieCapture && (
          <button
            type="button"
            onClick={startCamera}
            className="btn btn-primary"
            disabled={isLoading}
          >
            📷 Start Camera
          </button>
        )}

        {cameraActive && (
          <>
            <div className="camera-section">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="video-stream"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={stopCamera}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureSelfie}
                className="btn btn-primary"
              >
                📸 Capture Selfie
              </button>
            </div>
          </>
        )}

        {selfieCapture && (
          <>
            <div className="preview-section">
              <img src={selfieCapture} alt="Selfie" className="selfie-preview" />
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={handleRetry}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Retake Photo
              </button>
              <button
                type="button"
                onClick={handleVerifyBiometric}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        <small className="help-text">
          Your photo is encrypted and will only be used for verification
        </small>
      </form>
    </div>
  );
};
