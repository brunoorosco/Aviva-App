import { capitalizeWords } from '@/utils/capitalizaFirst'
import axios from 'axios'

const formatDate = (dateValue: any) => {
  if (!dateValue) return ''

  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
  if (!(date instanceof Date) || isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

export async function gerarCertificados(
  churchId: string,
  batismo: any
): Promise<void> {
  // dispara uma promise para cada batizando
  const promises = batismo.batizandos.map(async (pessoa: any) => {
    const response = await axios.get(
      `/api/protected/churches/${churchId}/baptism/certificado-pdf`,
      {
        params: {
          nome: capitalizeWords(pessoa.nome),
          data: formatDate(batismo.data)
        },
        headers: { Accept: 'application/pdf' },
        responseType: 'arraybuffer'
      }
    )

    // força o download de cada PDF
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${capitalizeWords(pessoa.nome)}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  })

  // espera todas terminarem
  await Promise.all(promises)
}
