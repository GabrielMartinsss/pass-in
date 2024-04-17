import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface NavLinkProps extends ComponentProps<'a'> {}

export function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <a {...props} className={twMerge('text-sm font-medium', className)}>
      {props.children}
    </a>
  )
}
