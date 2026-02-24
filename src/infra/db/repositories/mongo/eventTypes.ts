import { TEventType } from '@/domain/models/eventTypes'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../../mongoHelper'

export class EventTypesRepository {
  private collectionName: string

  constructor() {
    this.collectionName = 'event_types'
  }

  async getEventTypeById(id: string): Promise<TEventType | null> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const eventType = await collection.findOne({ _id: new ObjectId(id) })
      
      if (!eventType) return null
      
      return {
        _id: eventType._id.toString(),
        name: eventType.name,
        color: eventType.color,
        churchId: eventType.churchId,
        createdAt: eventType.createdAt,
        updatedAt: eventType.updatedAt
      } as TEventType
    } catch (error) {
      console.error('Error finding event type by id:', error)
      throw error
    }
  }

  async getEventTypes(churchId: string): Promise<TEventType[]> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const data = await collection
        .find({ churchId })
        .collation({ locale: 'pt', strength: 1 })
        .sort({ name: 1 })
        .toArray()
      
      return data.map((item) => ({
        _id: item._id.toString(),
        name: item.name,
        color: item.color,
        churchId: item.churchId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })) as TEventType[]
    } catch (error) {
      console.error('Error getting event types:', error)
      throw error
    }
  }

  async create(data: Omit<TEventType, '_id'>): Promise<TEventType> {
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
      console.error('Error creating event type:', error)
      throw error
    }
  }

  async update(id: string, data: Partial<TEventType>): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating event type:', error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const collection = await MongoHelper.getCollection(this.collectionName)
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Error deleting event type:', error)
      throw error
    }
  }
}
