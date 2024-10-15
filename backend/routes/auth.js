import express from "express";
import { createUser, getUsers } from "../controllers/auth.js";

const router = express.Router();

router.post('/register', createUser);
router.post('/signin', getUsers);

export default router