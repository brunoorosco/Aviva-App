import { withAudit } from '@/middlewares/withAudit';
// pages/api/protected/churches/[churchid]/batismo/lista-pdf.ts

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

interface Batizando {
  nome: string;
  rede?: string;
  sexo?: string;
}

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function sortAlpha(list: Batizando[]) {
  return [...list].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

function logoToBase64(): string {
  const logoPath = path.join(process.cwd(), "public", "logo-preto.png");
  if (!fs.existsSync(logoPath)) return "";
  const buffer = fs.readFileSync(logoPath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// ─── Lança browser compatível com Vercel e local ──────────────────────────────
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
// ─── HTML ─────────────────────────────────────────────────────────────────────
function buildTableRows(lista: Batizando[]): string {
  if (lista.length === 0) {
    return `<tr><td colspan="4" class="empty">Nenhum batizando nesta categoria.</td></tr>`;
  }
  return lista
    .map(
      (p, i) => `
      <tr class="${i % 2 === 0 ? "even" : "odd"}">
        <td class="center">${i + 1}</td>
        <td>${capitalizeWords(p.nome)}</td>
        <td>${p.rede || "-"}</td>
        <td class="center">${p.sexo === "M" ? "Masc." : p.sexo === "F" ? "Fem." : "-"}</td>
      </tr>`
    )
    .join("");
}

function buildHTML(
  dataFormatada: string,
  todos: Batizando[],
  homens: Batizando[],
  mulheres: Batizando[],
  logoBase64: string
): string {
  const geradoEm = new Date().toLocaleDateString("pt-BR");
  const logoTag = logoBase64
    ? `<img src="${logoBase64}" alt="Logo" />`
    : `<div class="logo-placeholder"></div>`;

  const header = (badge: string) => `
    <div class="page-header">
      ${logoTag}
      <div class="header-text">
        <h1>Lista de Batismo</h1>
        <p>Batismo de ${dataFormatada}</p>
      </div>
      <div class="header-badge">${badge}</div>
    </div>`;

  const table = (lista: Batizando[], titleClass: string, titulo: string) => `
    <div class="section">
      <div class="section-title ${titleClass}">${titulo}</div>
      <table>
        <thead>
          <tr>
            <th class="center" style="width:36px">#</th>
            <th style="width:52%">Nome</th>
            <th style="width:32%">Rede</th>
            <th class="center" style="width:10%">Sexo</th>
          </tr>
        </thead>
        <tbody>${buildTableRows(lista)}</tbody>
        <tfoot><tr><td colspan="4">Total: ${lista.length}</td></tr></tfoot>
      </table>
    </div>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111827; background: #fff; }

    .page-header {
      background: #1e3a5f;
      padding: 16px 40px;
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
    }
    .page-header img {
      height: 60px; width: 60px;
      object-fit: contain;
      border-radius: 8px;
      background: #fff;
      padding: 4px;
    }
    .logo-placeholder {
      height: 60px; width: 60px;
      border-radius: 8px;
      background: rgba(255,255,255,0.15);
    }
    .header-text { flex: 1; }
    .header-text h1 { color: #fff; font-size: 20px; font-weight: 700; }
    .header-text p  { color: #93c5fd; font-size: 12px; margin-top: 4px; }
    .header-badge {
      background: rgba(255,255,255,0.15);
      color: #fff; border-radius: 20px;
      padding: 6px 14px; font-size: 11px;
      font-weight: 600; white-space: nowrap;
    }

    .section { padding: 0 40px; margin-bottom: 32px; }
    .section-title {
      font-size: 13px; font-weight: 700;
      padding-bottom: 6px;
      border-bottom: 2px solid currentColor;
      margin-bottom: 0;
    }
    .section-title.all   { color: #1e3a5f; }
    .section-title.men   { color: #1d4ed8; }
    .section-title.women { color: #be185d; }

    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #e8f0fe; }
    thead th {
      padding: 6px 8px; text-align: left;
      font-size: 9px; font-weight: 700;
      color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.5px;
    }
    thead th.center { text-align: center; }
    tbody tr.even { background: #f8fafc; }
    tbody tr.odd  { background: #ffffff; }
    tbody tr td { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
    tbody tr td.center { text-align: center; }
    td.empty { text-align: center; color: #6b7280; font-style: italic; padding: 16px; }
    tfoot tr { background: #e8f0fe; }
    tfoot td { padding: 5px 8px; font-size: 9px; font-weight: 700; color: #1e3a5f; text-align: right; }

    .page-break { break-before: page; }
  </style>
</head>
<body>

  <!-- PÁGINA 1: TODOS -->
  ${header(`${todos.length} batizandos`)}
  ${table(todos, "all", "Todos os Batizandos")}

  <!-- PÁGINA 2: HOMENS -->
  <div class="page-break">
    ${header(`${homens.length} homens`)}
    ${table(homens, "men", "Homens")}
  </div>

  <!-- PÁGINA 3: MULHERES -->
  <div class="page-break">
    ${header(`${mulheres.length} mulheres`)}
    ${table(mulheres, "women", "Mulheres")}
  </div>

</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Descomente para proteger:
  // const session = await getServerSession(req, res, authOptions);
  // if (!session?.user?.permission?.includes("admin")) {
  //   return res.status(403).json({ error: "Acesso negado" });
  // }

  let browser;
  try {
    const { batizandos, data: dataStr } = req.body as {
      batizandos: Batizando[];
      data: string;
    };

    if (!batizandos?.length || !dataStr) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const parsedDate = new Date(dataStr);
    const dataFormatada = isNaN(parsedDate.getTime())
      ? dataStr
      : parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    const todos = sortAlpha(batizandos);
    const homens = sortAlpha(batizandos.filter((b) => b.sexo === "M"));
    const mulheres = sortAlpha(batizandos.filter((b) => b.sexo === "F"));
    const logo = logoToBase64();
    const html = buildHTML(dataFormatada, todos, homens, mulheres, logo);

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "36px", left: "0" },
      displayHeaderFooter: true,
      headerTemplate: `<span></span>`,
      footerTemplate: `
        <div style="width:100%;font-size:8px;color:#9ca3af;font-family:Arial,sans-serif;
                    display:flex;justify-content:space-between;padding:0 40px;">
          <span>Gerado em ${new Date().toLocaleDateString("pt-BR")}</span>
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>`,
    });

    // page.pdf() retorna Uint8Array na versão mais nova do Puppeteer — converte para Buffer
    const pdfBuffer = Buffer.from(pdfUint8);

    const fileName = `lista-batismo-${dataFormatada.replace(/\//g, "-")}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache, no-store");
    res.status(200).end(pdfBuffer);

  } catch (err) {
    console.error("=== ERRO LISTA PDF ===", err);
    res.status(500).json({
      error: "Erro interno ao gerar PDF",
      detail: err instanceof Error ? err.message : String(err),
    });
  } finally {
    // Garante que o browser sempre fecha, mesmo em caso de erro
    if (browser) await browser.close();
  }
}

// Aumenta o timeout da rota (Puppeteer pode demorar um pouco)
export const config = {
  api: { responseLimit: false },
  maxDuration: 30, // segundos — plano Pro da Vercel suporta até 300s
};
export default withAudit(handler);