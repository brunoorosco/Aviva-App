import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useHttpGet } from "@/hooks/api";
import Pagination from "@/components/Pagination";
import ConferenciaHeader from "@/components/conferencia/ConferenciaHeader";
import { TConferencia } from "@/domain/models/conferencia";
import ConferenciaItem from "@/components/conferencia/ConferenciaItem";
import { EditConferenciaModal } from "@/components/conferencia/EditConferenciaModal";

const ConferenciaList = () => {
  const router = useRouter();
  const { asPath, query, isReady } = router;
  const { churchid } = query;
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConferencia, setSelectedConferencia] = useState<TConferencia | null>(null);
  const [page, setPage] = useState(1);
  const limit = 8;

  if (!isReady || !churchid) return null;

  const { data: conferencias, mutate: refreshConferencias } = useHttpGet<{
    data: TConferencia[];
    total: number;
    page: number;
    totalPages: number;
  }>(`/api/protected/churches/${churchid}/conferencia?page=${page}&limit=${limit}`);

  const handleEdit = (conferencia: TConferencia) => {
    setSelectedConferencia(conferencia);
    setShowEditModal(true);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl px-3 py-1 mx-auto rounded-lg mt-8 dark:text-dark-primary">
      {showEditModal && selectedConferencia && (
        <EditConferenciaModal
          conferencia={selectedConferencia}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => refreshConferencias()}
        />
      )}

      <div className="shadow-sm">
        <ConferenciaHeader
          pathname={asPath}
          inputFileRef={inputFileRef}
          conferencia={conferencias?.data?.data || []}
          onImportSuccess={refreshConferencias}
        />
        <ul className="w-full pt-4 bg-gray-50 divide-y divide-gray-200 shadow-lg dark:divide-gray-700 dark:rounded-b-lg dark:bg-background">
          {!conferencias ? (
            <div className="p-4 text-center">Carregando conferências...</div>
          ) : !conferencias?.data?.data || conferencias.data.data.length === 0 ? (
            <div className="p-4 text-center">Nenhuma conferência encontrada.</div>
          ) : (
            conferencias.data.data.map((conferencia: TConferencia) => (
              <ConferenciaItem
                key={conferencia._id}
                conferencia={conferencia}
                onEdit={() => handleEdit(conferencia)}
                basePath={asPath}
                onToggleSuccess={() => refreshConferencias()}
              />
            ))
          )}
        </ul>

        {conferencias?.data?.totalPages > 1 ? (
          <Pagination
            currentPage={page}
            pageSize={limit}
            items={conferencias.data.total}
            onPageChange={setPage}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ConferenciaList;
