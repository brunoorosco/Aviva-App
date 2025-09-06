export const formatAddress = (data: any) => {
  if (!data) return ''

  const parts = [
    data.street && data.number
      ? `${data.street}, ${data.number}`
      : data.street || data.number,
    data.city && data.state
      ? `${data.city}, ${data.state}`
      : data.city || data.state,
    data.cep
  ]

  return parts
    .filter(Boolean)
    .map((part) =>
      part
        .split(' ')
        .map((word: string) =>
          word.length > 3 ? word[0].toUpperCase() + word.slice(1) : word
        )
        .join(' ')
    )
    .join(' - ')
}
