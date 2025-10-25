// src/components/common/Button.tsx
import type { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, type MotionProps } from 'framer-motion';

type MotionAllowed = Pick<
  MotionProps,
  | 'initial'
  | 'animate'
  | 'exit'
  | 'whileHover'
  | 'whileTap'
  | 'whileFocus'
  | 'whileDrag'
  | 'transition'
>;

// Omit DOM event props that conflict with framer-motion handler signatures
type HtmlButtonSafe = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
>;

interface BaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export type ButtonProps = HtmlButtonSafe & BaseProps & Partial<MotionAllowed>;

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  // motion props (allowed subset)
  initial,
  animate,
  exit,
  whileHover,
  whileTap,
  whileFocus,
  whileDrag,
  transition,
  // rest -> html props (no animation/drag events because we omitted them)
  ...htmlProps
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  return (
    <motion.button
      // forward only the safe subset of motion props
      initial={initial}
      animate={animate}
      exit={exit}
      whileHover={whileHover ?? (disabled || loading ? undefined : { scale: 1.02 })}
      whileTap={whileTap ?? (disabled || loading ? undefined : { scale: 0.98 })}
      whileFocus={whileFocus}
      whileDrag={whileDrag}
      transition={transition}
      // spread safe html props (typed as HtmlButtonSafe)
      {...(htmlProps as HtmlButtonSafe)}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
