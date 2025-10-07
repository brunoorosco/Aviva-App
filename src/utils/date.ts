export const parseDateNoTimezone = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day) // Mês em JS é 0-indexado
}