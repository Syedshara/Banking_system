import express from "express";


import { getuser, getLendingRequests, actionOnLendingStatus ,getTransactionHistory,getNotifications} from "../controllers/user.js";

const router = express.Router();



router.get("/:id", getuser)
router.get("/lending_requests/:id", getLendingRequests);
router.post('/lending_status', actionOnLendingStatus);
router.get("/transaction_history/:id", getTransactionHistory);
router.get("/notification/:id", getNotifications);

export default router