export const parseDateNoTimezone = (dateStr: string | undefined) => {
  if (!dateStr) {
    return new Date()
  }
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day) // Mês em JS é 0-indexado
}

export function excelDateToJSDate(serial: number): Date {
  // Excel considera 1900 como ano base (com erro do ano bissexto de 1900)
  const excelEpoch = new Date(1900, 0, 1)
  const date = new Date(excelEpoch.getTime() + (serial - 2) * 86400000)
  return date
}
