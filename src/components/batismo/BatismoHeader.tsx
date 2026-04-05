import { baptism } from "@/domain/models/baptism";
import ButtonNew from "@/components/ButtonSubmit/buttonAdd";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { Droplets, Users, CalendarCheck } from "lucide-react";
import { useSession } from "next-auth/react";

type HeaderProps = {
  title: string;
  totalEventos: number;
  totalBatizandos: number;
  ultimaData?: string;
  pathname: string;
  inputFileRef: React.RefObject<HTMLInputElement>;
};

type Props = {
  pathname: string;
  inputFileRef: React.RefObject<HTMLInputElement>;
  batismo: baptism[];
};

const BatismoHeader = ({ pathname, inputFileRef, batismo }: Props) => {
  const totalEventos = batismo.length;
  const isMobile = useIsMobile();

  const totalBatizandos = batismo.reduce(
    (acc, item) => acc + (item.batizandos?.length || 0),
    0
  );

  const ultimoBatismo = batismo
    .slice()
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

  const dataUltimo = ultimoBatismo?.data
    ? !isMobile
      ? format(new Date(ultimoBatismo.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : format(new Date(ultimoBatismo.data), "dd/MM/yy", { locale: ptBR })
    : "-";

  return (
    <Header
      title="Batismos"
      totalEventos={totalEventos}
      totalBatizandos={totalBatizandos}
      ultimaData={dataUltimo}
      pathname={pathname}
      inputFileRef={inputFileRef}
    />
  );
};

export default BatismoHeader;

const Header = ({
  title,
  totalEventos,
  totalBatizandos,
  ultimaData,
  pathname,
  inputFileRef,
}: HeaderProps) => {

  const { data: session } = useSession();
  if (!session?.user?.permission) return null;
  const permission = session?.user?.permission as string[];
  const isAdmin = permission.some((p) => p === "admin" || p === "secretaria");


  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-semibold tracking-tight leading-none">
              {title}
            </h2>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 leading-none">
              Gestão de batismo
            </p>
          </div>
        </div>
        {isAdmin && (
          <Link href={`${pathname}/new`}>
            <ButtonNew />
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x">
        <div className="flex items-center gap-2.5 px-3 py-3 sm:px-5 sm:py-4">
          <CalendarCheck className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Batismos
            </p>
            <p className="text-xl sm:text-2xl font-bold leading-tight">{totalEventos}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-3 sm:px-5 sm:py-4">
          <Users className="w-4 h-4 text-primary shrink-0 hidden sm:block" />
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Batizandos
            </p>
            <p className="text-xl sm:text-2xl font-bold text-primary leading-tight">
              {totalBatizandos}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 py-3 sm:px-5 sm:py-4">
          <CalendarCheck className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
              Último
            </p>
            <p className="text-sm sm:text-base font-semibold leading-tight">{ultimaData}</p>
          </div>
        </div>
      </div>
    </div>
  );
};