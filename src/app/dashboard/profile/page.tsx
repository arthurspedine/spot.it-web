import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
      <div className='px-10 py-5 text-sm'>
        <Avatar className='size-40 mb-4'>
          <AvatarImage src={profile_picture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <p>Nome: {name}</p>
        <p>Nome de usuário: {username}</p>
        <p>Email: {email}</p>
        <p>Pontos: {score}</p>
      </div>
    </main>
  )
}
