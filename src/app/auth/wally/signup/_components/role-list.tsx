import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import type { WallyRole } from '@/types'
import { getRoleColor } from './get-role-color'

export function RoleList({
  roles,
  setOpen,
  setSelectedRole: setSelectedStatus,
}: {
  roles: WallyRole[]
  setOpen: (open: boolean) => void
  setSelectedRole: (role: WallyRole | null) => void
}) {
  return (
    <Command className='px-8 py-4'>
      <CommandInput placeholder='Filtrar cargos...' />
      <CommandList>
        <CommandEmpty>Nenhum cargo encontrado.</CommandEmpty>
        <CommandGroup className='py-4'>
          {roles.map(role => (
            <CommandItem
              className='p-2 px-4 flex justify-between'
              key={role.id}
              value={role.role}
              onSelect={value => {
                setSelectedStatus(
                  roles.find(priority => priority.role === value) || null
                )
                setOpen(false)
              }}
            >
              <span>{role.role}</span>
              <span className={`${getRoleColor(role.id)} px-2 py-1 rounded-md font-semibold`}>
                {role.scoreMultiplier}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
