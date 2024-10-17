'use client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import type { RoleType } from './wally-sign-up-form'

export function RoleList({
  roles,
  setOpen,
  setSelectedRole,
}: {
  roles: RoleType[]
  setOpen: (open: boolean) => void
  setSelectedRole: (status: RoleType | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder='Filter status...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {roles.map(role => (
            <CommandItem
              key={role.id}
              value={role.role}
              onSelect={value => {
                setSelectedRole(
                  roles.find(priority => priority.role === value) || null
                )
                setOpen(false)
              }}
            >
              {role.role}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
