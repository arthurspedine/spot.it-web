'use client'

import { Button } from '@/components/ui/button'
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { format, toZonedTime } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'
import { saveAs } from 'file-saver'

interface EncounterPictureProps {
  encounterPicture: string
  wallyName: string
  occuredAt: string
}

export function EncounterPicture({
  occuredAt,
  encounterPicture,
  wallyName,
}: EncounterPictureProps) {
  const utcDate = new Date(`${occuredAt}`)
  const zonedDate = toZonedTime(utcDate, 'America/Sao_Paulo')

  const date = format(zonedDate, "dd' de 'MMM'. de 'yyyy", { locale: ptBR })

  return (
    <SheetContent side={'bottom'} className='flex flex-col gap-4'>
      <SheetHeader>
        <SheetTitle className='text-left'>Encontro com {wallyName}</SheetTitle>
        <SheetDescription className='text-left'>Em {date}</SheetDescription>
      </SheetHeader>
      {encounterPicture && (
        <img
          src={encounterPicture}
          alt='Pré-visualização da imagem'
          className='w-full rounded-lg'
        />
      )}
      <SheetFooter>
        <div className='flex gap-2'>
          <SheetClose asChild>
            <Button className='w-full' variant='outline'>
              Fechar
            </Button>
          </SheetClose>
          <Button
            className='w-full'
            onClick={() =>
              saveAs(
                encounterPicture,
                `${wallyName}-${format(zonedDate, 'yyyy-MM-dd')}.jpg`
              )
            }
          >
            Salvar
          </Button>
        </div>
      </SheetFooter>
    </SheetContent>
  )
}
