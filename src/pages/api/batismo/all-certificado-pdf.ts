import { NextApiRequest, NextApiResponse } from 'next'
import { Buffer } from 'buffer'
import { generatePdfs } from 'html-pdf-node-ts'
import { htmlPdf } from '@/utils/html/template'
import pdftk from 'node-pdftk'

type Data = {
  name: string
  date: string
  cem: string
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const batizando = req.body
    let file = new Array()

    batizando.forEach(async (e: Data) => {
      file.push({ content: htmlPdf(batizando.Nomes, batizando.data) })
    })

    const options: any = [
      {
        type: 'pdf',
        format: 'a5',
        landscape: true,
        path: 'Cert-' + 'teste' + '.pdf',
        printBackground: true
      }
    ]
    const pdfFile = await generatePdfs(file, options).then((output: any) => {
      return output
    })

    const pdfBuffer = Buffer.from(pdfFile[0].buffer)

    res.setHeader('Control-cache', 'no-cache')
    res.setHeader(
      'Content-disposition',
      `inline; filename="Certificado-batismo.pdf"`
    )
    res.setHeader('Content-type', 'application/pdf')
    res.send(pdfBuffer)
  } catch (error) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
