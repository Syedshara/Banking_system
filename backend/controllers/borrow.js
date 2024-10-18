import Lending from "../models/lending.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js"
import { emitRequest } from '../index.js'; // Import emitNotification

import mongoose from 'mongoose';

export const getLenders = async (req, res) => {
    try {
        const { money, interest, duration, id } = req.body;

        const borrowerId = new mongoose.Types.ObjectId(id);

        if (!money) {
            return res.status(400).json({ message: "Money is required." });
        }

        const minAmount = money * 0.9;
        const maxAmount = money * 1.1;

        const query = {
            amount: { $gte: minAmount, $lte: maxAmount },
            user_id: { $ne: borrowerId }
        };

        if (interest) {
            query.min_interest = { $lte: interest };
            query.max_interest = { $gte: interest };
        }

        if (duration) {
            const minDuration = duration * 0.9;
            const maxDuration = duration * 1.1;
            query.duration = { $gte: minDuration, $lte: maxDuration };
        }

        const lenders = await Lending.find(query);
        const formattedLenders = await Promise.all(
            lenders.map(async (lender) => {
                const user = await User.findById(lender.user_id).select('name');
                const hasRequested = lender.requests.some(request =>
                    request.borrower_id.equals(borrowerId) && request.status === 'requested'
                );

                return {
                    lending_id: lender._id,
                    lender_id: lender.user_id,
                    amount: lender.amount,
                    interest_range: `${lender.min_interest}-${lender.max_interest}%`,
                    min_interest: lender.min_interest,
                    duration: lender.duration,
                    user_name: user ? user.name : 'Balan',
                    has_requested: hasRequested
                };
            })
        );

        res.status(200).json(formattedLenders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const addRequest = async (req, res) => {
    try {
        const { borrower_id, lending_id, lender_id, amount, interest_rate } = req.body;

        const transaction = new Transaction({
            lending_id,
            lender_id,
            borrower_id,
            amount,
            interest_rate,
            transaction_status: "requested"

        });

        await transaction.save();
        const updatedLending = await Lending.findByIdAndUpdate(
            lending_id,
            { $addToSet: { requests: { borrower_id, status: 'requested' } } },
            { new: true }
        );
        emitRequest({
            "message": "request added "
        })

        res.status(201).json({ message: 'Lender requested successfully.', transaction });
    } catch (error) {
        console.error('Error adding request:', error);
        res.status(500).json({ message: error.message });
    }


}
export const getRequestedTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const transactions = await Transaction.find({ borrower_id: id, transaction_status: "requested" });
        const results = [];
        for (const transaction of transactions) {
            const lending = await Lending.findById(transaction.lending_id);
            if (lending) {
                const lender = await User.findById(lending.user_id);
                if (lender) {
                    results.push({
                        transactionId: transaction._id,
                        lenderName: lender.name,
                        lenderID: transaction.lender_id,
                        lending_id: transaction.lending_id,
                        amount: lending.amount,
                        interestRate: transaction.interest_rate,
                        duration: lending.duration
                    });
                }
            }
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching requested transactions:", error);
        res.status(500).json({ message: error.message });
    }
};


export const withdrawTransaction = async (req, res) => {
    try {
        const { borrower_id, lending_id, transactionId } = req.body;

        if (!transactionId || !lending_id || !borrower_id) {
            return res.status(400).json({ message: 'Transaction ID, Lending ID, and Borrower ID are required' });
        }
        const result = await Transaction.findByIdAndDelete(transactionId);
        if (!result) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        const lendingResult = await Lending.updateOne(
            { _id: lending_id },
            { $pull: { requests: { borrower_id } } }
        );

        if (lendingResult.nModified === 0) {
            return res.status(404).json({ message: 'Borrower not found in lending requests' });
        }
        res.status(200).json({ message: 'Transaction withdrawn and borrower removed successfully' });
    } catch (error) {
        console.error("Error withdrawing transaction:", error);
        res.status(500).json({ message: 'An error occurred while withdrawing the transaction. Please try again later.' });
    }
};


