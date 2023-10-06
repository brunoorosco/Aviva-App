import { FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6'
import { GiMeepleGroup } from 'react-icons/gi'
import HomeIcon from './icons'

export const menuItems = [
  { id: 1, label: 'Home', icon: <HomeIcon />, link: '/' },
  {
    id: 2,
    label: 'CEMs',
    icon: <GiMeepleGroup size={25} />,
    link: '/cem'
  },
  {
    id: 3,
    label: 'Membros',
    icon: <FaPeopleRoof size={25} />,
    link: '/users'
  },
  {
    id: 4,
    label: 'Grupo de Apoio',
    icon: <FaPeopleGroup size={25} />,
    link: '/aceitou-jesus'
  }
]
