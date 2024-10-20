'use client'

import { getRoleColor } from '@/app/auth/wally/signup/_components/get-role-color'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { getInitials } from '@/helpers/get-initials'
import { handleEncounter } from '@/http/handle-encounter'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import clsx from 'clsx'
import { Camera, Check, Search, User, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface WallyCardProps {
  id: string
  name: string
  profilePicture: string
  encounters: number
  hasEncountered: boolean
  role: {
    name: string
    scoreMultiplier: number
  }
}

export function WallyCard({
  id,
  name,
  profilePicture,
  encounters,
  hasEncountered,
  role,
}: WallyCardProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setIsDialogOpen(true)
    }
  }

  const handleSendImage = () => {
    if (!selectedImage) {
      return toast.error('Nenhuma foto selecionada.')
    }

    const encounterData = new FormData()
    encounterData.append('wallyId', id)
    encounterData.append('encounterPicture', selectedImage)

    const encounterRequest = handleEncounter(encounterData)

    setIsDialogOpen(false)
    setSelectedImage(null)

    toast.promise(encounterRequest, {
      loading: 'Aguardando validação...',
      success: () => {
        router.refresh()
        return 'Encontro registrado com sucesso.'
      },
      error: 'Algo deu errado ao registrar o encontro.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
  }

  return (
    <div className='w-full px-2 py-4'>
      <div
        className={clsx(
          'flex gap-4 bg-card border rounded-md overflow-hidden',
          {
            'border-amber-700': encounters === 0,
            'border-border': encounters > 0,
          }
        )}
      >
        <div className='relative w-32'>
          <Avatar>
            <AvatarImage src={profilePicture} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
            <span
              className={clsx(
                'text-sm bg-border absolute px-2 rounded-tr-lg font-semibold left-0 bottom-0',
                {
                  'bg-amber-700': encounters === 0,
                }
              )}
            >
              x {role.scoreMultiplier * (encounters === 0 ? 2 : 1)}
            </span>
          </Avatar>
        </div>
        <div className='py-2 pr-2 flex-grow flex flex-col justify-between'>
          <div className='space-y-0.5'>
            <h2 className='break-words text-lg font-semibold'>{name}</h2>
            <p className='flex gap-1.5 items-center text-muted-foreground'>
              <span>{role.name}</span>
            </p>
          </div>
          <div className='flex'>
            <p className='flex gap-1.5 items-center text-muted-foreground'>
              <Search className='size-4' />
              <span>{`${encounters} ${encounters === 1 ? 'vez' : 'vezes'}`}</span>
            </p>
            {hasEncountered ? (
              <Check className='size-7 ml-auto mr-2' />
            ) : (
              <Button asChild className='ml-auto'>
                <div className='relative'>
                  <Input
                    type='file'
                    accept='image/*'
                    capture='environment'
                    className='absolute inset-0 opacity-0 cursor-pointer'
                    onChange={handleImageChange}
                  />
                  <Camera className='size-6' />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent side={'bottom'} className='flex flex-col gap-4'>
          <SheetHeader>
            <SheetTitle className='text-left'>
              Confirmar envio de imagem
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
              <Button className='w-full' onClick={handleSendImage}>
                Enviar
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
