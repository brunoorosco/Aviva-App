"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { TConferencia } from "@/domain/models/conferencia";
import { useHttpPut } from "@/hooks/api";
import { useState } from "react";
import Toast from "@/components/Toast";
import { Loader2Icon, Calendar, Hash, FileText, MapPin } from "lucide-react";

interface EditConferenciaModalProps {
  conferencia: TConferencia;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditConferenciaModal({
  conferencia,
  isOpen,
  onClose,
  onSuccess,
}: EditConferenciaModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      data: conferencia.data
        ? new Date(conferencia.data).toISOString().split("T")[0]
        : "",
      numero: conferencia.numero || "",
      descricao: conferencia.descricao || "",
      local: conferencia.local || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const response = await useHttpPut({
      url: `/api/protected/churches/${conferencia.churchId || "default"}/conferencia/${conferencia._id}`,
      data,
    });
    setIsLoading(false);

    if (response?.error) {
      Toast.showError("Erro ao atualizar conferência");
    } else {
      Toast.showSuccess("Conferência atualizada!");
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Editar Conferência
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" /> Data
            </Label>
            <Controller
              name="data"
              control={control}
              render={({ field }) => <Input {...field} type="date" required />}
            />
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center gap-2 text-slate-600">
              <Hash className="w-4 h-4" /> Número / Edição
            </Label>
            <Controller
              name="numero"
              control={control}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Ex: 1, 2, ou 2026" />
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center gap-2 text-slate-600">
              <FileText className="w-4 h-4" /> Descrição
            </Label>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Conferência de Mulheres" required />
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" /> Local
            </Label>
            <Controller
              name="local"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ex: Templo Principal" />
              )}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600" disabled={isLoading}>
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
