import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

type UserProfile = {
  profile_picture: string
  name: string
  username: string
  email: string
  score: number
}

export default function Profile() {
  const { profile_picture, name, username, email, score }: UserProfile = {
    profile_picture: '',
    name: 'Arthur Spedine',
    username: 'spedinearthur',
    email: 'spedinearthur@gmail.com',
    score: 42,
  }
  return (
    <main className='flex flex-col flex-grow min-h-screen'>
      <h1 className='text-center font-semibold text-2xl py-5'>Profile</h1>
      <div className='p-5 text-sm'>
        <Avatar className='size-40 m-auto mb-4'>
          <AvatarImage src={profile_picture} />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div>
          <h2>{name}</h2>
          <p className='text-xs text-muted-foreground'>@{username}</p>
          <p>{email}</p>
          <p>Pontos: {score}</p>

          <div className='mt-4 flex flex-col gap-2'>
            <h3 className='text-center text-xl'>Últimas capturas</h3>

            <div className='flex flex-wrap items-center justify-center gap-2 w-full pb-20'>
              <div className='bg-background flex py-3 items-center gap-4 rounded-xl px-4 border border-border w-64'>
                <Avatar className='size-16'>
                  <AvatarImage src={profile_picture} />
                  <AvatarFallback>TE</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-1 items-start'>
                  <p className='font-medium'>Teste</p>
                  <p className='text-xs flex'>Horário: 15:32:43</p>
                </div>
              </div>

              <div className='bg-background flex py-3 items-center gap-4 rounded-xl px-4 border border-border w-64'>
                <Avatar className='size-16'>
                  <AvatarImage src={profile_picture} />
                  <AvatarFallback>TE</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-1 items-start'>
                  <p className='font-medium'>Teste</p>
                  <p className='text-xs flex'>Horário: 15:32:43</p>
                </div>
              </div>
              <div className='bg-background flex py-3 items-center gap-4 rounded-xl px-4 border border-border w-64'>
                <Avatar className='size-16'>
                  <AvatarImage src={profile_picture} />
                  <AvatarFallback>TE</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-1 items-start'>
                  <p className='font-medium'>Teste</p>
                  <p className='text-xs flex'>Horário: 15:32:43</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
