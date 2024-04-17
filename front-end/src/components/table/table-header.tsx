import { ComponentProps } from 'react'

export interface TableHeaderProps extends ComponentProps<'th'> {}

export function TableHeader(props: TableHeaderProps) {
  return <th {...props} className="py-3 px-4 text-sm font-semibold text-left" />
}
