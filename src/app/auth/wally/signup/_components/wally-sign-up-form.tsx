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
import {
  type ChangeEvent,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from 'react-image-crop'
import { toast } from 'sonner'
import { z } from 'zod'
import { getRoleColor } from './get-role-color'
import { dataURLToBlob, setImageCrop } from './image-crop'
import { resizeImage } from './resize-img'
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

const ASPECT_RATIO = 1
const MIN_DIMENSION = 150

export function WallySignUpForm() {
  const { register, handleSubmit, formState } = useForm<WallySignUpSchema>({
    resolver: zodResolver(wallySignUpSchema),
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

  const [roles, setRoles] = useState<WallyRole[]>([])
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<WallyRole | null>()

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
      const resizedBlob = await resizeImage(
        rawFile,
        512,
        512,
        0.8
      )
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

  useEffect(() => {
    getWallyRoles().then(setRoles)
  }, [])

  const handleCancel = () => {
    setIsDialogOpen(false)
    setSelectedImage(null)
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
            {uploadedImgSrc ? (
              // Modificar para pegar realmente a imagem do usuario
              <div>Foto selecionada.</div>
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
