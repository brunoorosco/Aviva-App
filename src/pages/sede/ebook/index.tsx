import { useEffect } from "react";

export default function EbookDownload() {
  useEffect(() => {
    // Força o download do PDF
    const link = document.createElement("a");
    link.href = "/ebook_conferencia.pdf"; // Arquivo dentro de /public
    link.download = "ebook_conferencia.pdf";
    link.click();

    // Aguarda o download iniciar
    setTimeout(() => {
      // Habilita permitir fechamento mesmo sem ter sido aberta por clique
      window.open('', '_self');
      window.close();
    }, 1500);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 18,
      }}
    >
      Preparando download do e-book...
    </div>
  );
}
