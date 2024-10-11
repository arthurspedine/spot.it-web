'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(50, 'O nome deve ter no máximo 50 caracteres.'),
  username: z
    .string()
    .min(3, 'O username deve ter pelo menos 3 caracteres.')
    .max(20, 'O username deve ter no máximo 20 caracteres.')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'O username deve conter apenas letras, números e sublinhados.'
    ),
  email: z
    .string()
    .email('Formato de email inválido.')
    .max(100, 'O email deve ter no máximo 100 caracteres.'),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .max(128, 'A senha deve ter no máximo 128 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
    .regex(
      /[^A-Za-z0-9]/,
      'A senha deve conter pelo menos um caractere especial.'
    ),
  profilePicture: z
    .instanceof(File, { message: 'Selecione ao menos uma foto.' })
    .array()
    .refine(
      file => ['image/jpeg', 'image/png'].includes(file[0]?.type),
      'Apenas imagens .jpg, .jpeg or .png são permitidas.'
    ),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()

  const { register, handleSubmit, formState } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  function handleSignUp(data: SignUpSchema) {
    console.log(data)
  }

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className='flex flex-col gap-3 w-4/5'
    >
      <div className='space-y-1'>
        <Label htmlFor='name' className='font-bold text-sm'>
          Full name
        </Label>
        <Input
          id='name'
          type='text'
          placeholder='Rafael Ronqui'
          {...register('name')}
        />
        {formState.errors.name && (
          <p className='text-destructive'>{formState.errors.name.message}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor='username' className='font-bold text-sm'>
          Username
        </Label>
        <Input
          id='username'
          type='text'
          placeholder='@rafaronqui'
          {...register('username')}
        />
        {formState.errors.username && (
          <p className='text-destructive'>
            {formState.errors.username.message}
          </p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor='email' className='font-bold text-sm'>
          Email
        </Label>
        <Input
          id='email'
          type='text'
          placeholder='exemplo@exemplo.com'
          {...register('email')}
        />
        {formState.errors.email && (
          <p className='text-destructive'>{formState.errors.email.message}</p>
        )}
      </div>
      <div className='space-y-1'>
        <Label htmlFor='password' className='font-bold text-sm'>
          Senha
        </Label>
        <Input
          id='password'
          type='password'
          placeholder='********'
          {...register('password')}
        />
        {formState.errors.password && (
          <p className='text-destructive'>
            {formState.errors.password.message}
          </p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor='profilePicture' className='font-bold text-sm'>
          Foto de perfil
        </Label>
        <Input
          id='profilePicture'
          type='file'
          {...register('profilePicture')}
        />
        {formState.errors.profilePicture && (
          <p className='text-destructive'>
            {formState.errors.profilePicture.message}
          </p>
        )}
      </div>

      <Button size={'sm'} type='submit' className='bg-red-700 hover:bg-red-800'>
        Cadastrar
      </Button>
    </form>
  )
}
