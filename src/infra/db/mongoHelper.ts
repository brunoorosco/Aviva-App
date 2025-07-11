import { MongoClient, Collection } from 'mongodb'

class MongoHelper {
  private static client: MongoClient | null = null
  private static uri: string
  private static clientPromise: Promise<MongoClient> | null = null

  static async connect(uri: string): Promise<void> {
    this.uri = uri || process.env.MONGODB_URI || ''
    if (!this.clientPromise) {
      this.client = new MongoClient(this.uri, {})
      this.clientPromise = this.client.connect()
    }

    this.client = await this.clientPromise
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.clientPromise = null
    }
  }

  static async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }

    if (!this.client) {
      throw new Error('Client is not connected. Please connect first.')
    }

    return this.client.db().collection(name)
  }

  static map(data: any): any {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  }

  static mapCollection(collection: any[]): any[] {
    return collection.map((c) => this.map(c))
  }
}

export { MongoHelper }
