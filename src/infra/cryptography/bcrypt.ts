import crypto from "node:crypto";

class CryptAdapter {
  private salt: string;
  constructor() {
    this.salt = process.env.SALT || "";
  }

  hashPassword(password: string) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return hash;
  }

  compare(password: string, hash: string) {
    const hashCompare = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return hash === hashCompare;
  }
  async randonPassword() {
    const length = 6;
    const charset = "abcdefghijmn0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }
}
export default CryptAdapter;
