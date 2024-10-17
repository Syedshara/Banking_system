import express from "express";


import { getuser, getLendingRequests, actionOnLendingStatus, getTransactionHistory, getNotifications, getRepay, updatePay } from "../controllers/user.js";

const router = express.Router();



router.get("/:id", getuser)
router.get("/lending_requests/:id", getLendingRequests);
router.post('/lending_status', actionOnLendingStatus);
router.get("/transaction_history/:id", getTransactionHistory);
router.get("/notification/:id", getNotifications);
router.get("/getRepay/:id", getRepay);
router.post("/updatePay", updatePay)

export default router