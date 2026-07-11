import { cn } from '@/lib/utils'

type ContainerProps = React.ComponentProps<'div'> & {
  size?: 'default' | 'narrow' | 'wide'
}

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
}

export function Container({
  className,
  size = 'default',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-6 md:px-8', sizes[size], className)}
      {...props}
    />
  )
}
