import crypto from 'node:crypto'

class CryptAdapter {
  private salt: string
  constructor() {
    this.salt = process.env.SALT || ''
  }

  hashPassword(password: string) {
    //SALT='MC6X1pXuVLUeOEHveSLwxhA'

    const hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`)
    return hash
  }

  compare(password: string, hash: string) {
    const hashCompare = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`)
    return hash === hashCompare
  }
}
export default CryptAdapter
