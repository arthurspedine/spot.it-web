import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/helpers/get-initials'
import { LogOut, Search } from 'lucide-react'
import { cookies } from 'next/headers'
import { LogoutButton } from './_components/logout-button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { EncounterPicture } from './_components/encounter-picture'

type UserProfile = {
  id: string
  name: string
  username: string
  email: string
  score: number
  profilePicture: string
  encounters: {
    id: string
    occuredAt: string
    encounterPicture: string
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

  const {
    name,
    username,
    email,
    score,
    encounters,
    profilePicture,
  }: UserProfile = await data.json()

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
          <AvatarImage src={profilePicture} />
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
            <span>{encounters.length}</span>
          </p>
        </div>
        <Separator />
        {encounters.length > 0 ? (
          <div className='columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4'>
            {encounters.map(encounter => (
              <div key={encounter.id} className='mb-4 break-inside-avoid'>
                <Sheet>
                  <SheetTrigger>
                    <img
                      className='w-full object-cover rounded-lg'
                      src={encounter.encounterPicture}
                      alt={`Encontro com ${encounter.wally.name}`}
                    />
                  </SheetTrigger>
                  <EncounterPicture
                    occuredAt={encounter.occuredAt}
                    encounterPicture={encounter.encounterPicture}
                    wallyName={encounter.wally.name}
                  />
                </Sheet>
              </div>
            ))}
          </div>
        ) : (
          <div className='h-full flex flex-grow flex-col items-center justify-center'>
            <p className='text-muted-foreground text-sm'>
              Você ainda não encontrou ninguem...
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
