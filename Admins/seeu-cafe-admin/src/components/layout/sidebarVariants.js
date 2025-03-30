export const sidebarVariants = {
    open: {
      x: 0,
      width: "280px",
      transition: { type: "spring", stiffness: 300, damping: 30, when: "beforeChildren", staggerChildren: 0.05 }
    },
    closed: {
      x: "-100%",
      width: "280px",
      transition: { type: "spring", stiffness: 300, damping: 30, when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 }
    },
    collapsed: {
      width: "80px",
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };
  
  export const menuItemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    collapsed: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  };
  
  export const submenuVariants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }
  };
  
  export const textVariants = {
    open: { opacity: 1, display: "block", transition: { delay: 0.1, duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.2 } },
    collapsed: { opacity: 0, display: "none", transition: { duration: 0.2 } }
  };
  
  export const backdropVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  export const iconVariants = {
    open: { scale: 1, transition: { duration: 0.2 } },
    collapsed: { scale: 1.4, transition: { duration: 0.2 } }
  };
  
  export const logoVariants = {
    initial: { rotate: -15, scale: 0.9 },
    animate: { rotate: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 15 } },
    hover: { rotate: [0, -10, 0], transition: { duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" } }
  };
  
  export const tooltipVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.8 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.2 } }
  };
  
  export const floatingButtonVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
    tap: { scale: 0.9 },
    hover: { scale: 1.1 }
  };
  
  export const quickActionsVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring", stiffness: 260, damping: 20, staggerChildren: 0.1 } },
    exit: { scale: 0, transition: { duration: 0.2 } }
  };
  
  export const quickActionItemVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };