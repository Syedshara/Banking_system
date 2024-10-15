import express from "express";
import { getuser ,getLendingRequests} from "../controllers/user.js";
const router = express.Router();



router.get("/:id", getuser)

router.get("/lending_requests/:id", getLendingRequests);

export default router