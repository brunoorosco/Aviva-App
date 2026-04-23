import Link from "next/link";
import { Edit, EyeIcon, Calendar, Users, FileText, DollarSign, Download } from "lucide-react";
import { TReencontroComDeus } from "@/domain/models/encontroComDeus";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { hasPermission, ROLES } from "@/lib/permissions";
import ExportButton from "./ExportButton";

type Props = {
  reencontro: TReencontroComDeus;
  onEdit: () => void;
  basePath: string;
};

const ReencontroComDeusItem = ({ reencontro, onEdit, basePath }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();

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

  // Verifica se o reencontro é futuro (data superior à data atual)
  const isReencontroFuturo = () => {
    if (!reencontro.data) return false;
    const dataReencontro = typeof reencontro.data === "string" ? new Date(reencontro.data) : reencontro.data;
    const hoje = new Date();
    hoje.setDate(hoje.getDate() - 1);
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data
    const data = dataReencontro >= hoje;
    return data;
  };

  const handleFichaInscricao = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`${basePath}/inscricao/novo?reencontroId=${reencontro._id}`);
  };

  const handleRelatorioFinanceiro = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`${basePath}/${reencontro._id}/resumo-financeiro`);
  };

  // Verifica se o usuário tem permissão para ver relatório financeiro
  const canViewFinancialReport = () => {
    if (!session?.user) return false;
    const userPermissions = session.user.permission || [];
    return hasPermission(userPermissions, [ROLES.ADMIN, ROLES.SECRETARIA]);
  };

  // Verifica se o usuário tem permissão para editar o reencontro (somente Admin)
  const canEditReencontro = () => {
    if (!session?.user) return false;
    const userPermissions = session.user.permission || [];
    return hasPermission(userPermissions, [ROLES.ADMIN]);
  };

  const reencontristasCount = reencontro?.reencontristas?.length ?? 0;
  const equipeCount = reencontro?.equipe?.length ?? 0;

  return (
    <div className="group relative">
      <Link href={`${basePath}/${reencontro._id}`}>
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
          {/* Header com data */}
          <header className="mb-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <time className="text-sm font-medium">{formatDate(reencontro.data)}</time>
              {reencontro.descricao && (
                <span className="text-xs text-gray-400 dark:text-gray-500 italic ml-2">
                  - {reencontro.descricao}
                </span>
              )}

              {/* Botão de editar ao lado da data (Somente Admin) */}
              {canEditReencontro() && (
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
                  aria-label="Editar Reencontro"
                >
                  <Edit className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                </button>
              )}
            </div>
          </header>

          {/* Conteúdo principal */}
          <div className="space-y-3">
            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex gap-10">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-orange-400 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Reencontristas:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-orange-400">
                      {reencontristasCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-orange-400 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Equipe:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-orange-400">
                      {equipeCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badge de status (opcional) */}
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
                  <span className="text-sm">Reencontro Nº:</span>
                  <time className="text-sm font-medium">{reencontro.numero}</time>
                </div>
              </div>
            </div>

            {/* Footer com ação e botões */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Clique para visualizar detalhes
              </span>

              <div className="flex items-center gap-2">
                {/* Botão de Exportar - sempre visível se houver dados */}
                {reencontro.reencontristas && reencontro.reencontristas.length > 0 && (
                  <ExportButton reencontro={reencontro} />
                )}

                {/* Botão de Relatório Financeiro - visível para Admin, Pastor e Secretaria */}
                {canViewFinancialReport() && reencontro.financeiro && (
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

                {/* Botão de Ficha de Inscrição - sempre visível para reencontros futuros */}
                {(isReencontroFuturo() || canViewFinancialReport()) && (
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
                    <span className="hidden sm:inline">Ficha de Inscrição</span>
                  </button>
                )}

                <EyeIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-orange-400  transition-colors" />
              </div>
            </div>
          </div>
        </article>
      </Link>

    </div>
  );
};

export default ReencontroComDeusItem;
