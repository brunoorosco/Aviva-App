import { baptism } from "@/domain/models/baptism";
import ButtonNew from "@/components/ButtonSubmit/buttonAdd";
import Link from "next/link";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const totalBatizandos = batismo.reduce((acc, item) => acc + (item.batizandos?.length || 0), 0);

  const ultimoBatismo = batismo
    .slice()
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

  const dataUltimo = ultimoBatismo?.data
    ? !isMobile
      ? format(new Date(ultimoBatismo.data), "dd 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        })
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
  return (
    <div className="flex flex-col gap-6 p-6 bg-card rounded-xl border shadow-sm">
      {/* Top */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

          <p className="text-sm text-muted-foreground mt-1">Gestão de eventos de batismo</p>
        </div>

        <Link href={`${pathname}/new`}>
          <ButtonNew />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-muted/40">
          <p className="text-sm text-muted-foreground">Eventos</p>
          <p className="text-2xl font-bold">{totalEventos}</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/40">
          <p className="text-sm text-muted-foreground">Batizandos</p>
          <p className="text-2xl font-bold text-primary">{totalBatizandos}</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/40">
          <p className="text-sm text-muted-foreground">Último batismo</p>
          <p className="text-lg font-medium">{ultimaData}</p>
        </div>
      </div>
    </div>
  );
};
