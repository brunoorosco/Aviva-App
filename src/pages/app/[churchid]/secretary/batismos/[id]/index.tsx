import { Button } from "@/components/ui/button";
import { baptism } from "@/domain/models/baptism";
import { getBatismoByIdService } from "@/services/batismos";
import { capitalizeWords } from "@/utils/capitalizaFirst";
import { ArrowLeft, PrinterIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GetServerSideProps } from "next/types";

function formatDate(dateValue: any) {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

type Props = {
  batismo: baptism | null;
};

export default function batismoPage({ batismo }: Props) {
  const router = useRouter();
  const { churchid } = useParams();
  if (!batismo) return <p>batismo não encontrado.</p>;
  return (
    <div className="sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        {/* LEFT */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Batismo</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Data */}
            <span className="text-muted-foreground">{formatDate(batismo.data)}</span>

            {/* Badge total */}
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
              {batismo.batizandos.length} batizados
            </span>

            {/* Local */}
            {batismo.local && (
              <span className="text-muted-foreground">
                📍 {Array.isArray(batismo.local) ? batismo.local.join(", ") : batismo.local}
              </span>
            )}
          </div>
        </div>

        {/* ACTION */}
        <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          Voltar
        </Button>
      </div>

      <div className="bg-gray-50 dark:bg-dark-secondary p-2 shadow">
        <h2 className="text-xl font-semibold mb-2">Batizandos</h2>

        {batismo.batizandos.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum encontrista cadastrado.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3">
            {batismo.batizandos.map((pessoa, index) => (
              <li
                key={index}
                className="bg-card border rounded-lg px-3 py-3 flex items-center justify-between hover:shadow-sm transition"
              >
                {/* LEFT */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {index + 1}. {capitalizeWords(pessoa.nome)}
                  </span>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {pessoa.rede && <span>Rede: {pessoa.rede}</span>}
                    {pessoa.sexo && (
                      <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                        {pessoa.sexo === "M" ? "Masculino" : "Feminino"}
                      </span>
                    )}
                  </div>
                </div>

                {/* ACTION */}
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
                  className="text-primary hover:opacity-80"
                >
                  <PrinterIcon className="w-4 h-4" />
                </Link>
              </li>
            ))}
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
