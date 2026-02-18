import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  comprovanteUrl: string;
  comprovanteName?: string;
}

export function ComprovanteModal({ isOpen, onClose, comprovanteUrl, comprovanteName }: Props) {
  const [imageError, setImageError] = useState(false);
  
  // Detecta se é PDF
  const isPDF = comprovanteUrl?.toLowerCase().includes('.pdf') || 
                comprovanteName?.toLowerCase().endsWith('.pdf');
  
  // Para PDFs do Cloudinary, converte para JPG (primeira página)
  // Para imagens, usa URL original
  const displayUrl = isPDF && comprovanteUrl.includes('cloudinary.com')
    ? comprovanteUrl.replace('/upload/', '/upload/f_jpg,pg_1,q_auto,w_1200/')
    : comprovanteUrl;

  const handleDownload = async () => {
    try {
      const response = await fetch(comprovanteUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = comprovanteName || (isPDF ? 'comprovante.pdf' : 'comprovante.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro no download:', error);
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
              {isPDF && <FileText className="h-5 w-5 text-primary" />}
              {comprovanteName || 'Comprovante de Pagamento'}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleOpenNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="w-full h-[70vh] overflow-auto bg-secondary/20 rounded-lg relative">
          {imageError ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <p className="text-lg font-medium">Não foi possível carregar a prévia</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Use os botões acima para abrir o arquivo completo ou fazer download.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleOpenNewTab}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir arquivo
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <img
                src={displayUrl}
                alt={comprovanteName || 'Comprovante'}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={() => setImageError(true)}
              />
              {isPDF && !imageError && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Prévia - Primeira página do PDF
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}