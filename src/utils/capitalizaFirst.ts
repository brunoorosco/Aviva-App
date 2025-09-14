export function capitalizeWords(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase() // garante tudo minúsculo antes
    .split(" ") // quebra em palavras
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // primeira letra maiúscula + resto
    .join(" "); // junta de volta
}