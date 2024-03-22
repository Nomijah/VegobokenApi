import { MongoClient } from "mongodb";

const MONGO_URL = `mongodb+srv://petterbostrom:${process.env.MONGODB_PASSWORD}@cluster0.mcj2nln.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(MONGO_URL);
client.connect();

const database = client.db("test");
const collection = database.collection("users");

export const getAllUsers = () => collection.find();
