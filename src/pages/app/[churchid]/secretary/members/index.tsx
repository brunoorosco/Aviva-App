"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useHttpGet, useHttpPatch } from "@/hooks/api";
import MemberItem from "../../../../../components/Member/MemberItem";
import { User } from "@/domain/models/users";
import Pagination from "@/components/Pagination";
import EditMemberModal from "@/components/Member/EditMemberModal";
import MembersHeader from "@/components/Member/MembersHeader";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";

const MembersWithImportExport = () => {
  const router = useRouter();
  const { asPath, query } = router;
  const { churchid } = query;
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 8;

  // 🔹 debounce da pesquisa
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: members, mutate: refreshMembers } = useHttpGet<{
    data: User[];
    total: number;
    page: number;
    totalPages: number;
  }>(
    `/api/protected/churches/${churchid}/users?page=${page}&limit=${limit}${
      debouncedSearch ? `&name=${debouncedSearch}` : ""
    }`
  );

  const handleDesactive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/users/${id}`,
      data: { id, active: false },
    });
  };

  const handleActive = async (id: string) => {
    await useHttpPatch({
      url: `/api/protected/churches/${churchid}/users/${id}`,
      data: { id, active: true },
    });
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
      />

      {/* Desktop/List view */}
      <div className="hidden sm:block shadow-sm">
        <ul className="w-full p-4 bg-white divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-dark-secondary">
          <Suspense fallback={<p>Carregando membros...</p>}>
            {members?.data?.data.map((member) => (
              <MemberItem
                key={member._id}
                member={member}
                onEdit={() => handleEdit(member)}
                onDeactive={() => handleDesactive(member._id)}
                onActive={() => handleActive(member._id)}
                basePath={asPath}
                viewCargo={true}
              />
            ))}
          </Suspense>
        </ul>
      </div>

      {/* Mobile/Card view */}
      <div className="sm:hidden flex flex-col gap-4">
        {members?.data?.data.map((member) => (
          <div
            key={member._id}
            className="p-4 bg-white rounded-lg shadow-md dark:bg-dark-secondary cursor-pointer transition hover:shadow-lg"
            onClick={() => router.push(`/${asPath}/${member._id}`)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{(member.name || "Sem nome").toUpperCase()}</h2>

              <div className="flex items-center gap-1">
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

                {member.active ? (
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
                ) : (
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
          currentPage={page}
          pageSize={limit}
          items={members.data.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default MembersWithImportExport;
