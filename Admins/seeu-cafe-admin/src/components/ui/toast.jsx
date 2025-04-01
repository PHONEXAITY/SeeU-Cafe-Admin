'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
        {
          "border-green-200 bg-green-50 text-green-900": variant === "success",
          "border-red-200 bg-red-50 text-red-900": variant === "error",
          "border-yellow-200 bg-yellow-50 text-yellow-900": variant === "warning",
          "border-blue-200 bg-blue-50 text-blue-900": variant === "info",
          "border-gray-200 bg-white text-gray-900": !variant || variant === "default",
        },
        className
      )}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Toast icon component
const ToastIcon = ({ variant }) => {
  const iconProps = { className: "h-5 w-5 mr-2" };
  
  switch (variant) {
    case "success":
      return <CheckCircle {...iconProps} className="text-green-600" />;
    case "error":
      return <AlertCircle {...iconProps} className="text-red-600" />;
    case "warning":
      return <AlertTriangle {...iconProps} className="text-yellow-600" />;
    case "info":
      return <Info {...iconProps} className="text-blue-600" />;
    default:
      return null;
  }
};

// Toast service implementation
let toastId = 0;
const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

// Create a custom event emitter
let listeners = [];
const createCustomEvent = (name) => (data) => {
  listeners.forEach((listener) => {
    if (listener.name === name) listener.callback(data);
  });
};

// Event handlers
const EVENTS = {
  ADD_TOAST: "add-toast",
  REMOVE_TOAST: "remove-toast",
  UPDATE_TOAST: "update-toast",
};

const addToast = createCustomEvent(EVENTS.ADD_TOAST);
const removeToast = createCustomEvent(EVENTS.REMOVE_TOAST);
const updateToast = createCustomEvent(EVENTS.UPDATE_TOAST);

function subscribe(event, callback) {
  listeners.push({ name: event, callback });
  return () => {
    listeners = listeners.filter((listener) => listener.callback !== callback);
  };
}

// Toast functions
export function toast(message, options = {}) {
  const id = toastId++;

  const toastOptions = {
    id,
    message,
    variant: options.variant || "default",
    title: options.title,
    duration: options.duration || TOAST_REMOVE_DELAY,
    ...options,
  };

  addToast(toastOptions);
  
  return {
    id,
    dismiss: () => removeToast({ id }),
    update: (props) => updateToast({ id, ...props }),
  };
}

// Helper functions
toast.success = (message, options = {}) => toast(message, { variant: "success", ...options });
toast.error = (message, options = {}) => toast(message, { variant: "error", ...options });
toast.warning = (message, options = {}) => toast(message, { variant: "warning", ...options });
toast.info = (message, options = {}) => toast(message, { variant: "info", ...options });

// ToastContainer component
export function ToastContainer() {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const handleAddToast = (toast) => {
      setToasts((prevToasts) => {
        // If we already have the maximum number of toasts, remove the oldest one
        const nextToasts = prevToasts.length >= TOAST_LIMIT 
          ? [...prevToasts.slice(1), toast] 
          : [...prevToasts, toast];
        
        return nextToasts;
      });

      // Auto dismiss toast after duration
      if (toast.duration !== Infinity) {
        setTimeout(() => {
          removeToast({ id: toast.id });
        }, toast.duration);
      }
    };

    const handleRemoveToast = ({ id }) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const handleUpdateToast = (props) => {
      setToasts((prevToasts) => 
        prevToasts.map((toast) => (toast.id === props.id ? { ...toast, ...props } : toast))
      );
    };

    // Subscribe to events
    const unsubscribeAdd = subscribe(EVENTS.ADD_TOAST, handleAddToast);
    const unsubscribeRemove = subscribe(EVENTS.REMOVE_TOAST, handleRemoveToast);
    const unsubscribeUpdate = subscribe(EVENTS.UPDATE_TOAST, handleUpdateToast);

    // Clean up subscriptions
    return () => {
      unsubscribeAdd();
      unsubscribeRemove();
      unsubscribeUpdate();
    };
  }, []);

  return (
    <ToastProvider swipeDirection="right">
      <ToastViewport className="font-['Phetsarath_OT']">
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.variant}>
            <div className="flex items-center">
              <ToastIcon variant={toast.variant} />
              <div>
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                <ToastDescription>{toast.message}</ToastDescription>
              </div>
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastViewport>
    </ToastProvider>
  );
}

// Utility function to get toast styles by variant
export function getToastStyles(variant) {
  switch (variant) {
    case "success":
      return "border-l-4 border-l-green-500";
    case "error":
      return "border-l-4 border-l-red-500";
    case "warning":
      return "border-l-4 border-l-yellow-500";
    case "info":
      return "border-l-4 border-l-blue-500";
    default:
      return "";
  }
}