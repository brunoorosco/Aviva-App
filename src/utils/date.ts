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

/**
 * Retorna true se a data "YYYY-MM-DD" for um domingo.
 * Usa T12:00:00 para evitar problemas de fuso (mesmo padrão de agenda/ano.tsx).
 */
export function isSunday(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.getDay() === 0;
  } catch {
    return false;
  }
}