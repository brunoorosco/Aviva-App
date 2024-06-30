export function paginationArray<T>(
  array: T[],
  page = '1',
  itemsPage = 10
): T[] {
  const indiceInicial = (Number(page) - 1) * itemsPage
  const indiceFinal = indiceInicial + itemsPage

  return array.slice(indiceInicial, indiceFinal)
}
