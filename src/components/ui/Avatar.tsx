import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback: string
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-surface-hover select-none items-center justify-center font-medium text-text-primary text-sm',
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || fallback}
            className="aspect-square h-full w-full object-cover"
            onError={(e) => {
              // Hide image on error to display fallback text
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center uppercase">
          {fallback.substring(0, 2)}
        </span>
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
