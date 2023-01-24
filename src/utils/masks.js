const _ALPHABET = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
]
const ALPHABET_CODE_FORMAT = [..._ALPHABET, '_']

function onlyNumbers(text) {
    return text.replace(/[^\d]/g, '')
}

export function clearName(text) {
    text = text
        .replace(/^( )/g, '')
        .replace(/[\[\].!'@,><|://\\;"\-/&*\()/_+~^´#%¨$`?{ºª°}=0-9]/g, '')
        .replace(/[áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/g, '')

    return text
}

export function inputName(text) {
    text = text
        .replace(/^( )/g, '')
        .replace(/[\[\].!'@,><|://\\;"\-/&*\()/_+~^´#%¨$`?{ºª°}=0-9]/g, '')
        .replace(/[àèïöñÀÈÏÖÑ]/g, '')

    return text
}

function cep(text) {
    text = onlyNumbers(text || '').substring(0, 8)
    if (text.length <= 5) {
        return text
    }

    const part1 = text.substring(0, 5)
    const part2 = text.substring(5)
    return `${part1}-${part2}`
}

function cpf(text) {
    text = onlyNumbers(text || '').substring(0, 11)
    if (text.length <= 3) {
        return text
    }

    if (text.length <= 6) {
        const part1 = text.substring(0, 3)
        const part2 = text.substring(3)
        return `${part1}.${part2}`
    }

    if (text.length <= 9) {
        const part1 = text.substring(0, 3)
        const part2 = text.substring(3, 6)
        const part3 = text.substring(6, 9)
        return `${part1}.${part2}.${part3}`
    }

    const part1 = text.substring(0, 3)
    const part2 = text.substring(3, 6)
    const part3 = text.substring(6, 9)
    const part4 = text.substring(9)
    return `${part1}.${part2}.${part3}-${part4}`
}

function cnpj(text) {
    text = onlyNumbers(text || '').substring(0, 14)
    if (text.length <= 2) {
        return text
    }

    if (text.length <= 5) {
        const part1 = text.substring(0, 2)
        const part2 = text.substring(2)
        return `${part1}.${part2}`
    }

    if (text.length <= 8) {
        const part1 = text.substring(0, 2)
        const part2 = text.substring(2, 5)
        const part3 = text.substring(5, 8)
        return `${part1}.${part2}.${part3}`
    }

    if (text.length <= 12) {
        const part1 = text.substring(0, 2)
        const part2 = text.substring(2, 5)
        const part3 = text.substring(5, 8)
        const part4 = text.substring(8, 12)
        return `${part1}.${part2}.${part3}/${part4}`
    }

    const part1 = text.substring(0, 2)
    const part2 = text.substring(2, 5)
    const part3 = text.substring(5, 8)
    const part4 = text.substring(8, 12)
    const part5 = text.substring(12)
    return `${part1}.${part2}.${part3}/${part4}-${part5}`
}

function phone(text) {
    text = onlyNumbers(text || '').substring(0, 11)
    if (text.length <= 2) {
        return text
    }

    if (text.length <= 6) {
        const part1 = text.substring(0, 2)
        const part2 = text.substring(2, 6)
        return `(${part1}) ${part2}`
    }

    if (text.length <= 10) {
        const part1 = text.substring(0, 2)
        const part2 = text.substring(2, 6)
        const part3 = text.substring(6, 10)
        return `(${part1}) ${part2}-${part3}`
    }

    const part1 = text.substring(0, 2)
    const part2 = text.substring(2, 7)
    const part3 = text.substring(7, 11)
    return `(${part1}) ${part2}-${part3}`
}

export function inputPrice(value) {
    value = value
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d)(\d{2})$/, '$1,$2')
    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')
    return value
}

export function rg(text) {
    text = onlyNumbers(text || '').substring(0, 9)
    if (text.length <= 2) {
        return text
    }

    if (text.length <= 5) {
        const part1 = text.substring(0, 2)
        const part2 = text.substring(2)
        return `${part1}.${part2}`
    }

    if (text.length <= 8) {
        const part1 = text.substring(0, 2)
        const part2 = text.substring(2, 5)
        const part3 = text.substring(5, 8)
        return `${part1}.${part2}.${part3}`
    }

    const part1 = text.substring(0, 2)
    const part2 = text.substring(2, 5)
    const part3 = text.substring(5, 8)
    const part4 = text.substring(8)
    return `${part1}.${part2}.${part3}-${part4}`
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