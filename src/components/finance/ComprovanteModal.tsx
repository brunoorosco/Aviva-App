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
  
  const isLocal = comprovanteUrl?.startsWith('blob:');

  // Para PDFs do Cloudinary, converte para JPG (primeira página)
  // Para imagens ou blobs locais, usa URL original
  const displayUrl = isPDF && !isLocal && comprovanteUrl.includes('cloudinary.com')
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
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0 sm:p-6">
        <DialogHeader className="p-4 sm:p-0">
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="truncate pr-4 flex items-center gap-2 max-w-full">
              {isPDF && <FileText className="h-5 w-5 text-primary shrink-0" />}
              <span className="truncate">{comprovanteName || 'Comprovante de Pagamento'}</span>
            </span>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={handleOpenNewTab} className="flex-1 sm:flex-none">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isPDF ? 'Abrir PDF' : 'Ver original'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="w-full h-[60vh] sm:h-[70vh] overflow-auto bg-secondary/10 relative">
          {imageError ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <p className="text-lg font-medium">Não foi possível carregar a prévia</p>
              <p className="text-muted-foreground text-sm max-w-md">
                O arquivo pode ser muito grande ou o formato não é suportado para prévia direta.
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
            <div className="flex items-center justify-center h-full">
              {isPDF && isLocal ? (
                <iframe
                  src={displayUrl}
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={displayUrl}
                  alt={comprovanteName || 'Comprovante'}
                  className="max-w-full max-h-full object-contain shadow-sm"
                  onError={() => setImageError(true)}
                />
              )}
              
              {isPDF && !imageError && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md">
                  <FileText className="h-4 w-4" />
                  {isLocal ? 'Prévia do PDF' : 'Prévia - Primeira página do PDF'}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}