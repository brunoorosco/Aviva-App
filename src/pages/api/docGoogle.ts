import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL as string,
  key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const accessGoogle = async () => {
  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_ID as string,
    serviceAccountAuth
  )

  await doc.loadInfo()
  return doc
}

export const batismo = async () => {
  const ss = await accessGoogle()
  return ss.sheetsById[580022665]
}

export const escolaProfeta = async () => {
  const ss = await accessGoogle()
  return ss.sheetsById[1287373443]
}

export const chamadaEscolaProfeta = async () => {
  const ss = await accessGoogle()
  return ss.sheetsById[911182317]
}
