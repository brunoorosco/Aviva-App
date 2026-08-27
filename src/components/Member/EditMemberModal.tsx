"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useHttpPatch, useHttpPost } from "@/hooks/api";
import Toast from "@/components/Toast";
import { Masks } from "@/utils/masks";
import { SelectProfile } from "@/components/Select/SelectProfile";
import { Loader2, Check, X } from "lucide-react";
import { SelectCem } from "../Select/SelectCem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roles } from "@/utils/constants/roles";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
// Separar o tipo do form do tipo interno
type CemOption = { _id: string; name: string };

type FormValues = {
  name: string;
  email?: string;
  phone: string;
  street?: string;
  cemId?: CemOption | string;  // mantém, mas tratamos com type guard
  birthDate: string;
  role?: string;
  encontroComDeus?: boolean;
  reencontroComDeus?: boolean;
  sejaLivre?: boolean;
  batizado?: boolean;
  dataBatismo: string;
  data_batismo?: string | null;
  discipulado?: boolean;
  cae?: boolean;
  escolaProfeta?: boolean;
};

type Props = {
  member?: any; // agora opcional
  onClose: () => void;
  onUpdated: () => void;
};

const MemberModal = ({ member, onClose, onUpdated }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<FormValues | null>(null);
  const isEdit = !!member; // se tem member, é edição
  const { data: session } = useSession();

  // Helper para extrair cem de cemId com segurança
const extractCem = (cemId: CemOption | string | undefined) => {
  if (!cemId) return undefined;
  if (typeof cemId === "object") return { _id: cemId._id, name: cemId.name };
  // formato "id-name"
  const [_id, ...rest] = cemId.split("-");
  return { _id, name: rest.join("-") };
};

// Converte data_batismo (Date/ISO) para o valor yyyy-MM-dd do input.
const toDateInput = (value: any) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

// Converte yyyy-MM-dd para dd/mm/yyyy.
const formatInputDate = (v: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const [y, m, d] = v.split("-");
  return `${d}/${m}/${y}`;
};

// Converte yyyy-MM-dd para 00:00 no fuso UTC-3 (America/Sao_Paulo),
// garantindo que a exibição dd/mm/yyyy não desloque o dia.
const buildBatismoISO = (yyyyMMdd: string) => {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 3)).toISOString();
};

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      street: "",
      cemId: "",
      role: "",
      encontroComDeus: false,
      reencontroComDeus: false,
      sejaLivre: false,
      batizado: false,
      dataBatismo: "",
      discipulado: false,
      cae: false,
      escolaProfeta: false,
    },
  });

  const isBatizado = watch("batizado");
  const dataBatismoValue = watch("dataBatismo");

  // 🔹 Preenche dados se for edição
  useEffect(() => {
    if (!isEdit) return;

    const normalizedRole = member.role?.toLowerCase() || "";
    const matchingRole = roles.find((r) => r.toLowerCase() === normalizedRole) || "";

    const cemValue =
      member.cem?._id && member.cem?.name ? `${member.cem._id}-${member.cem.name}` : "";

    const init: FormValues = {
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      birthDate: member.birthDate?.split("T")[0] || "",
      street: member.street || "",
      cemId: cemValue,
      role: matchingRole,
      encontroComDeus: member.encontroComDeus ?? false,
      reencontroComDeus: member.reencontroComDeus ?? false,
      sejaLivre: member.sejaLivre ?? false,
      batizado: member.batizado ?? false,
      dataBatismo: toDateInput(member.data_batismo),
      discipulado: member.discipulado ?? false,
      cae: member.cae ?? false,
      escolaProfeta: member.escolaProfeta ?? false,
    };

    setInitialData(init);
    Object.entries(init).forEach(([key, value]) => setValue(key as keyof FormValues, value));
  }, [isEdit, member, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      let response;

      if (isEdit) {
        // PATCH → apenas campos alterados
        const changes: Partial<FormValues & { cem: { _id: string; name: string } }> = {};

        Object.entries(data).forEach(([key, value]) => {
          if (value !== (initialData as any)?.[key]) {
            //@ts-ignore
            changes[key as keyof FormValues] = value;
          }
        });
        console.log("Campos alterados:", changes);

        if (changes.cemId) {
  changes.cem = extractCem(changes.cemId); // ✅ sem erro de tipo
  delete changes.cemId;
}

        if ("dataBatismo" in changes || "batizado" in changes) {
          const finalBatizado = (changes.batizado ?? initialData?.batizado) === true;
          const raw = (changes.dataBatismo ?? initialData?.dataBatismo) as string;
          changes.data_batismo = finalBatizado && raw ? buildBatismoISO(raw) : null;
          delete changes.dataBatismo;
        }

        response = await useHttpPatch({
          url: `/api/protected/churches/${member.churchId}/users/${member._id}`,
          data: changes,
        });
      } else {
        // POST → cria novo usuário
        let payload: any = { ...(data as object) };

       if (payload.cemId) {
  payload.cem = extractCem(payload.cemId); // ✅ sem erro de tipo
  delete payload.cemId;
}

        if ("dataBatismo" in payload) {
          payload.data_batismo =
            payload.batizado && payload.dataBatismo
              ? buildBatismoISO(payload.dataBatismo)
              : null;
          delete payload.dataBatismo;
        }

        response = await useHttpPost({
          url: `/api/protected/churches/${session?.user.churchId}/redes/${session?.user.cem._id}/members`,
          data: payload,
        });
      }

      setIsLoading(false);
      await onUpdated();

      if (response?.error) {
        Toast.showError(isEdit ? "Erro ao atualizar!" : "Erro ao criar!");
        return;
      }

      Toast.showSuccess(isEdit ? "Atualizado com sucesso!" : "Criado com sucesso!");
      onClose();
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      Toast.showError(isEdit ? "Erro ao atualizar!" : "Erro ao criar!");
    }
  });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground p-6 rounded-md w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-700 dark:text-white">
          {isEdit ? "Editar Membro" : "Criar Membro"}
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Nome e Email */}
          <div className="flex flex-col md:flex-row gap-4">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex flex-col flex-1">
                  <Label>Nome</Label>
                  <Input
                    {...field}
                    placeholder="Nome Completo"
                    className="uppercase"
                    onChange={(e) => field.onChange(Masks.inputName(e.target.value))}
                  />
                  {errors.name && <p className="text-sm text-red-400">Obrigatório</p>}
                </div>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col flex-1">
                  <Label>Email</Label>
                  <Input {...field} placeholder="Email" className="lowercase" />
                </div>
              )}
            />
          </div>

          {/* Phone e Birth */}
          <div className="flex flex-col md:flex-row gap-4">
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex flex-col flex-1">
                  <Label>WhatsApp</Label>
                  <Input
                    {...field}
                    placeholder="WhatsApp"
                    onChange={(e) => field.onChange(Masks.phone(e.target.value))}
                  />
                  {errors.phone && <p className="text-sm text-red-400">Obrigatório</p>}
                </div>
              )}
            />
            <Controller
              name="birthDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex flex-col flex-1">
                  <Label>Data de Nascimento</Label>
                  <Input {...field} type="date" />
                  {errors.birthDate && <p className="text-sm text-red-400">Obrigatório</p>}
                </div>
              )}
            />
          </div>

          {/* Address */}
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col w-full">
                <Label>Endereço</Label>
                <Input {...field} placeholder="Endereço Completo" className="uppercase w-full" />
              </div>
            )}
          />

          {/* CEM */}
          <SelectCem
            name="cemId"
            control={control}
            churchId={member?.churchId || session?.user.churchId}
            title="Rede"
            errors={{}}
          />

          {/* Role */}
          <SelectProfile
            title="Cargo Eclesiástico"
            name="role"
            control={control}
            errors={errors}
            options={roles}
          />

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "encontroComDeus", label: "Encontro com Deus" },
              { name: "cae", label: "C.A.E" },
              { name: "reencontroComDeus", label: "Reencontro com Deus" },
              { name: "sejaLivre", label: "Seja Livre" },
              { name: "batizado", label: "Batizado" },
              { name: "discipulado", label: "Discipulado" },
              { name: "escolaProfeta", label: "Escola de Profetas" },
            ].map(({ name, label }) => {
              const labelText =
                name === "batizado" && isBatizado && dataBatismoValue
                  ? `${label} (${formatInputDate(dataBatismoValue)})`
                  : label;

              return (
                <Controller
                  key={name}
                  name={name as keyof FormValues}
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2">
                      <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                      <span>{labelText}</span>
                    </label>
                  )}
                />
              );
            })}
          </div>

          {/* Data do Batismo */}
          {isBatizado && (
            <Controller
              name="dataBatismo"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-full md:w-1/2">
                  <Label>Data do Batismo</Label>
                  <Input {...field} type="date" />
                </div>
              )}
            />
          )}

          {/* Botões */}
          <div className="flex flex-row justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose} className="w-full sm:w-40">
              <X className="w-4 h-4 mr-2" /> Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-40 bg-primary">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" /> Salvar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
