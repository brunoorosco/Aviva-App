import { Suspense, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useHttpGet, useHttpPatch } from "@/hooks/api";
import { User } from "@/domain/models/users";
import Pagination from "@/components/Pagination";
import EditMemberModal from "@/components/Member/EditMemberModal";
import MembersHeader from "@/components/Member/MembersHeader";
import MemberItem from "@/components/Member/MemberItem";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { ROLES } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";

const MembersWithImportExport = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const { churchid, cemid } = query;
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const { data: session } = useSession();
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1);
  const limit = 10;
  // Verificar se pode editar
  const userCemName = session?.user?.cem?.name;
  const canEditGlobal = hasPermission([ROLES.ADMIN, ROLES.SECRETARIA]);

  // 1. Adicione um console.log para debugar
  const canEditMembers = (member: any) => {
    // Admin e secretaria podem editar qualquer casa
    if (canEditGlobal) return true;

    // Usuários podem editar apenas casas da sua própria rede
    // Verifique se member.cem existe antes de acessar .name
    return member?.cem?.name === userCemName;
  };

  const { data: members, mutate: refreshMembers } = useHttpGet<{
    data: User[];
    total: number;
    page: number;
    totalPages: number;
    totalAtivos: number;
    totalInativos: number;
  }>(
    // `/api/protected/churches/${churchid}/cems/${cemid}/members?page=${page}&limit=${limit}`
    `/api/protected/churches/${churchid}/cems/${cemid}/members?page=${page}&limit=${limit}${
      search ? `&name=${search}` : ""
    }`,
  );

  const handleDesactive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/users/${id}`,
      data: {
        id,
        active: false,
      },
    });
    refreshMembers();
  };

  const handleActive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/users/${id}`,
      data: {
        id,
        active: true,
      },
    });
    refreshMembers();
  };
  const handleEdit = (member: User) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg dark:text-dark-primary">
      {showEditModal && (
        <EditMemberModal
          member={selectedMember}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          onUpdated={refreshMembers}
        />
      )}
      <MembersHeader
        total={members?.data?.total || 0}
        pathname={asPath}
        inputFileRef={inputFileRef}
        members={members?.data.data || []}
        churchId={churchid as string}
        search={search}
        setSearch={setSearch}
        totalAtivo={members?.data.totalAtivos}
        totalInativo={members?.data.totalInativos}
      />
      {/* se desktop */}
      <div className="hidden sm:block shadow-sm">
        <ul className="w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary">
          <Suspense fallback={<p>Carregando membros...</p>}>
            {members?.data?.data.map((member) => (
              <MemberItem
                viewCargo={true}
                key={member._id}
                member={member}
                onEdit={() => handleEdit(member)}
                onDeactive={() => handleDesactive(member._id)}
                onActive={() => handleActive(member._id)}
                basePath={asPath}
              />
            ))}
          </Suspense>
        </ul>
      </div>
      {/* se mobile */}
      <div className="sm:hidden flex flex-col gap-4">
        {members?.data?.data.map((member) => (
          <div
            key={member._id}
            className="p-4 bg-white rounded-lg shadow-md dark:bg-dark-secondary cursor-pointer transition hover:shadow-lg"
            onClick={() => router.push(`/${asPath}/${member._id}`)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{(member.name || "Sem nome").toUpperCase()}</h2>

              <div className={`flex items-center gap-1`}>
                {canEditMembers(member) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(member);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}

                {member.active
                  ? canEditMembers(member) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDesactive(member._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )
                  : canEditMembers(member) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActive(member._id);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
              </div>
            </div>

            <div className="mt-2 text-gray-600">Email: {member.email || "Não informado"}</div>

            <div className="text-gray-600">
              Cargo:{" "}
              {member.role
                ? `${member.role.charAt(0).toUpperCase()}${member.role.substring(1).toLowerCase()}`
                : "Não definido"}
            </div>
          </div>
        ))}
      </div>

      {members?.data.totalPages && (
        <Pagination
          currentPage={page} // Página atual controlada por estado
          pageSize={limit} // Quantos itens por página
          items={members.data.total} // Total de itens disponíveis
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default MembersWithImportExport;
