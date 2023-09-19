import { signOut } from 'next-auth/react'
import React, { useState, useRef, useEffect } from 'react'
import { BiLogOut } from 'react-icons/bi'

interface DropdownProps {
  trigger: React.ReactNode
  onClose?: () => void
}

const Profile: React.FC<DropdownProps> = ({ trigger, onClose }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const closeDropdown = () => {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        //@ts-ignore
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-1 mt-1 p-2 w-48 bg-zinc-500 shadow-md rounded">
          <div
            className="flex text-zinc-200"
            onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}
          >
            <BiLogOut size={22} />
            <span className="mx-4 text-sm font-normal">Sair</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
