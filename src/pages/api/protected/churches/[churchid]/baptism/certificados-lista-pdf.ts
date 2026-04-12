import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { htmlMultiCertificados } from "@/utils/html/template";

interface Batizando {
  nome: string;
}

function templateToBase64(): string {
  const filePath = path.join(process.cwd(), "public", "template.png");
  if (!fs.existsSync(filePath)) return "";
  const buffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function launchBrowser() {
  const isVercel = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (isVercel) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    const executablePath = await chromium.executablePath();

    return puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });
  }

  const puppeteer = (await import("puppeteer")).default;
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  let browser;
  try {
    const { batizandos, data: dataStr } = req.body as {
      batizandos: Batizando[];
      data: string;
    };

    if (!batizandos?.length || !dataStr) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // Ordenar alfabeticamente
    const ordados = [...batizandos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

    const backgroundImage = templateToBase64();
    const html = htmlMultiCertificados(ordados, dataStr, backgroundImage);

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfUint8 = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const pdfBuffer = Buffer.from(pdfUint8);
    const fileName = `certificados-batismo-${dataStr.replace(/\//g, "-")}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache, no-store");
    res.status(200).send(pdfBuffer);

  } catch (err) {
    console.error("=== ERRO PDF CERTIFICADOS ===", err);
    res.status(500).json({
      error: "Erro interno ao gerar PDF",
      detail: err instanceof Error ? err.message : String(err),
    });
  } finally {
    if (browser) await browser.close();
  }
}

export const config = {
  api: { responseLimit: false },
};
