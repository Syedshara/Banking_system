import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'; // Import the cors package
import auth from './routes/auth.js';

dotenv.config();
const __dirname = path.resolve();
const app = express();

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

mongoose.connect(process.env.URL_DB)
    .then(() => {
        app.listen(3000, () => {
            console.log("server is running on port 3000!");
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.use('/auth', auth);