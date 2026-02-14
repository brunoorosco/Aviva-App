import Link from "next/link";
import { Edit, EyeIcon, Calendar, Users } from "lucide-react";
import { TEncontroComDeus } from "@/domain/models/encontroComDeus";

type Props = {
  encontro: TEncontroComDeus;
  onEdit: () => void;
  basePath: string;
};

const EncontroComDeusItem = ({ encontro, onEdit, basePath }: Props) => {
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

  const reencontristasCount = encontro?.encontristas?.length ?? 0;

  return (
    <div className="group relative">
      <Link href={`${basePath}/${encontro._id}`}>
        <article
          className="
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-sm hover:shadow-md 
          transition-all duration-200 ease-in-out
          p-4 mb-3
          hover:border-blue-300 dark:hover:border-blue-600
          active:scale-[0.98]
        "
        >
          {/* Header com data */}
          <header className="mb-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <time className="text-sm font-medium">{formatDate(encontro.data)}</time>
            </div>
          </header>

          {/* Conteúdo principal */}
          <div className="space-y-3">
            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Encontristas:</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {reencontristasCount}
                  </span>
                </div>
              </div>

              {/* Badge de status (opcional) */}
              <div
                className="
                px-2 py-1 
                bg-green-100 dark:bg-green-900/30 
                text-green-700 dark:text-green-300
                text-xs font-medium rounded-full
                border border-green-200 dark:border-green-700
              "
              >
                <div className="flex gap-2">
                  <span className="text-sm">Encontro Nº:</span>
                  <time className="text-sm font-medium">{encontro.numero}</time>
                </div>
              </div>
            </div>

            {/* Footer com ação */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Clique para visualizar detalhes
              </span>
              <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        </article>
      </Link>

      {/* Botão de editar flutuante (opcional) */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        className="
          absolute top-3 right-3
          w-8 h-8 
          bg-white dark:bg-gray-700 
          border border-gray-200 dark:border-gray-600
          rounded-full 
          shadow-sm hover:shadow-md
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-all duration-200
          hover:bg-blue-50 dark:hover:bg-blue-900/30
          hover:border-blue-300 dark:hover:border-blue-600
          active:scale-95
          z-10
        "
        aria-label="Editar Encontro"
      >
        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
      </button>
    </div>
  );
};

export default EncontroComDeusItem;
