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
  try {
    const dataFormatada = formatDate(batismo.data);
    const response = await axios.post(
      `/api/protected/churches/${churchId}/baptism/certificados-lista-pdf`,
      {
        batizandos: batismo.batizandos.map((p: any) => ({ nome: capitalizeWords(p.nome) })),
        data: dataFormatada
      },
      {
        responseType: 'blob'
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `certificados-batismo-${dataFormatada.replace(/\//g, '-')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar certificados:', error);
    alert('Erro ao gerar certificados. Por favor, tente novamente.');
  }
}
