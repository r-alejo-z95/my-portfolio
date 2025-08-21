import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer'
    
    const variants = {
      primary: 'bg-green-400 text-black hover:bg-green-300',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700',
      outline: 'border border-gray-600 text-white hover:border-green-400 hover:text-green-400',
      destructive: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-400'
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-lg'
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