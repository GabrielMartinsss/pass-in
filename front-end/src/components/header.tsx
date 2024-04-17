import uniteIcon from '../assets/unite-icon.svg'
import { NavLink } from './nav-link'

export function Header() {
  return (
    <header className="flex items-center gap-5 py-2">
      <img src={uniteIcon} alt="Unite" />

      <nav className="flex items-center gap-5">
        <NavLink href="/events" className="text-zinc-400">
          Events
        </NavLink>
        <NavLink href="/attendees">Attendees</NavLink>
      </nav>
    </header>
  )
}
