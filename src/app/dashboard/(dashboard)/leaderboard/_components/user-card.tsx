import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/helpers/get-initials'
import { Coins, Star } from 'lucide-react'

interface UserCardProps {
  index: number
  name: string
  username: string
  profilePicture: string
  score: number
}

export function UserCard({
  index,
  name,
  profilePicture,
  username,
  score,
}: UserCardProps) {
  return (
    <div className='flex w-full items-center gap-8 px-2 py-4'>
      <p>{index}</p>
      <div className='flex items-center gap-4'>
        <Avatar className='size-16 border border-primary'>
          <AvatarImage src={profilePicture} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className='leading-snug'>
          <h2>{name}</h2>
          <p className='text-sm text-muted-foreground'>@{username}</p>
        </div>
      </div>
      <p className='flex gap-1.5 items-center ml-auto'>
        <span>{score}</span>
        <Coins className='size-6' />
      </p>
    </div>
  )
}
