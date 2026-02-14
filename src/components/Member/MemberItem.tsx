import Link from "next/link";
import { User } from "@/domain/models/users";
import { useState } from "react";
import { CirclePlayIcon, CircleX, Edit, EyeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { ROLES } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { AvatarFallback, Avatar, AvatarImage } from "../ui/avatar";
import { getInitialsName } from "@/utils/getInitialName";

type Props = {
  member: User;
  onDeactive: () => void;
  onActive: () => void;
  onEdit: () => void;
  basePath: string;
  viewCargo?: boolean;
};

const MemberItem = ({
  member,
  onDeactive,
  onActive,
  onEdit,
  basePath,
  viewCargo = false,
}: Props) => {
  const [disabled, setDisabled] = useState(false);
  const { data: session } = useSession();
  const { hasPermission } = usePermissions();

  // Verificar permissões
  const userCemName = session?.user?.cem?.name;
  const canEditGlobal = hasPermission([ROLES.ADMIN, ROLES.SECRETARIA]);

  const canEditMembers = () => {
    // Admin e secretaria podem editar qualquer casa
    if (canEditGlobal) return true;

    // Usuários podem editar apenas casas da sua própria rede
    return member?.cem?.name === userCemName;
  };

  const hasEditPermission = canEditMembers();

  return (
    <li className="bg-card text-card-foreground px-3 py-2 rounded-md shadow mb-1">
      <div className="flex items-start gap-4">
        {/* Avatar fora do grid */}
        <div className="w-10 flex items-center justify-center rounded-full bg-app-bg text-white text-base">
          {/* <Avatar name={member.name} /> */}
          <Avatar className="">
            <AvatarImage src={member.image} alt={member.name} />
            <AvatarFallback className="text-foreground bg-muted">{getInitialsName(member.name)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Grid de informações */}
        <div className={`grid grid-cols-4 grid-rows-2 gap-x-2 gap-y-1 flex-1`}>
          {/* Nome */}
          <div
            className={`col-span-2 row-start-1 ${
              member.active ? "text-gray-900 dark:text-gray-100" : "text-gray-400"
            }`}
          >
            <p className={`text-sm font-medium uppercase truncate leading-tight`}>
              {member.name + " " + (member.active ? "" : "(Inativo)")}
            </p>
          </div>

          {/* Rede */}
          <div className="col-start-3 row-start-1 text-sm text-gray-600 dark:text-gray-400 uppercase truncate leading-tight">
            {member.cem?.name || "Sem rede"}
          </div>
          {viewCargo && (
            <div className="col-start-3 row-start-2 text-sm text-gray-600 dark:text-gray-400 uppercase truncate leading-tight">
              {member.role || "Membro"}
            </div>
          )}

          {/* Botões e checkbox: agora em linha */}
          <div className="flex items-center justify-end gap-3 col-start-4 row-span-2">
            {/* Visualizar - sempre disponível */}
            <span title="Visualizar">
              <Link href={`${basePath}/${member._id}`}>
                <EyeIcon
                  className={`${
                    member.active
                      ? "text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  size={16}
                />
              </Link>
            </span>

            {/* Editar - apenas com permissão */}
            {hasEditPermission && (
              <span title="Editar">
                <Edit
                  className={`${
                    member.active
                      ? "text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  size={16}
                  onClick={member.active ? onEdit : undefined}
                />
              </span>
            )}

            {/* Ativar/Desativar - apenas com permissão */}
            {hasEditPermission &&
              (member.active ? (
                <span title="Desativar">
                  <CircleX
                    className="text-gray-900 dark:text-gray-100 cursor-pointer hover:text-red-600"
                    size={16}
                    onClick={onDeactive}
                  />
                </span>
              ) : (
                <span title="Ativar">
                  <CirclePlayIcon
                    className="text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600"
                    size={16}
                    onClick={onActive}
                  />
                </span>
              ))}
          </div>

          {/* Email */}
          <div className="col-span-2 row-start-2 text-sm text-gray-500 dark:text-gray-400 lowercase truncate leading-tight">
            {member.email}
          </div>
        </div>
      </div>
    </li>
  );
};

export default MemberItem;
