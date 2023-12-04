import { NextApiRequest, NextApiResponse } from 'next'
import { Buffer } from 'buffer'
import { generatePdfs } from 'html-pdf-node-ts'
import { htmlPdf } from '@/utils/html/template'
import { batismo } from '../../../../docGoogle'

type Data = {
  name: string
  date: string
  cem: string
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const batizando = req.body
    let file = new Array()
    const sheet = await batismo()
    const rows = await sheet.getRows()
    const users = await rows.map((row) => {
      return {
        name: row.get('Nomes'),
        date: row.get('data'),
        cem: row.get('CEM')
      }
    })

    users.forEach(async (e: Data) => {
      file.push({ content: htmlPdf(e.name, e.date) })
    })
    let pdfBuffers: any = []

    for (const entry of file) {
      const options: any = [
        {
          type: 'pdf',
          format: 'a5',
          landscape: true,
          path: 'Cert-' + 'teste' + '.pdf',
          printBackground: true
        }
      ]

      // Gerar o PDF para a entrada atual
      const pdfFile = await generatePdfs(entry.content, options)

      // Converter o PDF em um buffer
      const pdfBuffer = Buffer.from(pdfFile[0].buffer)

      pdfBuffers.push(pdfBuffer)
    }
    // const options: any = [
    //   {
    //     type: 'pdf',
    //     format: 'a5',
    //     landscape: true,
    //     path: 'Cert-' + 'teste' + '.pdf',
    //     printBackground: true
    //   }
    // ]
    // const pdfFile = await generatePdfs(file, options).then((output: any) => {
    //   return output
    // })

    // const pdfBuffer = Buffer.from(pdfFile[0].buffer)

    // const pdfFile = await generatePdfs(entry.content, options)
    // pdfBuffer = Buffer.from(pdfFile[0].buffer)
    // Agora você pode usar o pdfBuffer como desejar

    res.setHeader('Control-cache', 'no-cache')
    res.setHeader(
      'Content-disposition',
      `inline; filename="Certificado-batismo.pdf"`
    )
    res.setHeader('Content-type', 'application/pdf')
    res.send(pdfBuffers)
  } catch (error) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
