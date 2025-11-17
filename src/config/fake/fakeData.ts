#!/usr/bin/env node
import { MongoClient } from "mongodb";
import { faker } from "@faker-js/faker";

// ----- Types -----
type User = {
  name: string;
  email: string;
  password: string;
};

// ----- Config -----
const MONGO_URI = `mongodb+srv://thl231195:Y9FE4FE8gzbSXliK@cluster0.hfh0wmk.mongodb.net?retryWrites=true&w=majority&appName=Cluster0`;
const DB_NAME = "nodejs2015typescript"; // database name
const COLLECTION_NAME = "users"; // collection name
const NUM_USERS = 3;

// ----- Generate One Fake User -----
const generateFakeUser = (): User => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 12, memorable: true }),
});

console.log("fake data", generateFakeUser());

// ----- Main Function -----
async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection<User>(COLLECTION_NAME);

    const users: User[] = Array.from({ length: NUM_USERS }, generateFakeUser);

    const result = await collection.insertMany(users);
    console.log(`✅ Inserted ${result.insertedCount} fake users into "${COLLECTION_NAME}"`);

    // Verify
    const allUsers = await collection.find().toArray();
    console.log("✅ Current users in collection:", allUsers);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

// ----- Run -----
main();
