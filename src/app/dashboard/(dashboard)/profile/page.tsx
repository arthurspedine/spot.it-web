import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/helpers/get-initials'
import { LogOut, Search } from 'lucide-react'
import { cookies } from 'next/headers'
import { LogoutButton } from './_components/logout-button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

type UserProfile = {
  id: string
  name: string
  username: string
  email: string
  score: number
  encounters: {
    id: string
    occuredAt: string
    wally: { id: string; name: string; role: string }
  }[]
}

export default async function Profile() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/`, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
  })

  const { name, username, email, score, encounters }: UserProfile =
    await data.json()

  return (
    <main className='flex flex-col flex-grow h-full gap-10 w-full p-4'>
      <div className='flex justify-between items-center'>
        {/* Colocar botoes mais pra frente */}
        <h1 className='font-semibold'>@{username}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'ghost'}>
              <LogOut />
            </Button>
          </DialogTrigger>
          <LogoutButton />
        </Dialog>
      </div>
      <div className='flex justify-start items-center gap-8 px-4'>
        <Avatar className='size-20'>
          <AvatarImage src={''} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-semibold'>{name}</h2>
          <p className='text-sm text-muted-foreground'>{email}</p>
        </div>
      </div>
      <div className='pt-2 px-4 flex flex-col gap-2 h-full'>
        <div className='flex justify-between'>
          <h2 className='text-xl'>Encontros</h2>
          <p className='flex gap-1.5 items-center ml-auto'>
            <Search className='size-4' />
            <span>{score}</span>
          </p>
        </div>
        <Separator />
        <div className='h-full flex flex-grow flex-col items-center justify-center'>
          {encounters.length > 0 ? (
            <p>Encontros encontrados!</p>
          ) : (
            <p className='text-muted-foreground text-sm'>
              Você ainda não encontrou ninguem...
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
