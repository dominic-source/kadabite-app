import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-orange-500',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'font-poppins font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'font-poppins font-semibold text-white bg-secondary hover:bg-white hover:text-black transition duration-200 focus:outline-none',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primary:
          'font-poppins font-semibold text-white bg-primary hover:bg-black hover:text-white transition duration-200 focus:outline-none',
      },
      size: {
        default: 'h-8 min-[500px]:h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        md: 'w-[154px] h-[54px] rounded-[30px] py-2 text-[16px]',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-16 rounded-md py-2 px-4 text-base',
        icon: 'size-8 min-[500px]:size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProperties
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProperties>(
  ({ className, variant, size, asChild = false, ...properties }, reference) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={reference}
        {...properties}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
