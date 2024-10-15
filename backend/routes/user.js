import express from "express";
import { getuser ,getLendingRequests,actionOnLendingStatus} from "../controllers/user.js";
const router = express.Router();



router.get("/:id", getuser)

router.get("/lending_requests/:id", getLendingRequests);

router.post('/lending_status', actionOnLendingStatus);

export default router