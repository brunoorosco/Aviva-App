import { NextApiRequest, NextApiResponse } from 'next'
import { Buffer } from 'buffer'
import { generatePdf } from 'html-pdf-node-ts'
import { htmlPdf } from '@/utils/html/template'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const nomeBatizando = (req.query?.nome as string) || ''
    const dataBatismo = (req.query?.data as string) || ''

    const options: any = {
      type: 'pdf',
      format: 'a5',
      landscape: true,
      printBackground: true
    }

    const file = {
      content: htmlPdf(nomeBatizando, dataBatismo)
    }

    const pdfFile = await generatePdf(file, options)

    const pdfBuffer = Buffer.from(pdfFile.buffer)

    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader(
      'Content-Disposition',
      `inline; filename="Certificado-${nomeBatizando}.pdf"`
    )
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Length', pdfBuffer.length.toString())

    res.end(pdfBuffer) // <-- mais seguro que res.send para binário
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch data' })
  }
}
