import React from 'react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  
  const variants = {
    primary: 'bg-primary text-dark hover:bg-primary/90',
    secondary: 'bg-gray-100 text-dark hover:bg-gray-200',
    outline: 'border border-gray-300 text-dark hover:bg-gray-50'
  };

  const sizes = {
    sm: 'px-3 py-2',
    md: 'px-4 py-2',
    lg: 'px-4 py-3'
  };
  
  return (
    <Comp 
      ref={ref}
      className={cn(
        'btn-base text-[14px]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';