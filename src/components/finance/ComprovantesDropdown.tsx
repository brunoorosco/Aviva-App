import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, ChevronDown, ExternalLink } from "lucide-react";
import { PagamentoResumo } from "./types";
import { ComprovanteModal } from "./ComprovanteModal";

interface Props {
  pagamentos?: PagamentoResumo[];
}

export function ComprovantesDropdown({ pagamentos }: Props) {
  const [selectedComprovante, setSelectedComprovante] = useState<{
    url: string;
    name?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!pagamentos || pagamentos.length === 0) {
    return null;
  }

  const pagamentosComComprovante = pagamentos.filter((p) => p.comprovanteUrl);

  if (pagamentosComComprovante.length === 0) {
    return null;
  }

  const handleViewComprovante = (comprovante: { comprovanteUrl: string; comprovanteName?: string }) => {
    setSelectedComprovante({
      url: comprovante.comprovanteUrl,
      name: comprovante.comprovanteName,
    });
    setIsModalOpen(true);
  };

  const handleOpenAllInNewTab = () => {
    pagamentosComComprovante.forEach((p) => {
      if (p.comprovanteUrl) {
        window.open(p.comprovanteUrl, "_blank", "noopener,noreferrer");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Comprovantes ({pagamentosComComprovante.length})
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto">
          <div className="p-2 space-y-1">
            {pagamentosComComprovante.map((pagamento) => (
              <DropdownMenuItem key={pagamento._id} className="flex flex-col gap-1 p-2 cursor-pointer">
                <div
                  className="flex items-center justify-between w-full"
                  onClick={() => handleViewComprovante(pagamento)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {pagamento.comprovanteName || "Comprovante"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pagamento.data).toLocaleDateString("pt-BR")} -{" "}
                        {pagamento.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          {pagamentosComComprovante.length > 1 && (
            <div className="border-t mt-1 pt-1 px-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-8"
                onClick={handleOpenAllInNewTab}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Abrir todos em novas abas
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedComprovante && (
        <ComprovanteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedComprovante(null);
          }}
          comprovanteUrl={selectedComprovante.url}
          comprovanteName={selectedComprovante.name}
        />
      )}
    </>
  );
}
