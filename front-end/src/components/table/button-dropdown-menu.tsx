import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CheckCircle, MoreHorizontal, SquareX, Trash2 } from 'lucide-react'
import { ComponentPropsWithRef, MouseEvent } from 'react'

interface ButtonDropdownMenuProps extends ComponentPropsWithRef<'button'> {}

export function ButtonDropdownMenu({ id, ...props }: ButtonDropdownMenuProps) {
  async function handleCheckIn(ev: MouseEvent<HTMLButtonElement>) {
    const attendeeId = ev.currentTarget.id

    try {
      await fetch(`http://localhost:3333/attendees/${attendeeId}/check-in`)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleUncheckIn(ev: MouseEvent<HTMLButtonElement>) {
    const attendeeId = ev.currentTarget.id

    try {
      await fetch(`http://localhost:3333/attendees/${attendeeId}/uncheck-in`, {
        method: 'DELETE',
      })
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCancelRegistration(ev: MouseEvent<HTMLButtonElement>) {
    const attendeeId = ev.currentTarget.id

    try {
      await fetch(
        `http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees/${attendeeId}`,
        {
          method: 'DELETE',
        },
      )
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button {...props} className="border border-white/10 rounded-md p-1.5">
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-zinc-900 p-2 rounded-md space-y-3"
          sideOffset={5}
        >
          <DropdownMenu.Item className="text-white">
            <button
              id={id}
              onClick={handleCheckIn}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-700 rounded-md text-sm hover:bg-green-600 w-full"
            >
              <CheckCircle size={16} />
              check-in
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item>
            <button
              id={id}
              onClick={handleUncheckIn}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 rounded-md text-sm hover:bg-zinc-600 w-full"
            >
              <SquareX size={16} />
              uncheck-in
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item>
            <button
              id={id}
              onClick={handleCancelRegistration}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-700 rounded-md text-sm hover:bg-red-600 w-full"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
