import { toast, ToastOptions } from 'react-toastify';

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      ...options,
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 4000,
      ...options,
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      ...options,
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 3000,
      ...options,
    });
  };

  return { showSuccess, showError, showInfo, showWarning };
};