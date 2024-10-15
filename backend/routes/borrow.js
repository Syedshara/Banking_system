import express from "express";
import {
    getLenders,addRequest
} from "../controllers/borrow.js";


const borrow = express.Router();

borrow.post('/getlenders', getLenders);

borrow.post('/request',addRequest);

export default borrow;