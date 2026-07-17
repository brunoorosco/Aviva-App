import { TConferencia } from "@/domain/models/conferencia";
import { Card, CardContent } from "../ui/card";
import { Calendar, Home, Plus, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import { getRedeName } from "@/utils/helpersNameREde";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";
import { hasPermission, ROLES } from "@/lib/permissions";

type Props = {
  pathname: string;
  inputFileRef: React.RefObject<HTMLInputElement>;
  conferencia: TConferencia[];
  onImportSuccess?: () => void;
};

type TProps<T> = {
  total: number;
  pathname: string;
  inputFileRef: React.RefObject<HTMLInputElement>;
  data: T[];
  mapExport?: any;
  sheetName?: string;
  filename?: string;
  title?: string;
  icon?: React.ReactNode;
  description?: string;
  onImportSuccess?: () => void;
};

const ConferenciaHeader = ({
  pathname,
  inputFileRef,
  conferencia,
  onImportSuccess,
}: Props) => {
  const mapReencontroToExport = (m: any) => {
    return {
      nome: m?.nome,
      rede: m?.rede,
      igreja: m?.igreja,
      idade: m?.idade,
      email: m?.email,
      equipe: m?.equipe,
    };
  };

  return (
    <Header<TConferencia>
      title="Conferências"
      description="Gerencie e acompanhe todas as nossas Conferências"
      total={conferencia.length}
      pathname={pathname}
      inputFileRef={inputFileRef}
      data={conferencia}
      mapExport={mapReencontroToExport}
      sheetName="conferencias"
      filename="conferencias.xlsx"
      icon={<Home className="w-6 h-6" />}
      onImportSuccess={onImportSuccess}
    />
  );
};

export default ConferenciaHeader;

const Header = <T extends TConferencia>({
  total,
  pathname,
  data,
  mapExport,
  title = "Itens",
  icon,
  description,
  onImportSuccess,
  inputFileRef,
}: TProps<T>) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalParticipantes: 0,
        participantesThisMonth: 0,
        totalRedes: 0,
        avgParticipantesPorRegistro: 0,
      };
    }

    const totalParticipantes = data.reduce(
      (sum, item) => sum + (item.participantes?.length || 0),
      0
    );

    const now = new Date();
    const participantesThisMonth = data
      .filter((item) => {
        if (!item.data) return false;
        const date = new Date(item.data);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, item) => sum + (item.participantes?.length || 0), 0);

    const redesSet = new Set<string>();
    data.forEach((item) => {
      item.participantes?.forEach((p) => {
        const redeName = getRedeName(p.rede);
        if (redeName) redesSet.add(redeName);
      });
    });
    const totalRedes = redesSet.size;

    const avgParticipantesPorRegistro =
      total > 0 ? (totalParticipantes / total).toFixed(1) : 0;

    return {
      totalParticipantes,
      participantesThisMonth,
      totalRedes,
      avgParticipantesPorRegistro,
    };
  }, [data, total]);

  const { data: session } = useSession();
  const canViewButtons = () => {
    if (!session?.user) return false;
    const userPermissions = session.user.permission || [];
    return hasPermission(userPermissions, [ROLES.ADMIN, ROLES.SECRETARIA]);
  };

  return (
    <Card className="shadow-sm border-2 border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            {icon && (
              <div className="hidden sm:flex p-3 bg-blue-100 dark:bg-orange-900/30 rounded-xl shrink-0">
                <div className="text-blue-600 dark:text-orange-400">{icon}</div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-orange-900/30 dark:text-orange-400 w-fit">
                  {total} {total === 1 ? "conferência" : "conferências"}
                </Badge>
              </div>

              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}

              {stats.totalParticipantes > 0 && (
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-3xl font-bold text-blue-600 dark:text-orange-400">
                    {stats.totalParticipantes}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Participantes
                  </span>
                </div>
              )}
            </div>
          </div>

          {canViewButtons() && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
              {/* <ImportButton inputFileRef={inputFileRef} onSuccess={onImportSuccess} /> */}
              <Link href={`${pathname}/new`} className="w-full sm:w-auto">
                <Button
                  className="text-white w-full h-full bg-blue-500 hover:bg-blue-600 font-semibold dark:bg-orange-500 dark:hover:bg-orange-600"
                  size="default"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Nova Conferência</span>
                  <span className="sm:hidden">Nova</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Conferências
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {total}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                  Este Mês
                </p>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {stats.participantesThisMonth}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                  Média/Evento
                </p>
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {stats.avgParticipantesPorRegistro}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                  Redes Ativas
                </p>
              </div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {stats.totalRedes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
