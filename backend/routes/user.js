import express from "express";
import { getuser } from "../controllers/user.js";
const router = express.Router();



router.get("/:id", getuser)

export default router