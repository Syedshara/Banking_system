import User from '../models/user.js';
import bcryptjs from "bcryptjs";
import Transaction from '../models/transaction.js';
import Lending from '../models/lending.js';

export const getuser = async (req, res, next) => {
    const userId = req.params.id; // Get user ID from the request parameters

    try {
        // Find the user by ID
        const user = await User.findById(userId); // Pass userId directly

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Exclude sensitive data like password from the response
        const { password, ...userDetails } = user._doc; // _doc contains the user document

        // Return user details
        res.status(200).json(userDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getLendingRequests = async (req, res) => {
    const userId = req.params.id; // Lender's ID

    try {
        // Step 1: Find all transactions where the given user is the lender and the status is "requested"
        const transactions = await Transaction.find({
            lender_id: userId,
            transaction_status: "requested"
        });

        // Step 2: Map over the transactions and get corresponding lending and borrower details
        const requests = await Promise.all(
            transactions.map(async (transaction) => {
                const lending = await Lending.findById(transaction.lending_id);
                const borrower = await User.findById(transaction.borrower_id);

                if (!lending || !borrower) {
                    throw new Error("Data inconsistency detected: Lending or Borrower not found");
                }

                return {
                    transaction_id: transaction._id,
                    borrower_id: transaction.borrower_id,
                    borrower_name: borrower.name,
                    amount: lending.amount,
                    interest_rate: (lending.min_interest + lending.max_interest) / 2,
                    duration: lending.duration,
                };
            })
        );

        // Step 3: Send the response with the formatted JSON
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error or data inconsistency detected" });
    }
};


export const actionOnLendingStatus = async (req, res) => {
    try {
        const { transaction_id, action } = req.body;

        // Find the transaction using the provided transaction_id
        const transaction = await Transaction.findById(transaction_id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (action === "accepted") {
            // Step 1: Remove all other transactions with the same borrower_id and amount
            await Transaction.deleteMany({
                borrower_id: transaction.borrower_id,
                amount: transaction.amount,
                _id: { $ne: transaction_id }, // Exclude the current transaction
            });

            // Step 2: Update the status of the accepted transaction
            transaction.transaction_status = "accepted";
            await transaction.save();

            res.status(200).json({ message: 'Transaction accepted and conflicts removed.' });
        } else if (action === "rejected") {
            // Step 3: Remove the rejected transaction
            await Transaction.findByIdAndDelete(transaction_id);
            res.status(200).json({ message: 'Transaction rejected and removed.' });
        } else {
            res.status(400).json({ message: 'Invalid action.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
