import { NextApiRequest, NextApiResponse } from 'next'
import { generatePdfs } from 'html-pdf-node-ts'
import { htmlPdf } from '@/utils/html/template'
import { batismo } from '@/infra/google/accessGoogle'
import { orderByName } from '@/utils/orderBy'
import { createPDF, savePDF } from '@/utils/PdfManager'

type Data = {
  name: string
  date: string
  cem: string
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
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
    const orderUsers = orderByName(users)

    orderUsers.forEach(async (e: Data) => {
      file.push({ content: htmlPdf(e.name, e.date) })
    })

    const options: any = {
      type: 'pdf',
      format: 'a5',
      landscape: true,
      path: 'Cert-teste.pdf',
      printBackground: true
    }

    const pdfFile = await generatePdfs(file, options)
    const pdfs = concatBuffers(pdfFile)
    const pdfDoc = await createPDF(pdfs)
    await savePDF(pdfDoc, 'cert.pdf')

    const pdfDownload = await Buffer.from(pdfs)

    res.setHeader('Control-cache', 'no-cache')
    res.setHeader(
      'Content-disposition',
      `inline; filename="Certificado-batismo.pdf"`
    )
    res.setHeader('Content-type', 'application/pdf')
    res.send(pdfDownload)
  } catch (error) {
    res.status(500).send({ error })
  }
}
interface BufferObject {
  buffer: Uint8Array
}

function concatBuffers(bufferObjects: BufferObject[]): Uint8Array {
  const totalLength = bufferObjects.reduce(
    (acc, obj) => acc + obj.buffer.length,
    0
  )
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const obj of bufferObjects) {
    result.set(obj.buffer, offset)
    offset += obj.buffer.length
  }
  return result
}
