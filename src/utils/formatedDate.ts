export const formatDate = (
  value: string | Date | null | undefined,
  showTime: boolean = false
): string => {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";

  // Sempre formata no fuso de Brasília
  if (showTime) {
    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  }

  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
};