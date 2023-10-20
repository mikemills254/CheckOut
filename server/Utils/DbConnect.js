import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const password = process.env.DB_PASS;
const uri = `mongodb+srv://mikemills930:${password}@cluster0.hbyydft.mongodb.net/checkout?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

export const DataBase = {
    Connect: async () => {
        try {
            await client.connect();
            return client;
        } catch (error) {
            throw new Error("Failed to connect with MongoDB: " + error.message);
        }
        
    },
    InsertData: async (db, collection, data) => {
        try {
            const Db = client.db(db);
            const Collection = Db.collection(collection);
            
            const result = await Collection.insertMany([
                { data }
            ]);
            
            console.log('results', result);
            return result;
        } catch (error) {
            throw new Error(`Failed to insert data into ${collection}: ${error.message}`);
        }
    },
};

