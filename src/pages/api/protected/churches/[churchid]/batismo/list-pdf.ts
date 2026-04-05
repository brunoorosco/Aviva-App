// pages/api/protected/churches/[churchid]/batismo/lista-pdf.ts

import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
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
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      color: #111827;
      background: #fff;
    }

    /* ── Cabeçalho ─────────────────────────────────────── */
    .page-header {
      background: #1e3a5f;
      padding: 16px 40px;
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
    }

    .page-header img {
      height: 60px;
      width: 60px;
      object-fit: contain;
      border-radius: 8px;
      background: #fff;
      padding: 4px;
    }

    .page-header .logo-placeholder {
      height: 60px;
      width: 60px;
      border-radius: 8px;
      background: rgba(255,255,255,0.15);
    }

    .header-text { flex: 1; }

    .header-text h1 {
      color: #fff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .header-text p {
      color: #93c5fd;
      font-size: 12px;
      margin-top: 4px;
    }

    .header-badge {
      background: rgba(255,255,255,0.15);
      color: #fff;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }

    /* ── Seções ────────────────────────────────────────── */
    .section {
      padding: 0 40px;
      margin-bottom: 32px;
      break-inside: avoid;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      padding-bottom: 6px;
      border-bottom: 2px solid currentColor;
      margin-bottom: 0;
    }

    .section-title.all   { color: #1e3a5f; }
    .section-title.men   { color: #1d4ed8; }
    .section-title.women { color: #be185d; }

    /* ── Tabela ────────────────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0;
    }

    thead tr {
      background: #e8f0fe;
    }

    thead th {
      padding: 6px 8px;
      text-align: left;
      font-size: 9px;
      font-weight: 700;
      color: #1e3a5f;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    thead th.center { text-align: center; }

    tbody tr.even { background: #f8fafc; }
    tbody tr.odd  { background: #ffffff; }

    tbody tr td {
      padding: 5px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
    }

    tbody tr td.center { text-align: center; }

    td.empty {
      text-align: center;
      color: #6b7280;
      font-style: italic;
      padding: 16px;
    }

    tfoot tr {
      background: #e8f0fe;
    }

    tfoot td {
      padding: 5px 8px;
      font-size: 9px;
      font-weight: 700;
      color: #1e3a5f;
      text-align: right;
    }

    /* ── Quebra de página ──────────────────────────────── */
    .page-break {
      break-before: page;
    }

    /* ── Rodapé (via @page) ────────────────────────────── */
    @page {
      size: A4;
      margin: 0;

      @bottom-left {
        content: "Gerado em ${new Date().toLocaleDateString("pt-BR")}";
        font-size: 8px;
        color: #9ca3af;
        font-family: Arial, sans-serif;
        padding-bottom: 12px;
        padding-left: 40px;
      }

      @bottom-right {
        content: "Página " counter(page) " de " counter(pages);
        font-size: 8px;
        color: #9ca3af;
        font-family: Arial, sans-serif;
        padding-bottom: 12px;
        padding-right: 40px;
      }
    }

    /* Espaço para o rodapé no final de cada seção de página */
    .page-footer-space { height: 36px; }
  </style>
</head>
<body>

  <!-- ── PÁGINA 1: TODOS ─────────────────────────────────── -->
  <div class="page-header">
    ${logoBase64
      ? `<img src="${logoBase64}" alt="Logo" />`
      : `<div class="logo-placeholder"></div>`}
    <div class="header-text">
      <h1>Lista de Batismo</h1>
      <p>Batismo de ${dataFormatada}</p>
    </div>
    <div class="header-badge">${todos.length} batizandos</div>
  </div>

  <div class="section">
    <div class="section-title all">Todos os Batizandos</div>
    <table>
      <thead>
        <tr>
          <th class="center" style="width:36px">#</th>
          <th style="width:52%">Nome</th>
          <th style="width:32%">Rede</th>
          <th class="center" style="width:10%">Sexo</th>
        </tr>
      </thead>
      <tbody>${buildTableRows(todos)}</tbody>
      <tfoot>
        <tr><td colspan="4">Total: ${todos.length}</td></tr>
      </tfoot>
    </table>
  </div>

  <!-- ── PÁGINA 2: HOMENS ───────────────────────────────── -->
  <div class="page-break">
    <div class="page-header">
      ${logoBase64
      ? `<img src="${logoBase64}" alt="Logo" />`
      : `<div class="logo-placeholder"></div>`}
      <div class="header-text">
        <h1>Lista de Batismo</h1>
        <p>Batismo de ${dataFormatada}</p>
      </div>
      <div class="header-badge">${homens.length} homens</div>
    </div>

    <div class="section">
      <div class="section-title men">Homens</div>
      <table>
        <thead>
          <tr>
            <th class="center" style="width:36px">#</th>
            <th style="width:52%">Nome</th>
            <th style="width:32%">Rede</th>
            <th class="center" style="width:10%">Sexo</th>
          </tr>
        </thead>
        <tbody>${buildTableRows(homens)}</tbody>
        <tfoot>
          <tr><td colspan="4">Total: ${homens.length}</td></tr>
        </tfoot>
      </table>
    </div>
  </div>

  <!-- ── PÁGINA 3: MULHERES ────────────────────────────── -->
  <div class="page-break">
    <div class="page-header">
      ${logoBase64
      ? `<img src="${logoBase64}" alt="Logo" />`
      : `<div class="logo-placeholder"></div>`}
      <div class="header-text">
        <h1>Lista de Batismo</h1>
        <p>Batismo de ${dataFormatada}</p>
      </div>
      <div class="header-badge">${mulheres.length} mulheres</div>
    </div>

    <div class="section">
      <div class="section-title women">Mulheres</div>
      <table>
        <thead>
          <tr>
            <th class="center" style="width:36px">#</th>
            <th style="width:52%">Nome</th>
            <th style="width:32%">Rede</th>
            <th class="center" style="width:10%">Sexo</th>
          </tr>
        </thead>
        <tbody>${buildTableRows(mulheres)}</tbody>
        <tfoot>
          <tr><td colspan="4">Total: ${mulheres.length}</td></tr>
        </tfoot>
      </table>
    </div>
  </div>

</body>
</html>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { batizandos, data: dataStr } = req.body as {
      batizandos: Batizando[];
      data: string;
    };

    if (!batizandos || !dataStr) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // Parsing robusto — funciona com ISO, Date.toString(), timestamps, etc.
    const parsedDate = new Date(dataStr);
    const dataFormatada = isNaN(parsedDate.getTime())
      ? dataStr // fallback: usa a string como veio
      : parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        // sem timeZone: "UTC" pois a string já carrega o offset GMT-0300
      });

    const todos = sortAlpha(batizandos);
    const homens = sortAlpha(batizandos.filter((b) => b.sexo === "M"));
    const mulheres = sortAlpha(batizandos.filter((b) => b.sexo === "F"));
    const logo = logoToBase64();

    const html = buildHTML(dataFormatada, todos, homens, mulheres, logo);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "40px", left: "0" },
      displayHeaderFooter: true,
      headerTemplate: `<span></span>`,
      footerTemplate: `
    <div style="width:100%; font-size:8px; color:#9ca3af; font-family:Arial,sans-serif;
                display:flex; justify-content:space-between; padding:0 40px;">
      <span>Gerado em ${new Date().toLocaleDateString("pt-BR")}</span>
      <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
    </div>`,
    });

    await browser.close();

    // ── Debug: salva o PDF no disco para verificar se foi gerado corretamente ──
    // const debugPath = path.join(process.cwd(), "debug-lista-batismo.pdf");
    // fs.writeFileSync(debugPath, pdfBuffer);
    // console.log("PDF gerado, tamanho:", pdfBuffer.length, "bytes → salvo em", debugPath);

    if (pdfBuffer.length < 1000) {
      console.error("PDF muito pequeno, provável erro na geração");
      return res.status(500).json({ error: "PDF gerado está vazio ou corrompido" });
    }

    const fileName = `lista-batismo-${dataFormatada.replace(/\//g, "-")}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    // Garante que não há compressão interferindo
    res.setHeader("Cache-Control", "no-cache, no-store");
    res.status(200).end(pdfBuffer); // ← use .end() em vez de .send()

  } catch (err) {
    // Substitua o catch atual por este:
    console.error("=== ERRO LISTA PDF ===");
    console.error(err);
    console.error("=====================");
    res.status(500).json({
      error: "Erro interno ao gerar PDF",
      detail: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

  }
}