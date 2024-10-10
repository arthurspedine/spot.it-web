'use client'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { grey } from '@mui/material/colors'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function UserMenu() {
  const pathname = usePathname()

  const dashboardPath = '/dashboard'

  return (
    <nav className='fixed bottom-0 w-full bg-background py-3 border-t-2 border-border'>
      <ul className='flex justify-evenly items-center list-none'>
        <li
          className={`p-2.5 rounded-full ${
            pathname === `${dashboardPath}`
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground'
          }`}
        >
          <Link href={'/dashboard'}>
            <HomeOutlinedIcon fontSize='large' />
          </Link>
        </li>
        <li
          className={`p-2.5 rounded-full ${
            pathname === `${dashboardPath}/leaderboard`
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground'
          }`}
        >
          <Link href={'/dashboard/leaderboard'}>
            <LeaderboardOutlinedIcon fontSize='large' />
          </Link>
        </li>
        <li
          className={`p-2.5 rounded-full ${
            pathname === `${dashboardPath}/profile`
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground'
          }`}
        >
          <Link href={'/dashboard/profile'}>
            <PersonOutlineIcon fontSize='large' />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
