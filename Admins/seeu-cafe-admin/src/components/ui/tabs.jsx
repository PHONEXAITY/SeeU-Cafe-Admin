// /components/ui/tabs.jsx
import * as React from "react";
import { cn } from "@/lib/utils"; // สมมติว่ามี utility function สำหรับ classNames

// Tabs Component
const Tabs = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  );
});
Tabs.displayName = "Tabs";

// TabsList Component
const TabsList = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

// TabsTrigger Component
const TabsTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <button
      ref={ref}
      role="tab"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

// TabsContent Component
const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none",
        "data-[state=inactive]:hidden",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

// Custom Tabs component with controlled state
const ControlledTabs = ({ defaultValue, value, onValueChange, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || "");

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Clone children with additional props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === TabsList) {
      return React.cloneElement(child, {
        children: React.Children.map(child.props.children, (tabTrigger) => {
          if (tabTrigger.type === TabsTrigger) {
            return React.cloneElement(tabTrigger, {
              "data-state": tabTrigger.props.value === (value || activeTab) ? "active" : "inactive",
              onValueChange: handleTabChange,
            });
          }
          return tabTrigger;
        }),
      });
    }

    if (child.type === TabsContent) {
      return React.cloneElement(child, {
        "data-state": child.props.value === (value || activeTab) ? "active" : "inactive",
      });
    }

    return child;
  });

  return (
    <Tabs {...props}>
      {childrenWithProps}
    </Tabs>
  );
};

export { ControlledTabs as Tabs, TabsList, TabsTrigger, TabsContent };