"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; 
import { Check } from "lucide-react"; 

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const handleChange = (event) => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "peer h-4 w-4 appearance-none rounded border border-gray-300",
          "checked:bg-orange-500 checked:border-orange-500",
          "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors duration-200",
          className
        )}
        {...props}
      />
      <span
        className={cn(
          "absolute left-0 top-0 h-4 w-4 flex items-center justify-center",
          "pointer-events-none text-white",
          "opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
        )}
      >
        <Check className="h-3 w-3" />
      </span>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };