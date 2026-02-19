import Link from "next/link";
import { useState } from "react";
import { PrinterIcon } from "lucide-react";
import { baptism } from "@/domain/models/baptism";
import { gerarCertificados } from "../../lib/pdf";

type Props = {
  batismos: baptism;
  onEdit: () => void;
  basePath: string;
};

const BatismoItem = ({ batismos, onEdit, basePath }: Props) => {
  const [disabled, setDisabled] = useState(false);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "";

    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const total = batismos.batizandos?.length || 0;

  const redes = [...new Set(batismos.batizandos?.map((b: any) => b.rede).filter(Boolean))];

  return (
    <Link href={`${basePath}/${batismos._id}`}>
      <li className="bg-card border rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex flex-col gap-1">
          {/* Linha principal */}
          <div className="flex items-center gap-3">
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
        </div>

        {/* ACTIONS */}
        <button
          onClick={(e) => {
            e.preventDefault();
            gerarCertificados(batismos.churchId, batismos);
          }}
          className="flex items-center gap-1 text-sm text-primary hover:opacity-80"
        >
          <PrinterIcon className="w-4 h-4" />
          Certificados
        </button>
      </li>
    </Link>
  );
};

export default BatismoItem;
