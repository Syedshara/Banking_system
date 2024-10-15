import express from "express";
import {
    getLenders
} from "../controllers/borrow.js";


const borrow = express.Router();

borrow.post('/getlenders', getLenders);

export default borrow;