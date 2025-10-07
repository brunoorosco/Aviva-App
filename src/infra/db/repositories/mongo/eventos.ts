import { TEvent } from '@/domain/models/events'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'

export class EventsRepository {
  private collectionName: string

  constructor() {
    this.collectionName = 'events'
  }

  async getEventById(id: string): Promise<TEvent | null> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const event = await collection.findOne({ _id: new ObjectId(id) })
      return event as TEvent | null
    } catch (error) {
      console.error('Error finding event by id:', error)
      throw error
    }
  }

  async getEvents(churchId: string) {
    const collection = await MongoHelper.getCollection(this.collectionName)

    const data = await collection
      .find({ churchId })
      .collation({ locale: 'pt', strength: 1 })
      .sort({ data: -1 })
      .toArray()

    return data
  }

  async create(data: Omit<TEvent, '_id'>): Promise<TEvent> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return {
        _id: result.insertedId.toString(),
        ...data
      }
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  async update(id: string, data: Partial<TEvent>): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }
}
