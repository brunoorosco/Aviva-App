import crypto from 'node:crypto'

class CryptAdapter {
  constructor(private salt: string) {}

  hashPassword(password: string) {
    this.salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`)
    return hash
  }

  compare(password: string) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`)
    // return this.hash === hash
    return hash === password
  }
}
export default CryptAdapter
