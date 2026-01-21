import { useRef, useState } from 'react';
import { useKYC } from '../../hooks/useKYC';
import { kycService } from '../../services/kycService';
import '../../styles/KYCSteps.css';

interface IDCaptureStepProps {
  onComplete: () => void;
}

interface OCRResult {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  idNumber: string;
  idType: 'national_id' | 'passport';
}

export const IDCaptureStep = ({ onComplete }: IDCaptureStepProps) => {
  const { kycData, updateKYCData, setError, setLoading, error, isLoading } = useKYC();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [idType, setIdType] = useState<'national_id' | 'passport'>('national_id');
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<OCRResult | null>(kycData.idData as OCRResult | null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB max
      setError('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = e => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process with OCR
    setLoading(true);
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const result = await kycService.processIDDocument(base64, idType);

    if (result.success && result.data) {
      setExtractedData(result.data);
      updateKYCData({
        idNumber: result.data.idNumber,
        idData: {
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          dateOfBirth: result.data.dateOfBirth,
          idNumber: result.data.idNumber,
          idType: result.data.idType,
        },
        documentUrl: preview || undefined,
      });
    } else {
      setError(result.error || 'Failed to extract ID data. Please try again.');
    }

    setLoading(false);
  };

  const handleVerifyID = async () => {
    if (!extractedData?.idNumber) {
      setError('No ID data extracted');
      return;
    }

    setLoading(true);
    const result = await kycService.verifyIDWithAuthority(extractedData.idNumber);

    if (result.success && result.data?.verified) {
      onComplete();
    } else {
      setError('ID verification failed. Please ensure your document is valid.');
    }

    setLoading(false);
  };

  return (
    <div className="kyc-step-container">
      <div className="kyc-step-header">
        <h2>Capture Your ID Document</h2>
        <p>Take a clear photo of your ID or passport</p>
      </div>

      <div className="id-type-selector">
        <label>
          <input
            type="radio"
            value="national_id"
            checked={idType === 'national_id'}
            onChange={e => setIdType(e.target.value as 'national_id' | 'passport')}
            disabled={isLoading || !!extractedData}
          />
          National ID
        </label>
        <label>
          <input
            type="radio"
            value="passport"
            checked={idType === 'passport'}
            onChange={e => setIdType(e.target.value as 'national_id' | 'passport')}
            disabled={isLoading || !!extractedData}
          />
          Passport
        </label>
      </div>

      <form onSubmit={e => e.preventDefault()} className="kyc-form">
        <div className="upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isLoading || !!extractedData}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary upload-btn"
            disabled={isLoading || !!extractedData}
          >
            📷 Upload Document
          </button>
        </div>

        {preview && (
          <div className="preview-section">
            <img src={preview} alt="ID preview" className="id-preview" />
          </div>
        )}

        {extractedData && (
          <div className="extracted-data">
            <h3>Extracted Information</h3>
            <p>
              <strong>Name:</strong> {extractedData.firstName} {extractedData.lastName}
            </p>
            <p>
              <strong>Date of Birth:</strong> {extractedData.dateOfBirth}
            </p>
            <p>
              <strong>ID Number:</strong> {extractedData.idNumber}
            </p>
            <p className="note">Please verify the information is correct</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {extractedData ? (
          <button
            type="button"
            onClick={handleVerifyID}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Verifying ID...' : 'Verify & Continue'}
          </button>
        ) : (
          <small className="help-text">
            We use OCR technology to extract your information automatically
          </small>
        )}
      </form>
    </div>
  );
};
