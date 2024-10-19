'use client'

import { Button } from '@/components/ui/button'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera } from 'lucide-react'
import { type ChangeEvent, type SyntheticEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  type Crop,
  makeAspectCrop,
} from 'react-image-crop'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  dataURLToBlob,
  setImageCrop,
} from '../../wally/signup/_components/image-crop'
import { resizeImage } from '../../wally/signup/_components/resize-img'

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
})

type SignUpSchema = z.infer<typeof signUpSchema>

const ASPECT_RATIO = 1
const MIN_DIMENSION = 150

export function SignUpForm() {
  const { register, handleSubmit, formState } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  })
  const [uploadedImgSrc, setUploadedImgSrc] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const imageElement = new Image()
      const imageUrl = reader.result?.toString() || ''
      imageElement.src = imageUrl

      imageElement.addEventListener('load', event => {
        const { naturalWidth, naturalHeight } =
          event.currentTarget as HTMLImageElement

        if (naturalHeight < MIN_DIMENSION || naturalWidth < MIN_DIMENSION) {
          toast.error('A imagem deve ser pelo menos 150x150', {
            position: 'top-center',
            style: { filter: 'none', zIndex: 10 },
          })
          return setUploadedImgSrc('')
        }

        setUploadedImgSrc(imageUrl)
        setIsDialogOpen(true)
      })
    })

    reader.readAsDataURL(file)
  }

  function onImageLoad(event: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    )
    const centeredCrop = centerCrop(crop, width, height)
    setCrop(centeredCrop)
  }

  async function handleImageConfirmation() {
    if (!imgRef.current || !canvasRef.current) {
      return toast.error('Algo deu errado ao recortar a imagem', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
    }

    setImageCrop(
      imgRef.current,
      canvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    )

    const dataUrl = canvasRef.current.toDataURL()
    const dataBlob = dataURLToBlob(dataUrl)
    const rawFile = new File([dataBlob], 'user.png', {
      type: 'image/*',
    })

    try {
      const resizedBlob = await resizeImage(rawFile, 512, 512, 0.8)
      if (resizedBlob) {
        const resizedFile = new File([resizedBlob], rawFile.name, {
          type: rawFile.type,
        })
        setSelectedImage(resizedFile)
      }
    } catch (error) {
      toast.error('Erro ao redimensionar a imagem.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
    }

    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
  }

  async function handleSignUp(data: SignUpSchema) {
    if (!selectedImage) {
      return toast.error('Nenhuma foto selecionada.')
    }

    const signUpForm = new FormData()
    signUpForm.append('name', data.name)
    signUpForm.append('username', data.username)
    signUpForm.append('email', data.email)
    signUpForm.append('password', data.password)
    signUpForm.append('profilePicture', selectedImage)

    const signUpRequest = api.post(
      `${clientEnv.NEXT_PUBLIC_BACKEND_URL}/user/register`,
      signUpForm
    )
    toast.promise(signUpRequest, {
      loading: 'Cadastrando usuário...',
      success: 'Usuário cadastrado com sucesso.',
      error: 'Algo deu errado ao cadastrar o usuário.',
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
        <Button asChild>
          <div className='relative w-full bg-red-700 hover:bg-red-800'>
            <Input
              id='profilePicture'
              type='file'
              accept='image/*'
              className='absolute inset-0 opacity-0 cursor-pointer'
              onChange={handleImageChange}
            />
            {uploadedImgSrc ? (
              // Modificar para pegar realmente a imagem do usuario
              <div>Foto selecionada.</div>
            ) : (
              <Camera className='size-6' />
            )}
          </div>
        </Button>
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
          {uploadedImgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => {
                setCrop(percentCrop)
              }}
              circularCrop
              keepSelection
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
            >
              <img
                ref={imgRef}
                src={uploadedImgSrc}
                alt='Pré-visualização da imagem'
                className='w-full rounded-lg'
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
          {crop && (
            <canvas
              ref={canvasRef}
              className='hidden'
              style={{
                objectFit: 'contain',
                width: 150,
                height: 150,
              }}
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
              <Button
                className='w-full'
                onClick={() => handleImageConfirmation()}
              >
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
