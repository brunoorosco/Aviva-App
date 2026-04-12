import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, RefreshCw, Camera } from "lucide-react";
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
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices.map(d => ({ id: d.id, label: d.label })));
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
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
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
          {cameras.length > 1 && (
            <p className="text-center text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              Câmera {currentCameraIndex + 1} de {cameras.length}: {cameras[currentCameraIndex].label}
            </p>
          )}
        </div>

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
          <Button variant="outline" onClick={onClose} className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
            <X className="h-4 w-4 mr-2" />
            Fechar Scanner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
