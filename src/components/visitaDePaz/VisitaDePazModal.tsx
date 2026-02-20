"use client";

import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VisitaDePaz, VisitaDePazModel } from "@/domain/models/casaDePaz";
import { getRedeName } from "@/utils/helpersNameREde";
import { useEffect } from "react";
import { SelectMembrosRede } from "../Select/SelectMembrosRede";
import { useSession } from "next-auth/react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VisitaDePaz) => void;
  initialData?: VisitaDePazModel | null;
};

export default function VisitaDePazModal({ open, onClose, onSubmit, initialData }: Props) {
  const { control, handleSubmit, reset } = useForm<VisitaDePaz>({
    defaultValues: {
      lider1: { name: "", _id: "" },
      lider2: { name: "", _id: "" },
      rede: "",
      endereco: "",
      anfitria: "",
      telefone: "",
    },
  });

  const { data: session } = useSession();
  const cemId = session?.user.cem._id;
  const churchId = session?.user.churchId;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        lider1: { name: "", _id: "" },
        lider2: { name: "", _id: "" },
        rede: "",
        endereco: "",
        anfitria: "",
        telefone: "",
      });
    }
  }, [initialData, reset, open]);

  if (!churchId || !cemId) return null;

  const handleFormSubmit = (data: VisitaDePaz) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Visita de Paz" : "Adicionar Nova Visita de Paz"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Linha 1 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Controller
                name="lider1"
                control={control}
                render={({ field }) => (
                  <SelectMembrosRede
                    title="Líder 1"
                    churchId={churchId}
                    cemId={cemId}
                    value={field.value?._id ?? ""} // ✅ extrai _id do objeto
                    onChange={field.onChange} // ✅ SelectMembrosRede já retorna { _id, name }
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <Controller
                name="lider2"
                control={control}
                render={({ field }) => (
                  <SelectMembrosRede
                    title="Líder 2/Auxiliar"
                    churchId={churchId}
                    cemId={cemId}
                    value={field.value?._id ?? ""} // ✅ extrai _id do objeto
                    onChange={field.onChange} // ✅ SelectMembrosRede já retorna { _id, name }
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <Controller
                name="rede"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={getRedeName(field.value) || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Rede"
                  />
                )}
              />
            </div>
          </div>

          {/* Linha 2 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Controller
                name="endereco"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Endereço" />}
              />
            </div>
            <div className="flex-1">
              <Controller
                name="anfitria"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Anfitriã" />}
              />
            </div>
            <div className="flex-1">
              <Controller
                name="telefone"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Telefone" />}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{initialData ? "Salvar Alterações" : "Adicionar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
