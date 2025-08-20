import { FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6'
import { Users, GroupIcon, BookUserIcon } from 'lucide-react'
import HomeIcon from './icons'

type TMenu = {
  churchId: string
  cemId: string
}

export const menuItems = ({ churchId, cemId }: TMenu) => {
  const base = `/app/${churchId}`
  return [
    {
      id: 1,
      label: 'Home',
      icon: <HomeIcon />,
      link: `${base}/`
    },
    {
      id: 2,
      label: 'CEMs',
      icon: <GroupIcon size={25} />,
      link: `${base}/cems`
    },
    {
      id: 3,
      label: 'Membros',
      icon: <FaPeopleRoof size={25} />,
      link: `${base}/cems/${cemId}/members`
    },
    {
      id: 4,
      label: 'Boas Vindas',
      icon: <Users size={25} />,
      link: `${base}/aceitou-jesus`
    },
    {
      id: 5,
      label: 'Secretária',
      icon: <BookUserIcon size={25} />,
      link: `${base}/secretary`
    },
    {
      id: 6,
      label: 'Encontro com Deus',
      icon: <FaPeopleGroup size={25} />,
      link: `${base}/secretary/encontroComDeus`
    },
    {
      id: 7,
      label: 'Reencontro com Deus',
      icon: <FaPeopleGroup size={25} />,
      link: `${base}/secretary/reencontroComDeus`
    },
    {
      id: 8,
      label: 'Casas de Paz',
      icon: <FaPeopleGroup size={25} />,
      link: `${base}/casasdepaz`
    },
    {
      id: 8,
      label: 'Visitas de Paz',
      icon: <FaPeopleGroup size={25} />,
      link: `${base}/visitasdepaz`
    }
  ]
}
