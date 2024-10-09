import type { UserLeaderboard } from '@/types/user-leaderboard'
import Image from 'next/image'

export function NormalPlacementUser({
  profile_picture,
  username,
  score,
  placement,
}: UserLeaderboard & { placement: number }) {
  const formattedPlacement = placement < 10 ? `0${placement}` : placement

  return (
    <div className='flex py-3 items-center gap-8 shadow-md rounded-xl px-4 bg-stone-50'>
      <p className='font-bold text-3xl'>{formattedPlacement}</p>
      <div className='flex items-center gap-4'>
        <Image
          src='http://via.placeholder.com/64x64'
          width={64}
          height={64}
          alt='avatar'
          className='rounded-full'
        />
        <div className='flex flex-col gap-1 items-start'>
          <p className='font-semibold'>{username}</p>
          <p className='text-sm flex items-center justify-center gap-1'>
            <Image
              src='http://via.placeholder.com/64x64'
              width={16}
              height={16}
              alt='points'
              className='rounded-full'
            />{' '}
            {score}
          </p>
        </div>
      </div>
    </div>
  )
}
