import { MongoClient, Collection } from 'mongodb'

class MongoHelper {
  private static client: MongoClient | null = null
  private static uri: string

  static async connect(uri: string): Promise<void> {
    if (!this.client) {
      this.uri = process.env.MONGO_CONNECTION || uri
      this.client = await MongoClient.connect(uri, {})
    }
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  }

  static async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      if (!this.uri) {
        throw new Error(
          'URI is not defined. Please provide a valid MongoDB URI.'
        )
      }
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
