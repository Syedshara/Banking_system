import express from 'express';
import {
    createLending,
    deleteLending,
    updateLending,
    getUserLendings
} from '../controllers/lending.js'; // Import controller functions

const lend = express.Router();

// Create a new lending
lend.post('/create', createLending);

// Delete a lending
lend.delete('/delete/:id', deleteLending);

// Update an existing lending
lend.put('/update/:id', updateLending);

// Get all lendings for a specific user
lend.get('/user/:userId', getUserLendings);

export default lend;
