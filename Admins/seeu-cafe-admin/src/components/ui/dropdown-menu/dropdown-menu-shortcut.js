import { cn } from "@/lib/utils";

const DropdownMenuShortcut = ({ className, children, ...props }) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-gray-500", className)}
      {...props}
    >
      {children}
    </span>
  );
};

export { DropdownMenuShortcut };