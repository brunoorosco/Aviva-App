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
} from "lucide-react";

type TMenu = {
  churchId: string;
  cemId: string;
};

export const menuItems = ({ churchId, cemId }: TMenu) => {
  const base = `/app/${churchId}`;
  return [
    {
      label: "Home",
      icon: House,
      link: `${base}/`,
      roles: ["lider", "supervisor", "pastor", "auxiliar"],
    },
    {
      label: "Redes",
      icon: GroupIcon,
      link: `${base}/cems`,
      roles: ["pastor", "supervisor"],
    },
    {
      label: "Membros",
      icon: FaPeopleRoof,
      link: `${base}/cems/${cemId}/members`,
      roles: ["pastor", "supervisor"],
    },
    {
      label: "Boas Vindas",
      icon: UserPlus,
      roles: ["secretaria", "boas-vindas"],
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
      roles: ["admin", "secretaria"],
      children: [
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
          label: "Ministérios",
          icon: BicepsFlexed,
          link: `${base}/secretary/ministerio`,
        },
        {
          label: "Consagração",
          icon: Users,
          link: `${base}/secretary/consagracao`,
        },
      ],
    },

    {
      label: "Flow",
      icon: WorkflowIcon,
      roles: ["admin", "secretaria"],
      link: `${base}/flow`,
    },
    {
      label: "Metricas",
      roles: ["admin", "secretaria"],
      icon: ChartPieIcon,
      link: `${base}/dashboard`,
    },
    {
      label: "Agendas",
      icon: Calendar1Icon,
      roles: ["admin", "secretaria"],
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
  ];
};
