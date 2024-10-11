import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Search } from 'lucide-react'
import { WallyCard } from './_components/wally-card'

const leaderboard = [
  {
    id: '1',
    name: 'Sky Walker',
    profilePicture: '/example.com/profile1.jpg',
    score: 98,
  },
  {
    id: '2',
    name: 'Pixel Ninja',
    profilePicture: '/example.com/profile2.jpg',
    score: 92,
  },
  {
    id: '3',
    name: 'Astro Coder',
    profilePicture: '/example.com/profile3.jpg',
    score: 88,
  },
  {
    id: '4',
    name: 'Quantum Flare',
    profilePicture: '/example.com/profile4.jpg',
    score: 85,
  },
  {
    id: '5',
    name: 'Techno Scribe',
    profilePicture: '/example.com/profile5.jpg',
    score: 82,
  },
  {
    id: '6',
    name: 'Neon Shadow',
    profilePicture: '/example.com/profile6.jpg',
    score: 79,
  },
  {
    id: '7',
    name: 'Binary Blade',
    profilePicture: '/example.com/profile7.jpg',
    score: 75,
  },
  {
    id: '8',
    name: 'Cosmic Whiz',
    profilePicture: '/example.com/profile8.jpg',
    score: 70,
  },
  {
    id: '9',
    name: 'Data Surge',
    profilePicture: '/example.com/profile9.jpg',
    score: 65,
  },
  {
    id: '10',
    name: 'Hacker Hero',
    profilePicture: '/example.com/profile10.jpg',
    score: 60,
  },
  {
    id: '11',
    name: 'Megatron',
    profilePicture: 'idk',
    score: 58,
  },
]

export default function Dashboard() {
  return (
    <main className='flex-grow w-full p-4 overflow-x-hidden'>
      <h1 className='text-xl font-bold'>Perdidos</h1>
      <div className='w-full'>
        {leaderboard.map(wally => (
          <WallyCard
            key={wally.id}
            id={wally.id}
            name={wally.name}
            profilePicture={wally.profilePicture}
            score={wally.score}
          />
        ))}
      </div>
    </main>
  )
}
