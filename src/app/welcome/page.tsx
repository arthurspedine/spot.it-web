import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function WelcomePage() {
  return (
    <main className='flex flex-col flex-grow bg-background w-full px-4 py-4 gap-4 h-[calc(100dvh)]'>
      <h1 className='text-xl font-semibold text-center'>
        Conheça mais sobre o <span className='text-primary'>spot.it</span>
      </h1>
      <div className='flex flex-col flex-grow gap-4'>
        <div className='border p-4 rounded-lg'>
          <h2 className='text-lg'>Procure os perdidos</h2>
          <p className='text-muted-foreground'>
            Tire selfies com pessoas perdidas e ganhe pontos com base nos níveis
            delas. Se você for o primeiro a encontrá-las, a recompensa é ainda
            maior: você recebe o dobro dos pontos que a pessoa vale! Quanto mais
            raras as pessoas, maior a pontuação!
          </p>
        </div>
        <div className='border p-4 rounded-lg'>
          <h2 className='text-lg'>Salve seus encontros localmente</h2>
          <p className='text-muted-foreground'>
            Depois de um encontro bem-sucedido, a foto ficará disponível no seu
            perfil. Você poderá acessá-la a qualquer momento, salvar no seu
            dispositivo e compartilhar em suas redes sociais!
          </p>
        </div>
      </div>
      <p className='text-foreground text-sm text-center'>
        {' '}
        Não perca essa oportunidade e participe dessa divertida caçada!
      </p>
      <Button asChild>
        <Link href={'/dashboard'}>Entrar</Link>
      </Button>
    </main>
  )
}
