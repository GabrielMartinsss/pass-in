import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TableCellProps extends ComponentProps<'td'> {}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      {...props}
      className={twMerge('py-3 px-4 text-sm text-zinc-300', className)}
    />
  )
}
