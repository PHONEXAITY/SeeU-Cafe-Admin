import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Accordion Variants
const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "border rounded-lg",
      minimal: "border-b",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Accordion Main Component
const Accordion = React.forwardRef(
  ({ className, variant, type = "single", collapsible = true, children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState([]);

    const handleToggle = (value) => {
      if (type === "single") {
        setOpenItems((prev) => (prev.includes(value) ? (collapsible ? [] : prev) : [value]));
      } else {
        setOpenItems((prev) =>
          prev.includes(value)
            ? collapsible
              ? prev.filter((item) => item !== value)
              : prev
            : [...prev, value]
        );
      }
    };

    return (
      <div
        ref={ref}
        className={cn(accordionVariants({ variant }), className)}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { openItems, onToggle: handleToggle })
        )}
      </div>
    );
  }
);
Accordion.displayName = "Accordion";

// Accordion Item
const AccordionItem = React.forwardRef(
  ({ className, value, openItems, onToggle, children, ...props }, ref) => {
    const isOpen = openItems.includes(value);

    return (
      <div
        ref={ref}
        className={cn("border-b last:border-b-0", className)}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { isOpen, onToggle: () => onToggle(value) })
        )}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

// Accordion Trigger
const AccordionTrigger = React.forwardRef(
  ({ className, children, isOpen, onToggle, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted",
          className
        )}
        onClick={onToggle}
        {...props}
      >
        {children}
        <span className={cn("ml-2 transition-transform", isOpen && "rotate-180")}>
          ▼
        </span>
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

// Accordion Content
const AccordionContent = React.forwardRef(
  ({ className, children, isOpen, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden text-sm transition-all",
          isOpen ? "max-h-screen p-4" : "max-h-0"
        )}
        {...props}
      >
        <div className={cn("pb-1", className)}>{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };