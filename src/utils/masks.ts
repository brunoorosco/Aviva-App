const _ALPHABET: string[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z'
]

const ALPHABET_CODE_FORMAT: string[] = [..._ALPHABET, '_']

function onlyNumbers(text: string): string {
  return text.replace(/[^\d]/g, '')
}

export function clearName(text: string): string {
  return text
    .replace(/^( )/g, '')
    .replace(/[\[\].!'@,><|://\\;"\-/&*\()/_+~^´#%¨$`?{ºª°}=0-9]/g, '')
    .replace(/[áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/g, '')
}

export function inputName(text: string): string {
  return text
    .replace(/^( )/g, '')
    .replace(/[\[\].!'@,><|://\\;"\-/&*\()/_+~^´#%¨$`?{ºª°}=0-9]/g, '')
    .replace(/[àèïöñÀÈÏÖÑ]/g, '')
}

function cep(text: string): string {
  const digits = onlyNumbers(text || '').substring(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.substring(0, 5)}-${digits.substring(5)}`
}

function cpf(text: string): string {
  const digits = onlyNumbers(text || '').substring(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6)
    return `${digits.substring(0, 3)}.${digits.substring(3)}`
  if (digits.length <= 9)
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`
  return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9)}`
}

function cnpj(text: string): string {
  const digits = onlyNumbers(text || '').substring(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5)
    return `${digits.substring(0, 2)}.${digits.substring(2)}`
  if (digits.length <= 8)
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5)}`
  if (digits.length <= 12)
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8)}`
  return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12)}`
}

function phone(text: string): string {
  const digits = onlyNumbers(text || '').substring(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6)
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`
  if (digits.length <= 10)
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`
  return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`
}

export function inputPrice(value: string): string {
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d)(\d{2})$/, '$1,$2')
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')
  return value
}

function rg(text: string): string {
  const digits = onlyNumbers(text || '').substring(0, 9)
  if (digits.length <= 2) return digits
  if (digits.length <= 5)
    return `${digits.substring(0, 2)}.${digits.substring(2)}`
  if (digits.length <= 8)
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5)}`
  return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}-${digits.substring(8)}`
}

export const Masks = {
  onlyNumbers,
  cep,
  cpf,
  cnpj,
  phone,
  clearName,
  inputPrice,
  rg,
  inputName
}
