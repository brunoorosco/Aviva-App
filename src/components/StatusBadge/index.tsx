import { Badge } from '@/components/ui/badge'
import { Check, X, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatusBadgeProps = {
  status?: boolean
  label: string
  variant?: 'program' | 'module'
}

export const StatusBadge = ({
  status,
  label,
  variant = 'program'
}: StatusBadgeProps) => {
  if (status === undefined) {
    return (
      <Badge
        variant={status ? 'default' : 'destructive'}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-3xl',
          status && variant === 'program' && 'bg-palette-success',
          status && variant === 'module' && 'bg-accent'
        )}
      >
        <Clock className='w-3.5 h-3.5' />
        {label}
      </Badge>
    )
  }

  return (
    <Badge
      variant={status ? 'default' : 'destructive'}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-3xl',
        status &&
          variant === 'program' &&
          'bg-palette-success text-palette-success-foreground hover:bg-palette-success/90',
        status &&
          variant === 'module' &&
          'bg-accent text-accent-foreground hover:bg-accent/90'
      )}
    >
      {status ? (
        <Check className='w-3.5 h-3.5' />
      ) : (
        <X className='w-3.5 h-3.5' />
      )}
      {label}
    </Badge>
  )
}
