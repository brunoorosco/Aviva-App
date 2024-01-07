interface AvatarProps extends React.HTMLProps<HTMLDivElement> {
  name: string
  onClick?: () => void
}

const Avatar: React.FC<AvatarProps> = ({ name, onClick, className }) => {
  const initials = name
    .split(' ')
    .map((word) => word[0]?.toUpperCase())
    .join('')

  return (
    <div
      className={`w-12 h-12 bg-app-bg text-white text-2xl rounded-full flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      {initials.charAt(0) + initials.charAt(initials.length - 1)}
    </div>
  )
}

export default Avatar
