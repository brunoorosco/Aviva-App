require('dotenv').config({path: '.env.local'});
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = 'churchs_avivamento';

async function connectMongo() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  const db = client.db(dbName);
  return { client, db };
}

module.exports = { connectMongo };