import { WallyCard } from './_components/wally-card'
import { cookies } from 'next/headers'

interface Wally {
  id: string
  name: string
  role: {
    name: string,
    scoreMultiplier: number
  }
  profilePicture: string
  encounters: number
  hasEncountered: boolean
}

export default async function Dashboard() {
  const walliesRequest = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/wally`,
    {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
    }
  )

  const wallies: Wally[] = await walliesRequest.json()

  return (
    <main className='flex-grow w-full p-4 overflow-x-hidden h-full'>
      <h1 className='text-xl font-bold'>Perdidos</h1>
      {wallies.length ? (
        <div className='w-full'>
          {wallies.map(wally => (
            <WallyCard
              key={wally.id}
              id={wally.id}
              name={wally.name}
              profilePicture={wally.profilePicture}
              encounters={wally.encounters}
              hasEncountered={wally.hasEncountered}
              role={wally.role}
            />
          ))}
        </div>
      ) : (
        <div className='h-full flex flex-col justify-center items-center'>
          <p className='text-muted-foreground text-center justify-items-center'>
            Ninguem esta perdido ainda...
          </p>
        </div>
      )}
    </main>
  )
}
