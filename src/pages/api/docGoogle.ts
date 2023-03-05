import { GoogleSpreadsheet } from 'google-spreadsheet'

export const getDoc = async () => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_ID)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL as string,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join(
      '\n'
    ) as string
  })

  await doc.loadInfo()
  return doc
}
getDoc().then((doc) => {
  console.log('Nome da Planilha => ', doc.title)
})
