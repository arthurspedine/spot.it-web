import type { UserLeaderboard } from '@/types/user-leaderboard'
import Image from 'next/image'
import { tv } from 'tailwind-variants'
import type { VariantProps } from 'tailwind-variants'

const topPlacement = tv({
  variants: {
    top: {
      default: 'bg-blue-400 min-h-20',
      one: 'bg-red-600 min-h-[144px]',
      two: 'bg-blue-700 min-h-28',
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
  return (
    <div className='w-full max-w-[73px] text-center'>
      <div className='flex flex-col items-center mb-2'>
        <Image
          src='http://via.placeholder.com/64x64'
          width={64}
          height={64}
          alt='avatar'
          className='rounded-full'
        />
        <p className='text-sm flex items-center justify-center gap-1 mt-1'>
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
      <div
        className={`${topPlacement({ top })} px-6 rounded-t-[24px] max-w-[73px]`}
      >
        <p className='text-3xl font-semibold pt-2'>{placement}</p>
      </div>
    </div>
  )
}
