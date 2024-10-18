'use client'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { clientEnv } from '@/env'
import { api } from '@/lib/axios'
import type { WallyRole } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, UserCog } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { getRoleColor } from './get-role-color'
import { RoleList } from './role-list'

const wallySignUpSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(50, 'O nome deve ter no máximo 50 caracteres.'),
  email: z
    .string()
    .email('Formato de email inválido.')
    .max(100, 'O email deve ter no máximo 100 caracteres.'),
})

type WallySignUpSchema = z.infer<typeof wallySignUpSchema>

async function getWallyRoles(): Promise<WallyRole[]> {
  const rolesResponse = await fetch(
    `${clientEnv.NEXT_PUBLIC_BACKEND_URL}/wally/role`
  )
  const data = await rolesResponse.json()

  return data
}

export function WallySignUpForm() {
  const { register, handleSubmit, formState } = useForm<WallySignUpSchema>({
    resolver: zodResolver(wallySignUpSchema),
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [roles, setRoles] = useState<WallyRole[]>([])
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<WallyRole | null>()

  useEffect(() => {
    getWallyRoles().then(setRoles)
  }, [])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setIsDialogOpen(true)
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
  }

  const handleConfirmImage = () => {
    setIsDialogOpen(false)
  }

  async function handleSignUp(data: WallySignUpSchema) {
    if (!selectedImage) {
      return toast.error('Nenhuma foto selecionada.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
    }

    if (!selectedRole) {
      return toast.error('Nenhum cargo selecionado.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
    }

    const signUpForm = new FormData()
    signUpForm.append('name', data.name)
    signUpForm.append('email', data.email)
    signUpForm.append('profilePicture', selectedImage)
    signUpForm.append('role', selectedRole.role)

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
              onChange={handleImageChange}
            />
            {selectedImage ? (
              <div>{selectedImage.name}</div>
            ) : (
              <Camera className='size-6' />
            )}
          </div>
        </Button>
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='role' className='font-bold text-sm'>
          Cargo
        </Label>
        <Drawer
          open={isRoleSelectionOpen}
          onOpenChange={setIsRoleSelectionOpen}
        >
          <DrawerTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start py-5 px-2'
            >
              {selectedRole ? (
                <div className='flex justify-between w-full items-center'>
                  <span>{selectedRole.role}</span>
                  <span
                    className={`${getRoleColor(selectedRole.id)} px-2 py-1 rounded-md font-semibold`}
                  >
                    {selectedRole.scoreMultiplier}
                  </span>
                </div>
              ) : (
                <div className='flex gap-2 items-center text-muted-foreground'>
                  <UserCog className='size-6' />
                  <span>Adicionar cargo</span>
                </div>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <RoleList
              roles={roles}
              setOpen={setIsRoleSelectionOpen}
              setSelectedRole={setSelectedRole}
            />
          </DrawerContent>
        </Drawer>
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
