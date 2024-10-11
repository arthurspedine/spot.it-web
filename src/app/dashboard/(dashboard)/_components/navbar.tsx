'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Crown, House, User } from 'lucide-react'
import type { ReactNode } from 'react'

interface INavbarItem {
  id: number
  icon: ReactNode
  title: string
  url: string
}

export interface NavbarProps {
  navbarItems: INavbarItem[]
}

const navbarItems = [
  {
    id: 1,
    icon: <Crown />,
    title: 'Placar',
    url: '/dashboard/leaderboard',
  },
  {
    id: 2,
    icon: <House />,
    title: 'Início',
    url: '/dashboard',
  },
  {
    id: 3,
    icon: <User />,
    title: 'Perfil',
    url: '/dashboard/profile',
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className='flex max-h-fit justify-around bg-popover border-t py-2.5'>
      {navbarItems.map(item => (
        <Link
          href={item.url}
          key={item.id}
          className={`flex flex-col items-center gap-0.5 px-4 py-4 ${pathname === item.url ? 'bg-primary' : ''} transition-all duration-300 rounded-xl`}
        >
          <span>{item.icon}</span>
          {/* <span className={'text-xs'}>{item.title}</span> */}
        </Link>
      ))}
    </nav>
  )
}
