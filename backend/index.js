import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import path from 'path';
import auth from './routes/auth.js';
import lend from './routes/lending.js';
import user from './routes/user.js'
import borrow from './routes/borrow.js';

dotenv.config();
const __dirname = path.resolve();
const app = express();

// Use CORS middleware
app.use(cors());

// Use JSON middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.URL_DB)
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000!");
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Define routes
app.use('/auth', auth);
app.use('/users', user);
app.use('/lend', lend);
app.use('/borrow', borrow)