import { Button } from "@/components/ui/button";
import { baptism } from "@/domain/models/baptism";
import { getBatismoByIdService } from "@/services/batismos";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import { ArrowLeft, PrinterIcon, Trash2, Plus, UserPlus, Edit3 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Toast from "@/components/Toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupervisorSelect } from "@/components/Select/SelectSupervisores";
import { useForm, Controller } from "react-hook-form";

function formatDate(dateValue: any) {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

type Props = {
  batismo: baptism | null;
};

export default function BatismoPage({ batismo: initialBatismo }: Props) {
  const router = useRouter();
  const { churchid } = useParams();
  const { data: session } = useSession();
  const [batismo, setBatismo] = useState(initialBatismo);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!batismo) return <p className="p-10 text-center">Batismo não encontrado.</p>;
  
  // Regra de Administrador
  const isAdmin = session?.user?.role?.toLowerCase() === "bispo" || session?.user?.role?.toLowerCase() === "admin";
  const userRede = session?.user?.cem?.name;

  // Comparação de data robusta (apenas dia, mês e ano)
  const getDateOnly = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const baptismDate = new Date(batismo.data);
  // Se a data vier como string YYYY-MM-DD, JS pode ler como UTC 00:00 (dia anterior no BR).
  // Forçamos o deslocamento para garantir o dia correto.
  const dataString = batismo.data as unknown as string;
  if (typeof dataString === 'string' && dataString.length <= 10) {
    baptismDate.setHours(12, 0, 0, 0);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isFutureOrAdmin = getDateOnly(baptismDate) >= today.getTime() || isAdmin;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nome: "",
      sexo: "",
      rede: "",
    },
  });

  const onAddCandidate = async (data: any) => {
    try {
      setIsLoading(true);
      const payload = {
        nome: data.nome.toUpperCase(),
        sexo: data.sexo,
        rede: isAdmin ? data.rede.split("|")[1] : userRede,
      };

      await axios.post(`/api/protected/churches/${churchid}/batismo/${batismo._id}`, payload);
      
      Toast.showSuccess("Batizando adicionado!");
      
      // Atualizar lista local
      setBatismo({
        ...batismo,
        batizandos: [...batismo.batizandos, { 
          nome: payload.nome, 
          rede: payload.rede, 
          sexo: payload.sexo,
          isCourse: false 
        }].sort((a, b) => a.nome.localeCompare(b.nome)),
      });

      setIsAdding(false);
      reset();
    } catch (error) {
      console.error(error);
      Toast.showError("Erro ao adicionar batizando.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeCandidate = async (nome: string, rede: string) => {
    if (!confirm(`Deseja remover ${nome}?`)) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/protected/churches/${churchid}/batismo/${batismo._id}`, {
        data: { nome, rede },
      });

      Toast.showSuccess("Batizando removido!");
      setBatismo({
        ...batismo,
        batizandos: batismo.batizandos.filter(p => !(p.nome === nome && p.rede === rede)),
      });
    } catch (error) {
      console.error(error);
      Toast.showError("Erro ao remover batizando.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sm:p-6 mt-10 max-w-4xl mx-auto pb-20">
      <div className="flex items-start justify-between gap-4 p-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Batismo</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">{formatDate(batismo.data)}</span>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
              {batismo.batizandos.length} batizandos
            </span>
            {batismo.local && (
              <span className="text-muted-foreground">
                📍 {Array.isArray(batismo.local) ? batismo.local.join(", ") : batismo.local}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {isFutureOrAdmin && (
            <Button 
              onClick={() => setIsAdding(!isAdding)} 
              variant={isAdding ? "outline" : "default"} 
              className={`flex items-center gap-2 ${!isAdding ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : ''}`}
            >
              {isAdding ? "Cancelar Inscrição" : <><UserPlus size={18} /> Adicionar Batizando</>}
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft size={18} />
            Voltar
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-dark-secondary p-6 rounded-xl border shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-medium mb-4">Novo Batizando</h3>
          <form onSubmit={handleSubmit(onAddCandidate)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <Label>Nome Completo</Label>
              <Controller
                name="nome"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Input {...field} placeholder="NOME DO BATIZANDO" className="uppercase" />}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Sexo</Label>
              <Controller
                name="sexo"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {isAdmin ? (
              <div className="flex flex-col gap-1.5 text-black">
                <Label>Rede</Label>
                <SupervisorSelect control={control} name="rede" title="Selecione a Rede" />
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label>Rede</Label>
                <Input value={userRede || ""} disabled className="bg-muted" />
              </div>
            )}

            <div className="sm:col-span-3 flex justify-end mt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Confirmar Inscrição"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-background px-2 py-4 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 px-2">Batizandos Confirmados</h2>

        {batismo.batizandos.length === 0 ? (
          <p className="text-sm text-center py-10 text-gray-500">Nenhum batizando cadastrado até o momento.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3 p-2">
            {batismo.batizandos.map((pessoa, index) => {
              const canDelete = isAdmin || (userRede && pessoa.rede === userRede);
              
              return (
                <li
                  key={index}
                  className="bg-white dark:bg-dark-secondary border rounded-lg px-4 py-3 flex items-center justify-between hover:shadow-md transition group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {index + 1}. {capitalizeWords(pessoa.nome)}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      {pessoa.rede && <span>Rede: {pessoa.rede}</span>}
                      {pessoa.sexo && (
                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                          {pessoa.sexo === "M" ? "Masculino" : "Feminino"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      download
                      target="_blank"
                      href={{
                        pathname: `/api/protected/churches/${churchid}/baptism/certificado-pdf`,
                        query: {
                          nome: capitalizeWords(pessoa.nome),
                          data: formatDate(batismo.data),
                        },
                      }}
                      className="text-primary hover:opacity-80 p-2 rounded-full hover:bg-primary/10 transition"
                      title="Imprimir Certificado"
                    >
                      <PrinterIcon className="w-4 h-4" />
                    </Link>

                    {isFutureOrAdmin && canDelete && (
                      <button
                        onClick={() => removeCandidate(pessoa.nome, pessoa.rede || "")}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                        title="Remover Batizando"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string;
  const churchid = ctx.params?.churchid as string;
  const batismo = await getBatismoByIdService(churchid, id);

  if (!batismo) return { props: { batismo: null } };

  return {
    props: {
      batismo: {
        ...batismo,
        _id: batismo._id.toString(),
        data: batismo?.data?.toString(),
        batizandos: batismo.batizandos || [],
      },
    },
  };
};
