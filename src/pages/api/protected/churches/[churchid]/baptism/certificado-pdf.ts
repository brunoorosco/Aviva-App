import { NextApiRequest, NextApiResponse } from 'next'
import { Buffer } from 'buffer'
import { generatePdfs } from 'html-pdf-node-ts'
import { htmlPdf } from '@/utils/html/template'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const nomeBatizando = (req.query?.nome as string) || ''
    const dataBatismo = (req.query?.data as string) || ''

    const options: any = {
      type: 'pdf',
      format: 'a5',
      landscape: true,
      path: 'Cert-' + nomeBatizando + '.pdf',
      printBackground: true
    }

    const file = [
      {
        content: htmlPdf(nomeBatizando, dataBatismo)
      }
    ]

    const pdfFile = await generatePdfs(file, options).then((output: any) => {
      return output
    })

    const pdfBuffer = Buffer.from(pdfFile[0].buffer)

    res.setHeader('Control-cache', 'no-cache')
    res.setHeader(
      'Content-disposition',
      `inline; filename="Certificado-${nomeBatizando}.pdf"`
    )
    res.setHeader('Content-type', 'application/pdf')
    res.send(pdfBuffer)
  } catch (error) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
