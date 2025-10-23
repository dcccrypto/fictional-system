import { Variants } from 'framer-motion';

// Card hover animation
export const cardHover: Variants = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 4px 16px rgba(0, 255, 136, 0.1)'
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    boxShadow: '0 8px 32px rgba(0, 255, 136, 0.25)',
    transition: { 
      duration: 0.2,
      ease: 'easeOut'
    }
  }
};

// Slide in from right
export const slideIn: Variants = {
  hidden: { 
    x: 100, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { 
    x: -100, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Fade in
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.4
    }
  }
};

// Fade in and scale
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Number counting animation
export const numberCount: Variants = {
  initial: { 
    opacity: 0.7 
  },
  animate: { 
    opacity: 1, 
    transition: { 
      duration: 0.5 
    }
  }
};

// Pulse animation for new items
export const pulse: Variants = {
  initial: { 
    scale: 1 
  },
  animate: { 
    scale: [1, 1.05, 1], 
    transition: { 
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Child item for stagger
export const staggerItem: Variants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

// Rank change animation
export const rankChange: Variants = {
  up: {
    y: -10,
    color: '#00ff88',
    transition: {
      duration: 0.3
    }
  },
  down: {
    y: 10,
    color: '#ff0055',
    transition: {
      duration: 0.3
    }
  },
  same: {
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Button press animation
export const buttonPress: Variants = {
  rest: { 
    scale: 1 
  },
  pressed: { 
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

// Shimmer animation for loading
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Price update flash
export const priceFlash: Variants = {
  up: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    transition: {
      duration: 0.3
    }
  },
  down: {
    backgroundColor: 'rgba(255, 0, 85, 0.2)',
    transition: {
      duration: 0.3
    }
  },
  neutral: {
    backgroundColor: 'transparent',
    transition: {
      duration: 0.3
    }
  }
};


