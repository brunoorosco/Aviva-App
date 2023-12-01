import { FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6'
import { GiMeepleGroup } from 'react-icons/gi'
import HomeIcon from './icons'

type TMenu = {
  churchId?: string
  cemId?: string
}
export const menuItems = (params: TMenu) => {
  return [
    { id: 1, label: 'Home', icon: <HomeIcon />, link: `/` },
    {
      id: 2,
      label: 'CEMs',
      icon: <GiMeepleGroup size={25} />,
      link: '/cems'
    },
    {
      id: 3,
      label: 'Membros',
      icon: <FaPeopleRoof size={25} />,
      link: `/cems/${params.cemId}/members`
    },
    {
      id: 4,
      label: 'Grupo de Apoio',
      icon: <FaPeopleGroup size={25} />,
      link: '/aceitou-jesus'
    },
    {
      id: 5,
      label: 'Secretária',
      icon: <FaPeopleGroup size={25} />,
      link: '/secretary'
    }
  ]
}
