import { WallySignUpForm } from "./_components/wally-sign-up-form";

export default function WallySignUpPage() {
  return (
    <main className='flex flex-col flex-grow items-center justify-center py-2 px-4 gap-3 h-screen'>
      <h1 className='text-red-700 text-2xl font-semibold text-center'>
        spot.it
      </h1>

      <WallySignUpForm />
    </main>
  )
}