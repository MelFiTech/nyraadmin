import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      icon: '✓',
    });
  },
  
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 3000,
      icon: '✕',
    });
  },
  
  loading: (message: string, options?: ToastOptions) => {
    toast.loading(message, {
      duration: options?.duration || 3000,
    });
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};