import { forwardRef } from 'react';
import { cn } from '@/utils/helpers';
import Spinner from './Spinner';

const variants = { primary: 'btn-primary', secondary: 'btn-secondary', danger: 'btn-danger', ghost: 'btn-ghost', outline: 'btn-outline' };
const sizeMap  = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

const Button = forwardRef(({ children, variant = 'primary', size = 'md', isLoading = false, loadingText = 'Loading…', leftIcon, rightIcon, className = '', disabled, ...props }, ref) => (
  <button ref={ref} disabled={disabled || isLoading} className={cn(variants[variant], sizeMap[size], className)} {...props}>
    {isLoading ? (<><Spinner size="sm" /><span>{loadingText}</span></>) : (<>{leftIcon}<span>{children}</span>{rightIcon}</>)}
  </button>
));
Button.displayName = 'Button';
export default Button;
