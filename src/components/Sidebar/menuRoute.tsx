import { FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6'
import {
  Users,
  GroupIcon,
  BookUserIcon,
  ChartPieIcon,
  Calendar1Icon,
  WorkflowIcon,
  CrossIcon,
  Waves,
  GraduationCapIcon,
  BookOpenCheckIcon,
  UserPlus,
  UserPlus2
} from 'lucide-react'
import HomeIcon from './icons'

type TMenu = {
  churchId: string
  cemId: string
}

export const menuItems = ({ churchId, cemId }: TMenu) => {
  const base = `/app/${churchId}`
  return [
    {
      label: 'Home',
      icon: HomeIcon,
      link: `${base}/`
    },
    {
      label: 'Redes',
      icon: GroupIcon,
      link: `${base}/cems`
    },
    {
      label: 'Membros',
      icon: FaPeopleRoof,
      link: `${base}/cems/${cemId}/members`
    },
    {
      label: 'Boas Vindas',
      icon: UserPlus,
      link: `${base}/aceitou-jesus`,
      children: [
        {
          label: 'Visitantes',
          icon: UserPlus2,
          link: `${base}/visitantes`
        },
        {
          label: 'Aceitou Jesus',
          icon: CrossIcon,
          link: `${base}/aceitou-jesus`
        }
      ]
    },
    {
      label: 'Secretária',
      icon: BookUserIcon,
      children: [
        {
          label: 'Batismo',
          icon: Waves,
          link: `${base}/secretary/batismos`
        },
        {
          label: 'Discipulado',
          icon: BookOpenCheckIcon,
          link: `${base}/secretary/discipulado`
        },
        {
          label: 'Escola de Profeta',
          icon: GraduationCapIcon,
          link: `${base}/secretary/escola-de-profeta`
        },
        {
          label: 'Membros',
          icon: Users,
          link: `${base}/secretary/members`
        }
      ]
    },
    {
      label: 'Encontro com Deus',
      icon: FaPeopleGroup,
      link: `${base}/secretary/encontroComDeus`
    },
    {
      label: 'Encontro Seja Livre',
      icon: FaPeopleGroup,
      link: `${base}/secretary/encontroSejaLivre`
    },
    {
      label: 'Reencontro com Deus',
      icon: FaPeopleGroup,
      link: `${base}/secretary/reencontroComDeus`
    },
    {
      label: 'Casas de Paz - V2',
      icon: FaPeopleGroup,
      link: `${base}/casasdepaz`
    },
    {
      label: 'Visitas de Paz',
      icon: FaPeopleGroup,
      link: `${base}/visitasdepaz`
    },
    {
      label: 'Flow',
      icon: WorkflowIcon,
      link: `${base}/flow`
    },
    {
      label: 'Metricas',
      icon: ChartPieIcon,
      link: `${base}/dashboard`
    },
    {
      label: 'Agenda',
      icon: Calendar1Icon,
      link: `${base}/agenda`
    }
  ]
}
