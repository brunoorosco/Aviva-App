import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_SA as string,
  key: process.env.GOOGLE_PRIVATE_KEY_SA?.split(String.raw`\n`).join('\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})
const accessGoogle = async () => {
  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_ID_SA as string,
    serviceAccountAuth
  )

  await doc.loadInfo()
  return doc
}

export const links = async () => {
  const ss = await accessGoogle()
  return ss.sheetsById[577300247]
}

export const batismo = async () => {
  const ss = await accessGoogle()
  return ss.sheetsById[0]
}

export const chamadaEscolaProfeta = async () => {
  const ss = await accessGoogle()
  return ss.sheetsById[942109327]
}

export const escolaProfeta = async () => {
  const ss = await accessGoogle()
  return ss.sheetsById[1287373443]
}
