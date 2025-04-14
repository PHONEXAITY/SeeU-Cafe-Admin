import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// Root AlertDialog component ที่จัดการสถานะ open
const AlertDialog = ({ children, open }) => {
  // แสดงเฉพาะเมื่อ open เป็น true
  return (
    <>
      {React.Children.map(children, (child) => {
        // ถ้าเป็น AlertDialogContent ให้ส่ง prop open ไปด้วย
        if (
          React.isValidElement(child) &&
          child.type.displayName === "AlertDialogContent"
        ) {
          return React.cloneElement(child, { open });
        }
        return child;
      })}
    </>
  );
};

// AlertDialogContent ที่ตรวจสอบ open ก่อนแสดงผล
const AlertDialogContent = React.forwardRef(
  ({ className, children, open, ...props }, ref) => {
    // ไม่แสดงอะไรถ้า open ไม่เป็น true
    if (!open) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          ref={ref}
          className={cn(
            "bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4",
            "animate-in fade-in-50",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
AlertDialogContent.displayName = "AlertDialogContent";

// Header component for title and description
const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

// Title component
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

// Description component
const AlertDialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  )
);
AlertDialogDescription.displayName = "AlertDialogDescription";

// Footer component for action buttons
const AlertDialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex justify-end space-x-2 mt-4", className)}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

// Action button for confirming
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
      "focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
));
AlertDialogAction.displayName = "AlertDialogAction";

// Cancel button
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300",
      "focus:outline-none focus:ring-2 focus:ring-gray-500",
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
