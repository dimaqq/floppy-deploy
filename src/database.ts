import { MongoClient, Db } from 'mongodb';

let database: Db;
let connection: MongoClient;

const connectDatabase = async () => {
  connection = await MongoClient.connect(process.env.MONGO_URL);
  database = connection.db('thumbnail-generator');
};

const getDatabase = (): Db => {
  return database;
};

const closeDatabase = async () => {
  console.log('closing connections');
  await connection.close();
};

export { getDatabase, connectDatabase, closeDatabase };
