import { useState, useEffect } from "react";
import { useKYC } from "../../hooks/useKYC";
import { kycService } from "../../services/kycService";
// import '../styles/KYCSteps.css';

interface PersonalDetailsStepProps {
  onComplete: () => void;
}

export const PersonalDetailsStep = ({
  onComplete,
}: PersonalDetailsStepProps) => {
  const { kycData, updateKYCData, setError, setLoading, error, isLoading } =
    useKYC();
  const [formData, setFormData] = useState({
    firstName: kycData.idData?.firstName || "",
    lastName: kycData.idData?.lastName || "",
    dateOfBirth: kycData.idData?.dateOfBirth || "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Pre-populate from ID data
    if (kycData.idData) {
      setFormData((prev) => ({
        ...prev,
        firstName: kycData.idData?.firstName || prev.firstName,
        lastName: kycData.idData?.lastName || prev.lastName,
        dateOfBirth: kycData.idData?.dateOfBirth || prev.dateOfBirth,
      }));
    }
  }, [kycData.idData]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.email.includes("@")) errors.email = "Valid email is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!/^\d{4}$/.test(formData.postalCode))
      errors.postalCode = "Valid postal code required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    const updatedKYC = {
      ...kycData,
      idData: {
        ...kycData.idData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
      },
    };

    const result = await kycService.saveKYCData(updatedKYC);

    if (result.success) {
      updateKYCData(updatedKYC);
      onComplete();
    } else {
      setError(result.error || "Failed to save personal details");
    }

    setLoading(false);
  };

  return (
    <div className="kyc-step-container">
      <div className="kyc-step-header">
        <h2>Confirm Your Details</h2>
        <p>Review and confirm your personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="kyc-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className={formErrors.firstName ? "input-error" : ""}
            />
            {formErrors.firstName && (
              <span className="field-error">{formErrors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className={formErrors.lastName ? "input-error" : ""}
            />
            {formErrors.lastName && (
              <span className="field-error">{formErrors.lastName}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={isLoading}
            className={formErrors.dateOfBirth ? "input-error" : ""}
          />
          {formErrors.dateOfBirth && (
            <span className="field-error">{formErrors.dateOfBirth}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isLoading}
            className={formErrors.email ? "input-error" : ""}
          />
          {formErrors.email && (
            <span className="field-error">{formErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Street Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={isLoading}
            className={formErrors.address ? "input-error" : ""}
          />
          {formErrors.address && (
            <span className="field-error">{formErrors.address}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isLoading}
              className={formErrors.city ? "input-error" : ""}
            />
            {formErrors.city && (
              <span className="field-error">{formErrors.city}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="1234"
              disabled={isLoading}
              className={formErrors.postalCode ? "input-error" : ""}
            />
            {formErrors.postalCode && (
              <span className="field-error">{formErrors.postalCode}</span>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || Object.keys(formErrors).length > 0}
          className="btn btn-primary"
        >
          {isLoading ? "Saving..." : "Continue to Product Selection"}
        </button>
      </form>
    </div>
  );
};
