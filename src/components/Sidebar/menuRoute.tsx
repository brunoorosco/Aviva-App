// menuRoute.ts
import { FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6'
import { Users, GroupIcon, BookUserIcon } from 'lucide-react'
import HomeIcon from './icons'

type TMenu = {
  churchId: string
  cemId: string
}
const baseUrl = process.env.NEXTAUTH_URL
export const menuItems = ({ churchId, cemId }: TMenu) => [
  {
    id: 1,
    label: 'Home',
    icon: <HomeIcon />,
    link: `/app/${churchId}`
  },
  {
    id: 2,
    label: 'CEMs',
    icon: <GroupIcon size={25} />,
    link: `/app/${churchId}/cems`
  },
  {
    id: 3,
    label: 'Membros',
    icon: <FaPeopleRoof size={25} />,
    link: `/app/${churchId}/cems/${cemId}/members`
  },
  {
    id: 4,
    label: 'Grupo de Apoio',
    icon: <Users size={25} />,
    link: `/app/${churchId}/aceitou-jesus`
  },
  {
    id: 5,
    label: 'Secretária',
    icon: <BookUserIcon size={25} />,
    link: `/app/${churchId}/secretary`
  },
  {
    id: 6,
    label: 'Encontro com Deus',
    icon: <FaPeopleGroup size={25} />,
    link: `/app/${churchId}/secretary/encontroComDeus`
  },
  {
    id: 7,
    label: 'Reencontro com Deus',
    icon: <FaPeopleGroup size={25} />,
    link: `/app/${churchId}/secretary/reencontroComDeus`
  }
]
