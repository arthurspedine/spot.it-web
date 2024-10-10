import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { UserLeaderboard } from '@/types/user-leaderboard'
import Image from 'next/image'

export function NormalPlacementUser({
  profile_picture,
  username,
  score,
  placement,
}: UserLeaderboard & { placement: number }) {
  const formattedPlacement = placement < 10 ? `00${placement}` : placement

  return (
    <div className='flex py-3 items-center gap-4 rounded-xl px-4 bg-background border border-border'>
      <p className='font-bold text-xl min-w-10 text-center'>
        {formattedPlacement}
      </p>
      <div className='flex items-center gap-4'>
        <Avatar className='size-14'>
          <AvatarImage src={profile_picture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-1 items-start'>
          <p className='font-semibold'>{username}</p>
          <p className='text-sm flex items-center justify-center gap-1'>
            <Image
              src='http://via.placeholder.com/16x16'
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
