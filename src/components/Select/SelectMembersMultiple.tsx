import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useHttpGet } from '@/hooks/api'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Search, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Person = {
  _id: string
  name: string
}

type SelectMembersMultipleProps = {
  selectedPeople: Person[]
  onSelectionChange: (people: Person[]) => void
  label: string
  placeholder?: string
}

export default function SelectMembersMultiple({
  selectedPeople,
  onSelectionChange,
  label,
  placeholder = 'Digite o nome para buscar...'
}: SelectMembersMultipleProps) {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const { data: membersResponse } = useHttpGet<Person[]>(
    `/api/protected/churches/${session?.user.churchId}/users/members`
  )

  const members = membersResponse?.data || []

  const filteredMembers = members.filter((member) => {
    const isNotSelected = !selectedPeople.find((p) => p._id === member._id)
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    return isNotSelected && matchesSearch
  })

  const handleAddPerson = (person: Person) => {
    onSelectionChange([...selectedPeople, person])
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleRemovePerson = (personId: string) => {
    onSelectionChange(selectedPeople.filter((p) => p._id !== personId))
  }

  return (
    <div className="w-full space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Selected People */}
      {selectedPeople.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPeople.map((person) => (
            <Badge
              key={person._id}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2"
            >
              <User className="w-3 h-3" />
              {person.name}
              <button
                type="button"
                onClick={() => handleRemovePerson(person._id)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && searchTerm && filteredMembers.length > 0 && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
            <CardContent className="p-0">
              {filteredMembers.slice(0, 10).map((member) => (
                <button
                  key={member._id}
                  type="button"
                  onClick={() => handleAddPerson(member)}
                  className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 border-b last:border-b-0 transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{member.name}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
