import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/helpers/get-initials'
import { Search } from 'lucide-react'

type UserProfile = {
  profilePicture: string
  name: string
  username: string
  email: string
  score: number
}

export default function Profile() {
  const { profilePicture, name, username, email, score }: UserProfile = {
    profilePicture: 'https://github.com/arthurspedine.png',
    name: 'Arthur Spedine',
    username: 'spedinearthur',
    email: 'spedinearthur@gmail.com',
    score: 0,
  }
  return (
    <main className='flex flex-col flex-grow h-full gap-10 w-full p-4'>
      <div className='flex'>
        {/* Colocar botoes mais pra frente */}
        <h1 className='font-semibold'>@{username}</h1>
      </div>
      <div className='flex justify-start items-center gap-8 px-4'>
        <Avatar className='size-20'>
          <AvatarImage src={profilePicture} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-semibold'>{name}</h2>
          <p className='text-sm text-muted-foreground'>{email}</p>
        </div>
      </div>
      <div className='pt-2 px-4 flex flex-col gap-2'>
        <div className='flex justify-between'>
          <h2 className='text-xl'>Encontros</h2>
          <p className='flex gap-1.5 items-center ml-auto'>
            <Search className='size-4' />
            <span>{score}</span>
          </p>
        </div>
        <Separator />
      </div>
    </main>
  )
}
