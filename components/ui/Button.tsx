import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = [
      'font-mono font-semibold transition-colors rounded-sm',
      'focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 focus:ring-offset-gray-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'cursor-pointer inline-flex items-center justify-center',
    ].join(' ')

    const variants = {
      primary: 'bg-green-400 text-black hover:bg-green-300 active:bg-green-500',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
      outline: 'border border-gray-600 text-white hover:border-green-400 hover:text-green-400',
      destructive: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-400 active:bg-red-700',
      ghost: 'text-gray-400 hover:text-green-400 hover:bg-gray-800/50',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-6 py-3 gap-2',
      lg: 'px-8 py-4 text-lg gap-2',
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
