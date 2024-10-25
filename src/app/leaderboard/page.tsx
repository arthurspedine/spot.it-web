import { Separator } from '@/components/ui/separator'
import { UserCard } from '../dashboard/(dashboard)/leaderboard/_components/user-card'

interface UserRank {
  id: string
  name: string
  username: string
  profilePicture: string
  score: number
}
export default async function LeaderboardPage() {
  const leaderboardRequest = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/rank`,
    {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const leaderboard: UserRank[] = await leaderboardRequest.json()

  return (
    <main className='flex flex-col flex-grow h-full bg-background w-full px-4 py-4 gap-4'>
      <h1 className='text-xl font-semibold'>Ranking</h1>
      <div className='w-full'>
        {leaderboard.map((user, index) => (
          <div key={user.id}>
            <UserCard
              index={index + 1}
              name={user.name}
              username={user.username}
              profilePicture={user.profilePicture}
              score={user.score}
            />
            {index !== leaderboard.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </main>
  )
}
