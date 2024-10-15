// Import required packages
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connection URI and Database Name
const uri = process.env.MONGO_URI; // MongoDB URI from the .env file
const dbName = "peer_to_peer";     // Database name

async function main() {
    // Create a MongoClient
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected to database');

        // Specify database and collections
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        const lendingCollection = db.collection('lending_details');
        const transactionsCollection = db.collection('transactions');

        // Insert sample documents into 'users' collection
        await usersCollection.insertMany([
            {
                id: "user_001",
                name: "John Doe",
                email: "john.doe@example.com",
                password: "hashed_password_001",
                bank_details: {
                    acc_name: "John Doe",
                    pin: "hashed_pin_001",
                    IFSC: "EXAM0000123"
                },
                lending_ids: ["lend_001"],
                transaction_ids: ["trans_001"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: "user_002",
                name: "Alice Smith",
                email: "alice.smith@example.com",
                password: "hashed_password_002",
                bank_details: {
                    acc_name: "Alice Smith",
                    pin: "hashed_pin_002",
                    IFSC: "EXAM0000456"
                },
                lending_ids: ["lend_002"],
                transaction_ids: ["trans_002"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: "user_005",
                name: "Bob Johnson",
                email: "bob.johnson@example.com",
                password: "hashed_password_003",
                bank_details: {
                    acc_name: "Bob Johnson",
                    pin: "hashed_pin_003",
                    IFSC: "EXAM0000789"
                },
                lending_ids: ["lend_003"],
                transaction_ids: ["trans_003"],
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        console.log('Inserted documents into users collection');

    } catch (e) {
        console.error(e);
    } finally {
        await client.close(); // Ensure connection is closed
    }
}

// Call the main function to run the script
main().catch(console.error);
