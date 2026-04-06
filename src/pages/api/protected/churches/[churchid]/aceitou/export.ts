// pages/api/protected/churches/[churchid]/aceitou/export.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { exportAceitouService } from "@/services/aceitou";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateBR(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function logoToBase64(): string {
  const logoPath = path.join(process.cwd(), "public", "logo-preto.png");
  if (!fs.existsSync(logoPath)) return "";
  const buffer = fs.readFileSync(logoPath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// ─── Browser helper (same pattern as batismo/list-pdf.ts) ─────────────────────
async function launchBrowser() {
  const isVercel =
    process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

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

// ─── Excel generation ─────────────────────────────────────────────────────────
function buildExcel(records: any[]): Buffer {
  const rows = records.map((r, i) => ({
    "#": i + 1,
    Nome: r.name || "-",
    Email: r.email || "-",
    WhatsApp: r.phone || "-",
    "Rede / CEM": r.rede?.name || "-",
    "Data do Apelo": formatDateBR(r.acceptedAt),
    Tipo: r.accepted ? "Aceitou Jesus" : "Reconciliou",
    Batizado: r.baptism ? "Sim" : "Não",
    "Tem Encontro": r.hasEncontro ? "Sim" : "Não",
    "Nº Encontro": r.numberEncontro || "-",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Auto column widths
  const colWidths = [
    { wch: 4 }, { wch: 30 }, { wch: 28 }, { wch: 16 },
    { wch: 20 }, { wch: 14 }, { wch: 16 }, { wch: 10 },
    { wch: 14 }, { wch: 12 },
  ];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Aceitou Jesus");

  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

// ─── PDF HTML generation ──────────────────────────────────────────────────────
function buildPdfHtml(records: any[], logoBase64: string): string {
  const geradoEm = new Date().toLocaleDateString("pt-BR");
  const logoTag = logoBase64
    ? `<img src="${logoBase64}" alt="Logo" />`
    : `<div class="logo-placeholder"></div>`;

  const rows =
    records.length === 0
      ? `<tr><td colspan="7" class="empty">Nenhum registro encontrado.</td></tr>`
      : records.map((r, i) => `
        <tr class="${i % 2 === 0 ? "even" : "odd"}">
          <td class="center">${i + 1}</td>
          <td>${r.name || "-"}</td>
          <td>${r.rede?.name || "-"}</td>
          <td class="center">${formatDateBR(r.acceptedAt)}</td>
          <td class="center">${r.accepted ? "Aceitou" : "Reconciliou"}</td>
          <td class="center">${r.baptism ? "Sim" : "Não"}</td>
          <td>${r.phone || "-"}</td>
        </tr>`).join("");

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
      object-fit: contain; border-radius: 8px;
      background: #fff; padding: 4px;
    }
    .logo-placeholder {
      height: 60px; width: 60px;
      border-radius: 8px; background: rgba(255,255,255,0.15);
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

    .section { padding: 0 40px; }
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
  </style>
</head>
<body>
  <div class="page-header">
    ${logoTag}
    <div class="header-text">
      <h1>Aceitou Jesus</h1>
      <p>Gerado em ${geradoEm}</p>
    </div>
    <div class="header-badge">${records.length} registro${records.length !== 1 ? "s" : ""}</div>
  </div>

  <div class="section">
    <table>
      <thead>
        <tr>
          <th class="center" style="width:32px">#</th>
          <th style="width:26%">Nome</th>
          <th style="width:18%">Rede / CEM</th>
          <th class="center" style="width:10%">Data</th>
          <th class="center" style="width:12%">Tipo</th>
          <th class="center" style="width:8%">Batizado</th>
          <th style="width:14%">WhatsApp</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="7">Total: ${records.length}</td></tr>
      </tfoot>
    </table>
  </div>
</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { churchid, format, name, rede, dateStart, dateEnd } = req.query;

  if (!churchid || !format) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  if (format !== "pdf" && format !== "excel") {
    return res.status(400).json({ error: "Formato inválido. Use 'pdf' ou 'excel'" });
  }

  // Build filters (remove empty strings)
  const filters: Record<string, string> = {};
  if (name)      filters.name      = name as string;
  if (rede)      filters.rede      = rede as string;
  if (dateStart) filters.dateStart = dateStart as string;
  if (dateEnd)   filters.dateEnd   = dateEnd as string;

  let browser: any;
  try {
    const records = await exportAceitouService(
      churchid as string,
      Object.keys(filters).length > 0 ? filters : undefined
    );

    const today = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");

    // ── Excel ─────────────────────────────────────────────────────────────────
    if (format === "excel") {
      const buffer = buildExcel(records);
      const fileName = `aceitou-jesus-${today}.xlsx`;
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("Cache-Control", "no-cache, no-store");
      return res.status(200).end(buffer);
    }

    // ── PDF ───────────────────────────────────────────────────────────────────
    const logo = logoToBase64();
    const html = buildPdfHtml(records, logo);

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

    const pdfBuffer = Buffer.from(pdfUint8);
    const fileName = `aceitou-jesus-${today}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache, no-store");
    return res.status(200).end(pdfBuffer);

  } catch (err) {
    console.error("=== ERRO EXPORT ACEITOU ===", err);
    return res.status(500).json({
      error: "Erro interno ao gerar exportação",
      detail: err instanceof Error ? err.message : String(err),
    });
  } finally {
    if (browser) await browser.close();
  }
}

export const config = {
  api: { responseLimit: false },
  maxDuration: 60,
};
