import Image from 'next/image'
import { LoginForm } from './_components/login-form'
import logo from '@/resources/spot-it.png'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className='flex flex-col flex-grow items-center justify-start py-32 px-4 gap-8 h-screen'>
      <Image
        src={logo}
        alt='Logo spot.it'
        className='w-52 antialiased'
        quality={100}
      />
      <div className='w-full flex flex-col items-center gap-4'>
        <LoginForm />

        <p className='text-sm text-muted-foreground'>
          Ainda não tem uma conta?{' '}
          <Link
            href={'/welcome'}
            className='font-bold text-card-foreground hover: cursor-pointer'
          >
            Saiba mais
          </Link>
        </p>
      </div>
    </main>
  )
}
