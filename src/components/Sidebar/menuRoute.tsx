import { FaPeopleRoof } from "react-icons/fa6";
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
  UserPlus2,
  BicepsFlexed,
  HouseHeartIcon,
  House,
  MapPinHouse,
  ChartColumn,
  Footprints,
  University,
  Settings,
  TicketCheck,
} from "lucide-react";
import { Role, ROLES } from "@/lib/permissions";

type TMenu = {
  churchId: string;
  cemId: string;
};

export type MenuItem = {
  label: string;
  icon: any;
  link?: string;
  roles?: Role[];
  children?: Omit<MenuItem, "children">[];
};

export const menuItems = ({ churchId, cemId }: TMenu): MenuItem[] => {
  const base = `/app/${churchId}`;
  return [
    {
      label: "Home",
      icon: House,
      link: `${base}/`,
      roles: [ROLES.LIDER, ROLES.SUPERVISOR, ROLES.PASTOR, ROLES.AUXILIAR],
    },
    {
      label: "Minha Rede",
      icon: FaPeopleRoof,
      link: `${base}/minha-rede`,
      roles: [ROLES.PASTOR, ROLES.SUPERVISOR, ROLES.LIDER],
    },
    {
      label: "Redes",
      icon: GroupIcon,
      link: `${base}/redes`,
      roles: [ROLES.PASTOR, ROLES.SUPERVISOR, ROLES.LIDER],
    },
    // {
    //   label: "Membros",
    //   icon: FaPeopleRoof,
    //   link: `${base}/cems/${cemId}/members`,
    //   roles: ["pastor", "supervisor"],
    // },
    {
      label: "TMAC",
      icon: Footprints,
      roles: [ROLES.SECRETARIA, ROLES.ADMIN, ROLES.PASTOR, ROLES.LIDER, ROLES.SUPERVISOR],
      children: [
        {
          label: "Discipulado",
          icon: BookOpenCheckIcon,
          link: `${base}/secretary/discipulado`,
        },
        {
          label: "Escola de Profeta",
          icon: GraduationCapIcon,
          link: `${base}/secretary/escola-de-profeta`,
        },
        {
          label: "Cem's",
          icon: HouseHeartIcon,
          link: `${base}/cems`,
        },
        {
          label: "Casas de Paz",
          icon: HouseHeartIcon,
          link: `${base}/casasdepaz`,
        },
        {
          label: "Visitas de Paz",
          icon: HouseHeartIcon,
          link: `${base}/visitasdepaz`,
        },
        {
          label: "Encontro com Deus",
          icon: MapPinHouse,
          link: `${base}/secretary/encontroComDeus`,
        },
        {
          label: "Encontro Seja Livre",
          icon: MapPinHouse,
          link: `${base}/secretary/sejaLivre`,
        },
        {
          label: "Reencontro com Deus",
          icon: MapPinHouse,
          link: `${base}/secretary/reencontroComDeus`,
        },
        {
          label: "Conferências",
          icon: TicketCheck,
          link: `${base}/secretary/conferencia`,
        },
        {
          label: "Treinamento de Líderes",
          icon: University,
          link: `${base}/secretary/treinamento-lideres`,
        },
        {
          label: "Relatórios",
          icon: ChartColumn,
          link: `${base}/secretary/relatorios/tmac`,
        },
      ],
    },
    {
      label: "Boas Vindas",
      icon: UserPlus,
      roles: [ROLES.SECRETARIA, ROLES.BOAS_VINDAS, ROLES.PASTOR, ROLES.LIDER, ROLES.SUPERVISOR],
      children: [
        {
          label: "Visitantes",
          icon: UserPlus2,
          link: `${base}/visitantes`,
        },
        {
          label: "Aceitou Jesus",
          icon: CrossIcon,
          link: `${base}/aceitou-jesus`,
        },
        {
          label: "Analytics",
          icon: ChartColumn,
          link: `${base}/boas-vindas/analytics`,
        },
      ],
    },
    {
      label: "Secretária",
      icon: BookUserIcon,
      roles: [ROLES.SECRETARIA, ROLES.PASTOR, ROLES.LIDER, ROLES.SUPERVISOR],
      children: [
        {
          label: "Apresentações",
          icon: Users,
          link: `${base}/secretary/apresentacao`,
        },
        {
          label: "Membros",
          icon: Users,
          link: `${base}/secretary/members`,
        },
        {
          label: "Batismo",
          icon: Waves,
          link: `${base}/secretary/batismos`,
        },
        {
          label: "Ministérios",
          icon: BicepsFlexed,
          link: `${base}/secretary/ministerios`,
        },
        {
          label: "Consagração",
          icon: Users,
          link: `${base}/secretary/consagracoes`,
        },
        {
          label: "Fechamento Anual",
          icon: ChartPieIcon,
          link: `${base}/secretary/fechamento-anual`,
        },
      ],
    },

    // {
    //   label: "Flow",
    //   icon: WorkflowIcon,
    //   roles: ["admin", "secretaria"],
    //   link: `${base}/flow`,
    // },
    // {
    //   label: "Metricas",
    //   roles: ["admin", "secretaria"],
    //   icon: ChartPieIcon,
    //   link: `${base}/dashboard`,
    // },
    {
      label: "Agendas",
      icon: Calendar1Icon,
      roles: [ROLES.SECRETARIA, ROLES.PASTOR, ROLES.LIDER, ROLES.SUPERVISOR],
      children: [
        {
          label: "Anual",
          link: `${base}/agenda`,
          icon: Calendar1Icon,
        },
        {
          label: "Chacará Aviva",
          link: `${base}/agenda/chacara-peniel`,
          icon: Calendar1Icon,
        },
      ],
    },
    {
      label: "Administrador",
      icon: Settings,
      roles: [ROLES.ADMIN],
      children: [
        {
          label: "Usuários",
          link: `${base}/admin`,
          icon: Calendar1Icon,
        },
        {
          label: "Eventos",
          link: `${base}/admin/eventos`,
          icon: Calendar1Icon,
        },
      ],
    },
  ];
};
