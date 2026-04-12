import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import { htmlPdf } from '@/utils/html/template'

function templateToBase64(): string {
  const filePath = path.join(process.cwd(), 'public', 'template.png')
  if (!fs.existsSync(filePath)) return ''
  const buffer = fs.readFileSync(filePath)
  return `data:image/png;base64,${buffer.toString('base64')}`
}

async function launchBrowser() {
  const isVercel = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME

  if (isVercel) {
    const chromium = (await import('@sparticuz/chromium')).default
    const puppeteer = (await import('puppeteer-core')).default
    const executablePath = await chromium.executablePath()

    return puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true
    })
  }

  const puppeteer = (await import('puppeteer')).default
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let browser
  try {
    const nomeBatizando = (req.query?.nome as string) || ''
    const dataBatismo = (req.query?.data as string) || ''

    if (!nomeBatizando || !dataBatismo) {
      return res.status(400).json({ error: 'Dados insuficientes' })
    }

    const backgroundImage = templateToBase64()
    const html = htmlPdf(nomeBatizando, dataBatismo, backgroundImage)

    browser = await launchBrowser()
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfUint8 = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    })

    const pdfBuffer = Buffer.from(pdfUint8)

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
  } finally {
    if (browser) await browser.close()
  }
}

