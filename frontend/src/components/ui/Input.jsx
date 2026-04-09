import { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

const Input = forwardRef(({ label, name, error, helperText, required, leftIcon, rightIcon, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label htmlFor={name} className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
    <div className="relative">
      {leftIcon  && <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">{leftIcon}</div>}
      <input ref={ref} id={name} name={name} aria-invalid={!!error}
        className={cn('input', error && 'input-error', leftIcon && 'pl-10', rightIcon && 'pr-10', className)} {...props} />
      {rightIcon && <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">{rightIcon}</div>}
    </div>
    {error      && <p className="error-msg">⚠ {error}</p>}
    {helperText && !error && <p className="helper-text">{helperText}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
