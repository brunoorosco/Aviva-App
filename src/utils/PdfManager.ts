import { PDFDocument } from 'pdf-lib'
import { promises as fs } from 'fs'

export async function createPDF(buffer: Uint8Array): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.load(buffer)
  return pdfDoc
}

// Função para salvar o PDF em um arquivo
export async function savePDF(
  pdfDoc: PDFDocument,
  outputPath: string
): Promise<void> {
  const pdfBytes = await pdfDoc.save()
  await fs.writeFile(outputPath, pdfBytes)
}
