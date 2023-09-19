interface AvatarProps {
  name: string
  onClick?: () => void
}

const Avatar: React.FC<AvatarProps> = ({ name, onClick }) => {
  const initials = name
    .split(' ')
    .map((word) => word[0]?.toUpperCase())
    .join('')

  return (
    <div
      className="w-12 h-12 bg-app-bg  text-white text-2xl rounded-full flex items-center justify-center"
      onClick={onClick}
    >
      {initials}
    </div>
  )
}

export default Avatar
