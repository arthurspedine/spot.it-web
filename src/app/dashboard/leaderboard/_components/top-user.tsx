import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { UserLeaderboard } from '@/types/user-leaderboard'
import Image from 'next/image'
import { tv } from 'tailwind-variants'
import type { VariantProps } from 'tailwind-variants'

const topPlacement = tv({
  variants: {
    top: {
      default: 'size-16 border-2 border-red-400',
      one: 'size-28 border-4 border-red-900',
      two: 'size-[74px] border-2 border-red-600',
    },
  },
  defaultVariants: {
    top: 'default',
  },
})

export function TopPlacementUser({
  profile_picture,
  username,
  score,
  top,
  placement,
}: UserLeaderboard &
  VariantProps<typeof topPlacement> & { placement: number }) {
  const placementSize = placement === 1 ? '5' : placement === 2 ? '4' : '3'

  return (
    <div className='flex flex-col items-center mb-2'>
      <Avatar className={topPlacement({ top })}>
        <AvatarImage src={profile_picture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div
        className={`size-4 flex items-center justify-center bg-primary p-${placementSize} rounded-full mt-[-15px] z-10`}
      >
        <p className='mr-[1px]'>{placement}</p>
      </div>
      <div className='text-xs text-center mt-3'>
        <p className='font-bold my-1'>@{username}</p>
        <p className='flex items-center justify-center gap-1'>
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
  )
}
