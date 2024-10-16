import express from "express";
import {
    getLenders, addRequest, getRequestedTransactions, withdrawTransaction
} from "../controllers/borrow.js";


const borrow = express.Router();

borrow.post('/getlenders', getLenders);

borrow.post('/request', addRequest);

borrow.get('/requested_transactions/:id', getRequestedTransactions);

borrow.delete('/withdraw', withdrawTransaction);

export default borrow;