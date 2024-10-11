import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { UserCard } from './_components/user-card'

export default function Leaderboard() {
  const leaderboard = [
    {
      id: '1',
      name: 'Sky Walker',
      username: 'sky_walker92',
      profilePicture: '/example.com/profile1.jpg',
      score: 98,
    },
    {
      id: '2',
      name: 'Pixel Ninja',
      username: 'pixelNinja87',
      profilePicture: '/example.com/profile2.jpg',
      score: 92,
    },
    {
      id: '3',
      name: 'Astro Coder',
      username: 'astro_coder',
      profilePicture: '/example.com/profile3.jpg',
      score: 88,
    },
    {
      id: '4',
      name: 'Quantum Flare',
      username: 'quantumFlare',
      profilePicture: '/example.com/profile4.jpg',
      score: 85,
    },
    {
      id: '5',
      name: 'Techno Scribe',
      username: 'techno_scribe',
      profilePicture: '/example.com/profile5.jpg',
      score: 82,
    },
    {
      id: '6',
      name: 'Neon Shadow',
      username: 'neon_shadow',
      profilePicture: '/example.com/profile6.jpg',
      score: 79,
    },
    {
      id: '7',
      name: 'Binary Blade',
      username: 'binary_blade',
      profilePicture: '/example.com/profile7.jpg',
      score: 75,
    },
    {
      id: '8',
      name: 'Cosmic Whiz',
      username: 'cosmicWhiz',
      profilePicture: '/example.com/profile8.jpg',
      score: 70,
    },
    {
      id: '9',
      name: 'Data Surge',
      username: 'data_surge',
      profilePicture: '/example.com/profile9.jpg',
      score: 65,
    },
    {
      id: '10',
      name: 'Hacker Hero',
      username: 'hacker_hero',
      profilePicture: '/example.com/profile10.jpg',
      score: 60,
    },
    {
      id: '11',
      name: 'Megatron',
      username: 'megatron',
      profilePicture: 'idk',
      score: 58,
    },
  ]

  return (
    <main className='flex flex-col flex-grow h-full bg-background w-full p-4 gap-4'>
      <h1 className='text-xl'>Ranking</h1>
      <div className='w-full'>
        {leaderboard.map((user, index) => (
          <div key={user.id}>
            <UserCard
              index={index + 1}
              name={user.name}
              username={user.username}
              profilePicture={user.profilePicture}
              score={user.score}
            />
            {index !== leaderboard.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </main>
  )
}
