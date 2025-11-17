"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { ConsagracaoCard } from "@/components/Consagracao/ConsagracaoCard";
import { useHttpGet, useHttpPost } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Toast from "@/components/Toast";

function ConsagracoesHistoryPage() {
  const [openModal, setOpenModal] = useState(false);
  const [date, setDate] = useState("");
  const [isPost, setIsPost] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const churchId = session?.user.churchId;

  const { data, isLoading } = useHttpGet(
    churchId ? `/api/protected/churches/${churchId}/consagracao` : null
  );

  const historicConsagracoes = Array.isArray(data?.data) ? data?.data : [];

  async function handleCreateConsagracao() {
    if (!date) {
      Toast.showError("Informe a data da consagração.");
      return;
    }

    setIsPost(true);
    try {
      const res = await useHttpPost({
        url: `/api/protected/churches/${churchId}/consagracao`,
        data: date,
      });

      if (res.error) {
        Toast.showError(res.error);
        return;
      }

      Toast.showSuccess("Consagração criada com sucesso!");
      setOpenModal(false);

      router.push(`${router.asPath}/${res.consagracao._id}`);
    } catch (err) {
      Toast.showError("Erro ao criar consagração.");
    } finally {
      setIsPost(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Histórico de Consagrações
        </h1>

        <Button onClick={() => setOpenModal(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Nova Consagração
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Consagração</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Data da Consagração</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateConsagracao} disabled={isPost}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LOADING */}
      {isLoading && <p className="text-center text-gray-600 text-lg">Carregando...</p>}

      {/* LISTAGEM */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {historicConsagracoes?.length === 0 ? (
            <p className="col-span-full text-center text-lg text-gray-600">
              Nenhum histórico de consagração encontrado.
            </p>
          ) : (
            historicConsagracoes?.map((consagracao) => (
              <ConsagracaoCard key={consagracao._id} consagracao={consagracao} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ConsagracoesHistoryPage;
