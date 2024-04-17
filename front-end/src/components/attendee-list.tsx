import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Trash2,
} from 'lucide-react'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import { ButtonDropdownMenu } from './table/button-dropdown-menu'

dayjs.extend(relativeTime)

interface Attendee {
  id: string
  name: string
  email: string
  createdAt: string
  checkedInAt: string | null
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }
    return ''
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }
    return 1
  })

  const [totalAttendees, setTotalAttendees] = useState(0)
  const [attendees, setAttendees] = useState<Attendee[]>([])

  const [checkedAttendees, setCheckedAttendees] = useState<string[]>([])

  const totalPages = Math.ceil(totalAttendees / 10)

  useEffect(() => {
    const url = new URL(
      'http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees',
    )
    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAttendees(data.attendees)
        setTotalAttendees(data.total)
      })
  }, [page, search])

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url)

    setPage(page)
  }

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    window.history.pushState({}, '', url)

    setSearch(search)
  }

  function onSearchInputChanged(ev: ChangeEvent<HTMLInputElement>) {
    setCurrentPage(1)
    setCurrentSearch(ev.target.value)
  }

  function handleCheckboxClick(ev: ChangeEvent<HTMLInputElement>) {
    const inputId = ev.target.id
    const isChecked = ev.target.checked

    if (isChecked) {
      setCheckedAttendees((state) => [...state, inputId])
    } else {
      setCheckedAttendees(checkedAttendees.filter((id) => id !== inputId))
    }
  }

  async function cancelManyAttendeesRegistration(ids: string[]) {
    try {
      await Promise.all(
        ids.map((id) => {
          return fetch(
            `http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees/${id}`,
            {
              method: 'DELETE',
            },
          )
        }),
      )

      window.location.reload()
    } catch (error) {
      console.log('An error occurred. ' + error)
    }
  }

  async function makeCheckInManyAttendees(ids: string[]) {
    try {
      await Promise.all(
        ids.map((id) => {
          return fetch(`http://localhost:3333/attendees/${id}/check-in`)
        }),
      )

      window.location.reload()
    } catch (error) {
      console.log('An error occurred. ' + error)
    }
  }

  function handleFirstPage() {
    setCurrentPage(1)
    setCheckedAttendees([])
  }
  function handlePreviousPage() {
    setCurrentPage(page - 1)
    setCheckedAttendees([])
  }
  function handleNextPage() {
    setCurrentPage(page + 1)
    setCheckedAttendees([])
  }
  function handleLastPage() {
    setCurrentPage(totalPages)
    setCheckedAttendees([])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Attendees</h1>

        <div className="px-3 py-1.5 border border-white/10 rounded-lg text-sm w-72 flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChanged}
            value={search}
            type="text"
            placeholder="Search for attendees..."
            className="flex-1 bg-transparent outline-none p-0 border-0 text-sm focus:ring-0"
          />
        </div>

        {checkedAttendees.length > 0 && (
          <div className="flex gap-3 ml-auto">
            <button
              onClick={() => cancelManyAttendeesRegistration(checkedAttendees)}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-700 rounded-md text-sm hover:bg-red-600"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={() => makeCheckInManyAttendees(checkedAttendees)}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-700 rounded-md text-sm hover:bg-green-600"
            >
              <CheckCircle size={16} />
              Make check-in
            </button>
          </div>
        )}
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 64 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHeader>
            <TableHeader>Code</TableHeader>
            <TableHeader>Attendees</TableHeader>
            <TableHeader>Registration date</TableHeader>
            <TableHeader>Check-in date</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>

        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id} id={attendee.id}>
                <TableCell>
                  <input
                    onChange={handleCheckboxClick}
                    id={attendee.id}
                    type="checkbox"
                    data-state="unchecked"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email.toLowerCase()}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Did not checked-in</span>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <ButtonDropdownMenu id={attendee.id} key={attendee.id} />
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>

        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Showing {attendees.length} of {totalAttendees} items
            </TableCell>
            <TableCell colSpan={3} className="text-right">
              <div className="inline-flex gap-8 items-center">
                <span>
                  Page {page} of {totalPages}
                </span>

                <div className="flex gap-1.5">
                  <IconButton onClick={handleFirstPage} disabled={page <= 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={handlePreviousPage} disabled={page <= 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={handleLastPage}
                    disabled={page >= totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
