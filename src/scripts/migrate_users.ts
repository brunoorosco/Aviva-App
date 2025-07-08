import { MongoHelper } from '@/infra/db/mongoHelper'

const mongo = new MongoHelper()
const collection = await MongoHelper.getCollection('aceita_jesus')
const church = await collection.insertMany({})
