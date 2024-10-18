'use client'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import {
  centerCrop,
  convertToPixelCrop,
  type Crop,
  makeAspectCrop,
  ReactCrop,
} from 'react-image-crop'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '@/lib/axios'
import { clientEnv } from '@/env'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { dataURLToBlob } from '@/helpers/data-url-to-blob'
import { setCanvasPreview } from '@/helpers/set-canvas-preview'

const ASPECT_RATIO = 1
const MIN_DIMENTION = 200

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

export function SignUpForm() {
  const { register, handleSubmit, formState } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const [selectedImage, setSelectedImage] = useState<File | null | string>(null)
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.addEventListener('load', () => {
      const imageElement = new Image()
      const imgUrl = reader.result?.toString() || ''
      imageElement.src = imgUrl
      imageElement.addEventListener('load', (e: Event) => {
        const target = e.currentTarget as HTMLImageElement
        const { naturalWidth, naturalHeight } = target

        if (naturalWidth < MIN_DIMENTION || naturalHeight < MIN_DIMENTION) {
          setSelectedImage(null)
          setIsDialogOpen(false)
          return toast.error('Imagem deve ser ao menos 200x200.')
        }
      })
      setSelectedImage(imgUrl)
      setIsDialogOpen(true)
    })
    reader.readAsDataURL(file)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const cropWidthInPercent = (MIN_DIMENTION / width) * 100

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

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
  }

  const handleConfirmImage = () => {
    handleCropImage()

    setIsDialogOpen(false)
  }

  const handleCropImage = () => {
    if (!imgRef.current || !canvasRef.current || !crop) {
      return toast.error('Canvas ou imagem não estão disponíveis.')
    }

    const { width, height } = imgRef.current

    if (!width || !height) {
      return toast.error('Dimensões da imagem não foram encontradas.')
    }

    setCanvasPreview(
      imgRef.current,
      canvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    )
    const dataUrl = canvasRef.current.toDataURL()

    const blob = dataURLToBlob(dataUrl)

    const file = new File([blob], 'user.jpg', {
      type: 'image/jpeg',
    })
    setSelectedImage(file)
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
        <Input id='profilePicture' type='file' onChange={handleImageChange} />
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
            <div className='flex justify-center'>
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => {
                  setCrop(percentCrop)
                }}
                circularCrop
                keepSelection
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENTION}
                className='w-fit'
              >
                <img
                  ref={imgRef}
                  src={
                    typeof selectedImage === 'string'
                      ? selectedImage
                      : selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : undefined
                  }
                  alt='Upload'
                  className='max-h-full mx-auto'
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              {/* CANVAS REF */}
              {crop && (
                <canvas
                  ref={canvasRef}
                  className='mt-4'
                  style={{
                    display: 'none',
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: '200px',
                    height: '200px',
                  }}
                />
              )}
            </div>
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
