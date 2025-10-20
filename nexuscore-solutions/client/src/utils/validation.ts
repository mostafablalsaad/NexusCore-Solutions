export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

// ============================================
// client/src/utils/helpers.ts
// ============================================
import { format, parseISO } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return 'Invalid date';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const getIndustryColor = (industry: string): string => {
  const colors: Record<string, string> = {
    renewable: 'text-green-600 bg-green-100',
    medical: 'text-blue-600 bg-blue-100',
    submarine: 'text-indigo-600 bg-indigo-100',
    petroleum: 'text-orange-600 bg-orange-100',
    automotive: 'text-red-600 bg-red-100',
  };
  return colors[industry] || 'text-gray-600 bg-gray-100';
};

export const getIndustryLabel = (industry: string): string => {
  const labels: Record<string, string> = {
    renewable: 'Renewable Energy',
    medical: 'Medical',
    submarine: 'Submarine',
    petroleum: 'Petroleum',
    automotive: 'Automotive',
  };
  return labels[industry] || industry;
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
