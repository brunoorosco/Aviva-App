import Link from "next/link";
import { useState } from "react";
import { PrinterIcon, Edit3 } from "lucide-react";
import { baptism } from "@/domain/models/baptism";
import { gerarCertificados } from "../../lib/pdf";
import { useSession } from "next-auth/react";

type Props = {
  batismos: baptism;
  onEdit: () => void;
  basePath: string;
};

const BatismoItem = ({ batismos, onEdit, basePath }: Props) => {
  const { data: session } = useSession();
  const [disabled, setDisabled] = useState(false);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "";
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const isAdmin = session?.user?.permission?.includes("admin");

  const getDateOnly = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const baptismDate = new Date(batismos.data);
  const dataString = batismos.data as unknown as string;
  if (typeof dataString === "string" && dataString.length <= 10) {
    baptismDate.setHours(12, 0, 0, 0);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFuture = getDateOnly(baptismDate) >= today.getTime() || isAdmin;

  const total = batismos.batizandos?.length || 0;
  const redes = [...new Set(batismos.batizandos?.map((b: any) => b.rede).filter(Boolean))];

  return (
    <li className="bg-card border rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* INFO */}
        <Link href={`${basePath}/${batismos._id}`} className="flex-1 flex flex-col gap-1">
          {/* Data + badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold">{formatDate(batismos.data)}</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              {total} batizados
            </span>
          </div>

          {/* Local */}
          {batismos.local && (
            <span className="text-xs text-muted-foreground">
              📍 {Array.isArray(batismos.local) ? batismos.local.join(", ") : batismos.local}
            </span>
          )}

          {/* Redes */}
          {redes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {redes.slice(0, 4).map((r) => (
                <span key={r} className="text-[10px] px-2 py-0.5 rounded bg-muted">
                  {r}
                </span>
              ))}
              {redes.length > 4 && (
                <span className="text-[10px] text-muted-foreground">+{redes.length - 4}</span>
              )}
            </div>
          )}
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:justify-end">
          {isFuture && (
            <Link
              href={`${basePath}/${batismos._id}`}
              className="flex items-center gap-2 text-xs sm:text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-bold uppercase w-full sm:w-auto justify-center"
            >
              <Edit3 className="w-4 h-4 shrink-0" />
              Editar Batismo
            </Link>
          )}

          {isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                gerarCertificados(batismos.churchId, batismos);
              }}
              className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:opacity-80 p-1.5 w-full sm:w-auto justify-center"
            >
              <PrinterIcon className="w-4 h-4 shrink-0" />
              Certificados
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default BatismoItem;