import type { UserLeaderboard } from '@/types/user-leaderboard'
import Image from 'next/image'
import { TopPlacementUser } from './_components/top-user'
import { NormalPlacementUser } from './_components/normal-user'

export default function Leaderboard() {
  const leaderboard: UserLeaderboard[] = [
    {
      profile_picture: '/example.com/profile1.jpg',
      username: 'sky_walker92',
      score: 98,
    },
    {
      profile_picture: '/example.com/profile2.jpg',
      username: 'pixelNinja87',
      score: 92,
    },
    {
      profile_picture: '/example.com/profile3.jpg',
      username: 'astro_coder',
      score: 88,
    },
    {
      profile_picture: '/example.com/profile4.jpg',
      username: 'quantumFlare',
      score: 85,
    },
    {
      profile_picture: '/example.com/profile5.jpg',
      username: 'techno_scribe',
      score: 82,
    },
    {
      profile_picture: '/example.com/profile6.jpg',
      username: 'neon_shadow',
      score: 79,
    },
    {
      profile_picture: '/example.com/profile7.jpg',
      username: 'binary_blade',
      score: 75,
    },
    {
      profile_picture: '/example.com/profile8.jpg',
      username: 'cosmicWhiz',
      score: 70,
    },
    {
      profile_picture: '/example.com/profile9.jpg',
      username: 'data_surge',
      score: 65,
    },
    {
      profile_picture: '/example.com/profile10.jpg',
      username: 'hacker_hero',
      score: 60,
    },
    {
      profile_picture: 'idk',
      username: 'megatron',
      score: 58,
    },
  ]

  return (
    <main className='flex flex-col flex-grow min-h-screen bg-background mb-16'>
      <div className='flex flex-col min-h-[40vh] justify-between'>
        <h1 className='text-center font-semibold text-2xl py-5'>Leaderboard</h1>
        <div className='flex min-h-full justify-center items-end gap-4'>
          {leaderboard.slice(0, 3).map((user, index) => (
            <TopPlacementUser
              key={user.username}
              {...user}
              top={index === 0 ? 'two' : index === 1 ? 'one' : undefined}
              placement={index === 0 ? 2 : index === 1 ? 1 : 3}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-2 w-full bg-background rounded-t-3xl py-6 pb-8 px-5 flex-grow'>
        {leaderboard.slice(3).map((user, i) => (
          <NormalPlacementUser
            key={user.username}
            {...user}
            placement={i + 3}
          />
        ))}
      </div>
    </main>
  )
}
