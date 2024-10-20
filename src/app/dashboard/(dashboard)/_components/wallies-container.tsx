'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { WallyCard } from './wally-card'
import { SearchInput } from '@/components/ui/search-input'

interface Wally {
  id: string
  name: string
  role: {
    name: string
    scoreMultiplier: number
  }
  profilePicture: string
  encounters: number
  hasEncountered: boolean
}

export function WalliesContainer({ wallies }: { wallies: Wally[] }) {
  const [filteredWallies, setFilteredWallies] = useState<Wally[]>(wallies)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setFilteredWallies(wallies.filter(wally => wally.name.includes(search)))
  }, [search, wallies])

  return (
    <div className='px-2 py-4'>
      <SearchInput
        type='text'
        startIcon={Search}
        placeholder='Pesquisar por nome...'
        value={search}
        onChange={event => setSearch(event.currentTarget.value)}
      />
      <div className='w-full'>
        {filteredWallies.map(wally => (
          <WallyCard
            key={wally.id}
            id={wally.id}
            name={wally.name}
            profilePicture={wally.profilePicture}
            encounters={wally.encounters}
            hasEncountered={wally.hasEncountered}
            role={wally.role}
          />
        ))}
      </div>
    </div>
  )
}
