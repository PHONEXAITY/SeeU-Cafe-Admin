import * as React from "react";

const Select = React.forwardRef(({ children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative" {...props} ref={ref}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
            value
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, {
            onValueChange: (newValue) => {
              onValueChange?.(newValue);
              setIsOpen(false);
            }
          });
        }
        return null;
      })}
    </div>
  );
});

const SelectTrigger = React.forwardRef(({ children, isOpen, onClick, value }, ref) => {
  return (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className={`
        w-full flex items-center justify-between rounded-md border border-gray-300 
        bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:border-blue-500
        ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
      `}
    >
      {React.Children.map(children, child => {
        if (child.type === SelectValue) {
          return React.cloneElement(child, { value });
        }
        return child;
      })}
      <svg 
        className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    </button>
  );
});

const SelectContent = React.forwardRef(({ children, onValueChange }, ref) => {
  return (
    <div 
      ref={ref}
      className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200"
    >
      <div className="py-1">
        {React.Children.map(children, child => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, { onValueChange });
          }
          return child;
        })}
      </div>
    </div>
  );
});

const SelectItem = React.forwardRef(({ children, value, onValueChange }, ref) => {
  return (
    <button
      type="button"
      ref={ref}
      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );
});

const SelectValue = React.forwardRef(({ children, value, placeholder }, ref) => {
  return (
    <span ref={ref} className="block truncate">
      {value ? children : placeholder}
    </span>
  );
});

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
SelectValue.displayName = "SelectValue";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };