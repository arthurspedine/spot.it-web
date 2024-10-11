'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { clientEnv } from '@/env'
import { toast } from 'sonner'
import { useState } from 'react'
import { Camera } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Image from 'next/image'

const wallySignUpSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(50, 'O nome deve ter no máximo 50 caracteres.'),
  email: z
    .string()
    .email('Formato de email inválido.')
    .max(100, 'O email deve ter no máximo 100 caracteres.'),
  profilePicture: z
    .custom<FileList>(file => file instanceof FileList)
    .refine(
      file => file !== null && file.length > 0,
      'É necessário selecionar uma imagem.'
    ),
  role: z.string().min(3, 'O cargo deve ter ao menos 3 caracteres.'),
})

type WallySignUpSchema = z.infer<typeof wallySignUpSchema>

export function WallySignUpForm() {
  const { register, handleSubmit, formState } = useForm<WallySignUpSchema>({
    resolver: zodResolver(wallySignUpSchema),
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setIsDialogOpen(true)
    }

    register('profilePicture').onChange({
      target: { files: event.target.files },
    })
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
  }

  const handleConfirmImage = () => {
    setIsDialogOpen(false)
  }

  async function handleSignUp(data: WallySignUpSchema) {
    const signUpForm = new FormData()
    signUpForm.append('name', data.name)
    signUpForm.append('email', data.email)
    signUpForm.append('profilePicture', data.profilePicture[0]) // taking the only image from the FileList
    signUpForm.append('role', data.role)
    
    const signUpRequest = api.post(
      `${clientEnv.NEXT_PUBLIC_BACKEND_URL}/wally/register`,
      signUpForm
    )
    
    toast.promise(signUpRequest, {
      loading: 'Cadastrando wally...',
      success: 'Wally cadastrado com sucesso.',
      error: 'Algo deu errado ao cadastrar o wally.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
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
        <Label htmlFor='profilePicture' className='font-bold text-sm'>
          Foto de perfil
        </Label>
        <Button asChild>
          <div className='relative w-full bg-red-700 hover:bg-red-800'>
            <Input
              id='profilePicture'
              type='file'
              accept='image/*'
              capture='environment'
              className='absolute inset-0 opacity-0 cursor-pointer'
              {...register('profilePicture')}
              onChange={handleImageChange}
            />
            {selectedImage ? (
              <div>{selectedImage.name}</div>
            ) : (
              <Camera className='size-6' />
            )}
          </div>
        </Button>

        {formState.errors.profilePicture && (
          <p className='text-destructive'>
            {formState.errors.profilePicture.message}
          </p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor='role' className='font-bold text-sm'>
          Cargo
        </Label>
        <Input id='role' type='text' placeholder='Rare' {...register('role')} />
        {formState.errors.role && (
          <p className='text-destructive'>{formState.errors.role.message}</p>
        )}
      </div>

      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent side={'bottom'} className='flex flex-col gap-4'>
          <SheetHeader>
            <SheetTitle className='text-left'>
              Confirmar foto de perfil
            </SheetTitle>
            <SheetDescription className='text-left'>
              Tem certeza de que deseja enviar essa imagem?
            </SheetDescription>
          </SheetHeader>
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt='Pré-visualização da imagem'
              className='w-full rounded-lg'
            />
          )}
          <SheetFooter>
            <div className='flex gap-2'>
              <Button
                className='w-full'
                variant='outline'
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button className='w-full' onClick={handleConfirmImage}>
                Enviar
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Button size={'sm'} type='submit' className='bg-red-700 hover:bg-red-800'>
        Cadastrar
      </Button>
    </form>
  )
}
