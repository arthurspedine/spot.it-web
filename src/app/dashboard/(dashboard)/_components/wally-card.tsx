'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Camera, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface WallyCardProps {
  id: string
  name: string
  profilePicture: string
  encounters: number
}

export function WallyCard({
  id,
  name,
  profilePicture,
  encounters,
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
      <div className='flex items-center gap-4'>
        <Avatar className='size-16 border border-primary'>
          <AvatarImage src={profilePicture} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className='gap-2.5'>
          <h2>{name}</h2>
          <p className='flex gap-1.5 items-center ml-auto'>
            <Search className='size-4' />
            <span>{encounters}</span>
          </p>
        </div>

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
