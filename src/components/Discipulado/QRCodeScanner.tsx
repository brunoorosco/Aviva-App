import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, RefreshCw, Camera, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toast from "@/components/Toast";

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
  onClose: () => void;
  // Feedback em tempo real
  totalAlunos?: number;
  totalPresentes?: number;
  tema?: string;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  onClose,
  totalAlunos = 0,
  totalPresentes = 0,
  tema,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader-region";
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCooldown, setIsCooldown] = useState(false);

  const progresso = totalAlunos > 0 ? Math.round((totalPresentes / totalAlunos) * 100) : 0;

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          const rearCameras = devices.filter(d =>
            !d.label.toLowerCase().includes("front") &&
            !d.label.toLowerCase().includes("frontal") &&
            !d.label.toLowerCase().includes("user") &&
            !d.label.toLowerCase().includes("selfie")
          );
          const filteredDevices = rearCameras.length > 0 ? rearCameras : devices;
          setCameras(filteredDevices.map(d => ({ id: d.id, label: d.label })));
        }
      } catch (err) {
        console.error("Erro ao buscar câmeras:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchCameras();
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
  };

  const startScanner = async (cameraId?: string) => {
    try {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(regionId);
      }

      const cameraParam = cameraId ? { deviceId: cameraId } : { facingMode: "environment" };

      await scannerRef.current.start(
        cameraParam,
        config,
        (decodedText) => {
          if (isCooldown) return;
          
          setIsCooldown(true);
          onScanSuccess(decodedText);
          
          // Intervalo de 4 segundos antes da próxima leitura
          setTimeout(() => {
            setIsCooldown(false);
          }, 4000);
        },
        () => {
          // Silent errors during scan
        }
      );
    } catch (err) {
      console.error("Erro ao iniciar scanner QR:", err);
      Toast.showError("Erro ao acessar a câmera");
    }
  };

  useEffect(() => {
    if (isInitializing) return;

    if (cameras.length > 0) {
      startScanner(cameras[currentCameraIndex].id);
    } else {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isInitializing, currentCameraIndex, cameras.length]);

  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) {
      Toast.showInfo("Apenas uma câmera detectada");
      return;
    }
    await stopScanner();
    setCurrentCameraIndex((prev) => (prev + 1) % cameras.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden shadow-2xl border border-border">

        {/* Header */}
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

        {/* Painel de progresso em tempo real */}
        {totalAlunos > 0 && (
          <div className="px-5 pt-4 pb-3 bg-primary/5 border-b border-primary/10 space-y-2">
            {tema && (
              <p className="text-xs text-muted-foreground truncate font-medium">{tema}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">{totalPresentes} presentes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {totalAlunos - totalPresentes} pendentes · {totalAlunos} total
                </span>
              </div>
            </div>
            {/* Barra de progresso */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-right text-[11px] text-muted-foreground">{progresso}% confirmados</p>
          </div>
        )}

        {/* Área da câmera */}
        <div className="p-6">
          <div className="relative">
            <div
              id={regionId}
              className="overflow-hidden rounded-xl border-2 border-dashed border-primary/30"
            />
            
            {/* Overlay de Cooldown (Feedback Visual) */}
            {isCooldown && (
              <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-white p-6 animate-in fade-in zoom-in duration-300 z-10">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-black text-center">Leitura OK!</h3>
                <p className="text-sm text-center opacity-80 mt-1 font-medium">Aguarde a próxima leitura...</p>
                
                {/* Loader discreto */}
                <div className="mt-6 flex gap-1">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Aponte a câmera para o QR Code do aluno.
          </p>
          {cameras.length > 1 && (
            <p className="text-center text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              Câmera {currentCameraIndex + 1} de {cameras.length}: {cameras[currentCameraIndex].label}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t border-border flex flex-col gap-3">
          {cameras.length > 1 && (
            <Button
              variant="secondary"
              onClick={handleSwitchCamera}
              className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
            >
              <Camera className="h-4 w-4 mr-2" />
              Trocar Câmera
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-2" />
            Fechar Scanner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;