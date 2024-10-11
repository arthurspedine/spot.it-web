'use client'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog'
import handleLogout from './handle-logout'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  return (
    <DialogContent className='flex flex-col gap-4 w-5/6 rounded-xl'>
      <DialogHeader>
        <DialogTitle className='text-left'>Sair da conta</DialogTitle>
        <DialogDescription className='text-left'>
          Deseja mesmo sair da conta?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className='flex gap-2'>
          <DialogClose asChild>
            <Button className='w-full' variant='outline'>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            className='w-full'
            onClick={async () => {
              await handleLogout()
              router.replace('/dashboard')
            }}
          >
            Sair
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}
