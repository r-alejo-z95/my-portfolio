import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-mono text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-gray-800 border border-gray-700 p-3 text-white font-mono',
            'focus:border-green-400 focus:outline-none transition-colors',
            'placeholder:text-gray-500',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-400 text-sm font-mono">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input