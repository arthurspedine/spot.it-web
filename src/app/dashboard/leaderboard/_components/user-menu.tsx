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
  const bgColor = 'bg-red-400'

  return (
    <nav className='fixed bottom-0 w-full bg-white py-3 shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.3)]'>
      <ul className='flex justify-evenly items-center list-none'>
        <li
          className={`p-2.5 rounded-full ${
            pathname === `${dashboardPath}` ? bgColor : ''
          }`}
        >
          <Link href={'/dashboard'}>
            <HomeOutlinedIcon fontSize='large' sx={{ color: grey[800] }} />
          </Link>
        </li>
        <li
          className={`p-2.5 rounded-full ${
            pathname === `${dashboardPath}/leaderboard` ? bgColor : ''
          }`}
        >
          <Link href={'/dashboard/leaderboard'}>
            <LeaderboardOutlinedIcon
              fontSize='large'
              sx={{ color: grey[800] }}
            />
          </Link>
        </li>
        <li
          className={`p-2.5 rounded-full ${
            pathname === `${dashboardPath}/profile` ? bgColor : ''
          }`}
        >
          <Link href={'/dashboard/profile'}>
            <PersonOutlineIcon fontSize='large' sx={{ color: grey[800] }} />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
