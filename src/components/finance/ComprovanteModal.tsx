import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import { getPDFViewUrl } from "@/lib/cloudinary-client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  comprovanteUrl: string;
  comprovanteName?: string;
}

export function ComprovanteModal({ isOpen, onClose, comprovanteUrl, comprovanteName }: Props) {
  const [pdfError, setPdfError] = useState(false);
  
  // Detecta se é PDF
  const isPDF = comprovanteUrl?.toLowerCase().includes('.pdf') || 
                comprovanteName?.toLowerCase().endsWith('.pdf');
  
  // Para PDFs, usa Google Docs Viewer ou visualizador nativo
  const pdfViewUrl = isPDF 
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(comprovanteUrl)}&embedded=true`
    : comprovanteUrl;
  
  const handleDownload = async () => {
    try {
      const response = await fetch(comprovanteUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = comprovanteName || 'comprovante';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback para download direto
      window.open(comprovanteUrl, '_blank');
    }
  };

  const handleOpenNewTab = () => {
    window.open(comprovanteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate pr-4 flex items-center gap-2">
              {isPDF && <FileText className="h-5 w-5" />}
              {comprovanteName || 'Comprovante de Pagamento'}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleOpenNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="w-full h-[70vh] overflow-auto bg-secondary/20 rounded-lg">
          {isPDF ? (
            pdfError ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="text-lg font-medium">Documento PDF</p>
                <p className="text-muted-foreground text-sm max-w-md">
                  Não foi possível carregar o PDF diretamente. Use os botões abaixo para visualizar ou baixar o arquivo.
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleOpenNewTab}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir em nova aba
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar arquivo
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                src={pdfViewUrl}
                className="w-full h-full border-0 rounded-lg"
                title={comprovanteName || 'Comprovante PDF'}
                onError={() => setPdfError(true)}
                sandbox="allow-scripts allow-same-origin"
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <img
                src={comprovanteUrl}
                alt={comprovanteName || 'Comprovante'}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center">
                        <p class="text-muted-foreground">Erro ao carregar imagem</p>
                        <button onclick="window.open('${comprovanteUrl}', '_blank')" class="mt-4 px-4 py-2 bg-primary text-white rounded">
                          Abrir em nova aba
                        </button>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}