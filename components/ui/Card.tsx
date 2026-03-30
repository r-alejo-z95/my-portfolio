import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive'
  padding?: 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseClasses = 'border border-gray-800 bg-gray-900/30 rounded-sm'

    const variants = {
      default: '',
      interactive: [
        'hover:border-green-400/70 transition-all duration-300 group',
        'hover:shadow-[0_0_20px_rgba(74,222,128,0.07)]',
      ].join(' '),
    }

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
export default Card
