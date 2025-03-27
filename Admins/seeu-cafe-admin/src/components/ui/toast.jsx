// components/ui/toast.jsx
'use client'
import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';

const Toast = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg p-4 shadow-lg',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
        className
      )}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-50 flex flex-col p-4 gap-2 w-full md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const ToastProvider = ToastPrimitive.Provider;

// Toast service implementation
let toastId = 0;
const toasts = new Set();
const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 3000;

export function toast(message, type = 'default') {
  const id = toastId++;
  const toast = { id, message, type };
  
  toasts.add(toast);
  
  if (toasts.size > TOAST_LIMIT) {
    const firstToast = toasts.values().next().value;
    toasts.delete(firstToast);
  }
  
  setTimeout(() => {
    toasts.delete(toast);
    document.dispatchEvent(new CustomEvent('toast-remove', { detail: { id } }));
  }, TOAST_REMOVE_DELAY);

  document.dispatchEvent(new CustomEvent('toast-add', { detail: toast }));
  
  return id;
}

// Add helper methods
toast.success = (message) => toast(message, 'success');
toast.error = (message) => toast(message, 'error');
toast.info = (message) => toast(message, 'info');
toast.warning = (message) => toast(message, 'warning');

// ToastContainer component to render toasts
export function ToastContainer() {
  const [visibleToasts, setVisibleToasts] = React.useState([]);

  React.useEffect(() => {
    const handleAdd = (e) => {
      setVisibleToasts((prev) => [...prev, e.detail]);
    };

    const handleRemove = (e) => {
      setVisibleToasts((prev) => prev.filter((toast) => toast.id !== e.detail.id));
    };

    document.addEventListener('toast-add', handleAdd);
    document.addEventListener('toast-remove', handleRemove);

    return () => {
      document.removeEventListener('toast-add', handleAdd);
      document.removeEventListener('toast-remove', handleRemove);
    };
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-green-500';
      case 'error':
        return 'border-l-4 border-l-red-500';
      case 'warning':
        return 'border-l-4 border-l-yellow-500';
      case 'info':
        return 'border-l-4 border-l-blue-500';
      default:
        return '';
    }
  };

  return (
    <ToastProvider>
      <ToastViewport>
        {visibleToasts.map((toast) => (
          <Toast
            key={toast.id}
            className={cn("min-w-[300px]", getToastStyles(toast.type))}
          >
            <div className="flex items-center gap-3">
              {getToastIcon(toast.type)}
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {toast.message}
              </p>
            </div>
            <ToastPrimitive.Close
              className="ml-auto rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaTimes className="w-4 h-4" />
            </ToastPrimitive.Close>
          </Toast>
        ))}
      </ToastViewport>
    </ToastProvider>
  );
}