import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-dark-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg border bg-dark-900 px-3.5 py-2.5 text-sm text-dark-100 placeholder:text-dark-500 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
            error
              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
              : 'border-dark-700 hover:border-dark-600',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-dark-500">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
