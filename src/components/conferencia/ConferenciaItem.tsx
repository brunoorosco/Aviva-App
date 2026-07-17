import { Edit, Calendar, Users, FileText, DollarSign, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TConferencia } from "@/domain/models/conferencia";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { hasPermission, ROLES } from "@/lib/permissions";
import { useHttpPatch } from "@/hooks/api";
// import ExportButton from "./ExportButton"; // To be implemented later if needed

type Props = {
  conferencia: TConferencia;
  onEdit: () => void;
  basePath: string;
  onToggleSuccess?: () => void;
};

const ConferenciaItem = ({ conferencia, onEdit, basePath, onToggleSuccess }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleToggleAllowPast = async (checked: boolean) => {
    await useHttpPatch({
      url: `/api/protected/churches/${conferencia.churchId || "default"}/conferencia/${conferencia._id}`,
      data: { allowPastEdits: checked },
    });
    onToggleSuccess?.();
  };

  const isItemAllowed = conferencia.allowPastEdits ?? false;

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Data não definida";
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (!(date instanceof Date) || isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isConferenciaFutura = () => {
    if (!conferencia.data) return false;
    const dataConferencia = typeof conferencia.data === "string" ? new Date(conferencia.data) : conferencia.data;
    const hoje = new Date();
    hoje.setDate(hoje.getDate() - 1);
    hoje.setHours(0, 0, 0, 0);
    const data = dataConferencia >= hoje;
    return data;
  };

  const handleFichaInscricao = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`${basePath}/inscricao/novo?conferenciaId=${conferencia._id}`);
  };

  const handleRelatorioFinanceiro = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`${basePath}/${conferencia._id}/resumo-financeiro`);
  };

  const handleViewParticipants = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`${basePath}/${conferencia._id}`);
  };

  const canViewFinancialReport = () => {
    if (!session?.user) return false;
    const userPermissions = session.user.permission || [];
    return hasPermission(userPermissions, [ROLES.ADMIN, ROLES.SECRETARIA]);
  };

  const canEditConferencia = () => {
    if (!session?.user) return false;
    const userPermissions = session.user.permission || [];
    return hasPermission(userPermissions, [ROLES.ADMIN]);
  };

  const participantesCount = conferencia?.participantes?.length ?? 0;
  const equipeCount = conferencia?.equipe?.length ?? 0;

  return (
    <div className="group relative">
      <article
        className="
          bg-gray-50 dark:bg-dark-secondary 
          border border-gray-200 dark:border-orange-900/30
          rounded-lg shadow-sm hover:shadow-md 
          transition-all duration-200 ease-in-out
          p-4 mb-3
          hover:border-blue-300 dark:hover:border-orange-600
          active:scale-[0.98]
        "
      >
        <header className="mb-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <time className="text-sm font-medium">{formatDate(conferencia.data)}</time>
            {conferencia.descricao && (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic ml-2">
                - {conferencia.descricao}
              </span>
            )}

            {canEditConferencia() && (
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Switch
                  id={`allow-past-${conferencia._id}`}
                  checked={isItemAllowed}
                  onCheckedChange={handleToggleAllowPast}
                  className="scale-75 origin-right"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="
                    w-7 h-7 
                    bg-white dark:bg-gray-700 
                    border border-gray-200 dark:border-gray-600
                    rounded-full 
                    shadow-sm hover:shadow-md
                    flex items-center justify-center
                    transition-all duration-200
                    hover:bg-blue-50 dark:hover:bg-blue-900/30
                    hover:border-blue-300 dark:hover:border-blue-600
                    active:scale-95
                  "
                  aria-label="Editar Conferência"
                >
                  <Edit className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-orange-400 flex-shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Participantes:</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-orange-400">
                    {participantesCount}
                  </span>
                </div>
              </div>
              {equipeCount > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-orange-400 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Equipe:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-orange-400">
                      {equipeCount}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              className="
              px-2 py-1 
              bg-green-100 dark:bg-orange-900/30 
              text-green-700 dark:text-orange-300
              text-xs font-medium rounded-full
              border border-green-200 dark:border-orange-700
            "
            >
              <div className="flex gap-2">
                <time className="text-sm font-medium">{conferencia.numero}</time>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={handleViewParticipants}
                className="
                  px-3 py-1.5
                  bg-gray-600 hover:bg-gray-700
                  text-white text-xs font-medium
                  rounded-md shadow-sm hover:shadow-md
                  flex items-center gap-1.5
                  transition-all duration-200
                  active:scale-95
                "
                aria-label="Visualizar Participantes"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Participantes</span>
              </button>

              {canViewFinancialReport() && conferencia.financeiro && (
                <button
                  onClick={handleRelatorioFinanceiro}
                  className="
                    px-3 py-1.5
                    bg-blue-600 hover:bg-blue-700
                    text-white text-xs font-medium
                    rounded-md shadow-sm hover:shadow-md
                    flex items-center gap-1.5
                    transition-all duration-200
                    active:scale-95
                  "
                  aria-label="Relatório Financeiro"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Relatório Financeiro</span>
                </button>
              )}

              {(isConferenciaFutura() || canViewFinancialReport() || isItemAllowed) && (
                <button
                  onClick={handleFichaInscricao}
                  className="
                    px-3 py-1.5
                    bg-green-600 hover:bg-green-700
                    text-white text-xs font-medium
                    rounded-md shadow-sm hover:shadow-md
                    flex items-center gap-1.5
                    transition-all duration-200
                    active:scale-95
                  "
                  aria-label="Ficha de Inscrição"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Inscrição de Rede</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ConferenciaItem;
