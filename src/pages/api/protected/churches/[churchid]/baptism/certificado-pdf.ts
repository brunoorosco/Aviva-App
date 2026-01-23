import { NextApiRequest, NextApiResponse } from 'next'
import { generatePdf } from 'html-pdf-node'
import { htmlPdf } from '@/utils/html/template'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const nomeBatizando = (req.query?.nome as string) || ''
    const dataBatismo = (req.query?.data as string) || ''

    const options = {
      format: 'A5',
      landscape: true,
      printBackground: true
    }

    const file = { content: htmlPdf(nomeBatizando, dataBatismo) }

    const pdfBuffer = (await generatePdf(file, options)) as Buffer

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Certificado-${nomeBatizando}.pdf"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache'
    })

    res.end(pdfBuffer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'failed to generate PDF' })
  }
}
