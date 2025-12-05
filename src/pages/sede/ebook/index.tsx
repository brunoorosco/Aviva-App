import { useEffect } from "react";
import Router from "next/router";

export default function EbookDownloadPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/ebook_conferencia.pdf"; // PDF na pasta public
      link.download = "ebook.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Fecha a página após 2s
      setTimeout(() => {
        window.close();
      }, 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      Seu download está sendo iniciado...
    </div>
  );
}
