// Local storage utility for managing app data
export const StorageUtil = {
  setItem: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to set item in localStorage:', error);
    }
  },

  getItem: <T,>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get item from localStorage:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

// String formatting utilities
export const StringUtil = {
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+27${cleaned.substring(1)}`;
    }
    return `+${cleaned}`;
  },

  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  },

  maskIdNumber: (idNumber: string): string => {
    if (idNumber.length < 8) return idNumber;
    return `${idNumber.substring(0, 4)}****${idNumber.substring(idNumber.length - 2)}`;
  },
};

// Validation utilities
export const ValidationUtil = {
  isValidPhone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  },

  isValidSouthAfricanId: (id: string): boolean => {
    if (!id || id.length !== 13) return false;
    return /^\d{13}$/.test(id);
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidBankAccount: (account: string): boolean => {
    return account.length >= 9 && account.length <= 17;
  },
};

// Date utilities
export const DateUtil = {
  formatDate: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-ZA');
  },

  formatDateTime: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleString('en-ZA');
  },

  calculateAge: (dateOfBirth: string | Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  },

  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },
};
