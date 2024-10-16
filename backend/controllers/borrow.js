import Lending from "../models/lending.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js"

import mongoose from 'mongoose'; // Ensure mongoose is imported

export const getLenders = async (req, res) => {
    try {
        const { money, interest, duration, id } = req.body;

        // Convert id to ObjectId using 'new' keyword
        const borrowerId = new mongoose.Types.ObjectId(id); // Using 'new' to create an ObjectId

        if (!money) {
            return res.status(400).json({ message: "Money is required." });
        }

        const minAmount = money * 0.9;
        const maxAmount = money * 1.1;

        const query = {
            amount: { $gte: minAmount, $lte: maxAmount },
            user_id: { $ne: borrowerId } // Exclude the lender with the given id
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

        // Query lenders
        const lenders = await Lending.find(query);

        // Fetch user details and check if the borrower has already requested this lender
        const formattedLenders = await Promise.all(
            lenders.map(async (lender) => {
                const user = await User.findById(lender.user_id).select('name');

                // Check if the borrower has requested this lender
                const hasRequested = lender.requests.some(request =>
                    request.borrower_id.equals(borrowerId) && request.status === 'requested'
                );

                return {
                    lending_id: lender._id,
                    lender_id: lender.user_id,
                    amount: lender.amount,
                    interest_range: `${lender.min_interest}-${lender.max_interest}%`,
                    duration: lender.duration,
                    user_name: user ? user.name : 'Balan',
                    has_requested: hasRequested // Indicate if the borrower has already requested this lender
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
        const { borrower_id, lending_id, lender_id, amount } = req.body;

        // Create a new transaction
        const transaction = new Transaction({
            lending_id,
            lender_id,
            borrower_id,
            amount,
            transaction_status: "requested"
        });

        // Save the transaction
        await transaction.save();

        // Update the lender's requests
        const updatedLending = await Lending.findByIdAndUpdate(
            lending_id,
            { $addToSet: { requests: { borrower_id, status: 'requested' } } },
            { new: true }
        );

        // Log the updated lending for debugging


        res.status(201).json({ message: 'Lender requested successfully.', transaction });
    } catch (error) {
        console.error('Error adding request:', error); // Log the error
        res.status(500).json({ message: error.message });
    }


}
export const getRequestedTransactions = async (req, res) => {
    try {
        const { id } = req.params; // Get borrower ID from request parameters

        // Step 1: Fetch transactions for the borrower with status "requested"
        const transactions = await Transaction.find({ borrower_id: id, transaction_status: "requested" });

        // Debug log to check fetched transactions


        // Step 2: Prepare an array to hold the results
        const results = [];

        // Step 3: Loop through transactions to get lending and lender details
        for (const transaction of transactions) {
            // Fetch lending details using lending_id from the transaction
            const lending = await Lending.findById(transaction.lending_id);

            // Check if lending details were found
            if (lending) {
                // Fetch lender's user details using user_id from the lending details
                const lender = await User.findById(lending.user_id);


                // Check if lender details were found
                if (lender) {
                    // Push the required details to results array
                    results.push({
                        transactionId: transaction._id, // Get the transaction ID   
                        lenderName: lender.name,
                        lenderID: transaction.lender_id,
                        lending_id: transaction.lending_id,
                        // Get the lender's name
                        amount: lending.amount,   // Get the requested amount
                        interestRate: lending.max_interest // Get the interest rate (or min_interest if required)
                    });
                }
            }
        }

        // Step 4: Send the response with the constructed results
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching requested transactions:", error);
        res.status(500).json({ message: error.message });
    }
};


export const withdrawTransaction = async (req, res) => {
    try {
        // Extract transaction ID from the request parameters
        const { id } = req.params;
        // Extract borrower ID from the request body
        const { borrower_id } = req.body;

        // Remove the transaction from the Transaction collection
        const result = await Transaction.findByIdAndDelete(id);

        // Check if the transaction was found and deleted
        if (!result) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Find the lending request that corresponds to this transaction and remove the borrower from the requests array
        const lendingResult = await Lending.updateOne(
            { 'requests.borrower_id': borrower_id }, // Find the lending record with this borrower_id
            { $pull: { requests: { borrower_id } } } // Remove the borrower from the requests array
        );

        // Check if the lending request was found and updated
        if (lendingResult.nModified === 0) {
            return res.status(404).json({ message: 'Borrower not found in lending requests' });
        }

        // Send success response
        res.status(200).json({ message: 'Transaction withdrawn and borrower removed successfully' });
    } catch (error) {
        console.error("Error withdrawing transaction:", error);
        res.status(500).json({ message: error.message });
    }
};



