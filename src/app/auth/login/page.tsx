import { LoginForm } from './_components/login-form'

export default function LoginPage() {
  return (
    <main className='flex flex-col flex-grow items-center justify-center py-2 px-4 gap-3'>
      <h1 className='text-red-700 text-2xl font-semibold text-center'>
        spot.it
      </h1>
      <p className='text-sm text-stone-700'>
        Por favor, insira seus dados para entrar.
      </p>

      <LoginForm />

      <p className='text-sm text-stone-700'>
        Ainda não tem uma conta?{' '}
        <span className='font-bold text-black hover: cursor-pointer'>
          Registrar-se
        </span>
      </p>
    </main>
  )
}
