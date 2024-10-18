import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import path from 'path';
import http from 'http'; // Import http
import { Server } from 'socket.io'; // Import socket.io
import auth from './routes/auth.js';
import lend from './routes/lending.js';
import user from './routes/user.js';
import borrow from './routes/borrow.js';

dotenv.config();
const __dirname = path.resolve();
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from any origin
        methods: ["GET", "POST"], // Allowed HTTP methods
        credentials: true, // Enable credentials if needed
    },
});


app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.URL_DB)
    .then(() => {
        server.listen(3000, () => {
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
app.use('/borrow', borrow);

// Handle socket connections
let activeUsers = {}; // Object to track active users

// Object to track active users and their socket connections

io.on('connection', (socket) => {
    console.log('user  connected');
});
// Emit notifications when a transaction is updated
export const emitNotification = (notification) => {
    console.log(notification);
    io.emit('notification', notification);
};

export const emitRequest = (request) => {
    console.log(request);
    io.emit('request', request);
}

export const emitHistory = (history) => {
    console.log(history);
    io.emit('history', history);
}
