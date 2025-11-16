import { ministerialLevels, TMinisterialLevel } from "@/domain/models/ministerial";

export function getNextMinisterialLevel(currentLevel: TMinisterialLevel): TMinisterialLevel {
  const currentIndex = ministerialLevels.indexOf(currentLevel);
  if (currentIndex === -1) {
    // Se o cargo atual não for encontrado, assume-se o início da progressão
    return ministerialLevels[0];
  }
  if (currentIndex < ministerialLevels.length - 1) {
    return ministerialLevels[currentIndex + 1];
  }
  // Se já for o último cargo, retorna o próprio cargo ou um tratamento específico
  return currentLevel; // Ou talvez 'BISPO' se você não quiser que progridam mais
}

export function getMinisterialLevelsForSelection(
  currentLevel: TMinisterialLevel
): TMinisterialLevel[] {
  const currentIndex = ministerialLevels.indexOf(currentLevel);
  if (currentIndex === -1) {
    return ministerialLevels; // Se não for encontrado, permite selecionar qualquer um
  }
  return ministerialLevels.slice(currentIndex); // Permite selecionar do cargo atual em diante
}
