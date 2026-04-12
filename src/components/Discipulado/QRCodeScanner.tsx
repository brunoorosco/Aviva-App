import React, { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toast from "@/components/Toast";

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess, onScanError, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader-region";

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    };

    scannerRef.current = new Html5Qrcode(regionId);

    const startScanner = async () => {
      try {
        await scannerRef.current?.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            //onScanError?.(errorMessage);
          }
        );
      } catch (err) {
        console.error("Erro ao iniciar scanner QR:", err);
        Toast.showError("Erro ao acessar a câmera");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
        }).catch(err => console.error("Erro ao parar scanner:", err));
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden shadow-2xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            Escaneando QR Code
          </h2>
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full h-8 w-8 shadow-md"
            title="Fechar Scanner"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div
            id={regionId}
            className="overflow-hidden rounded-xl border-2 border-dashed border-primary/30"
          ></div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Aponte a câmera para o QR Code.
          </p>
        </div>

        <div className="p-4 bg-muted/30 border-t border-border flex justify-center gap-3">
          <Button variant="outline" onClick={onClose} className="w-full max-w-[200px] border-destructive/30 text-destructive hover:bg-destructive/10">
            <X className="h-4 w-4 mr-2" />
            Fechar Scanner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
