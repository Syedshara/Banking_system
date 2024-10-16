import User from '../models/user.js';
import bcryptjs from "bcryptjs";
import Transaction from '../models/transaction.js';
import Lending from '../models/lending.js';

export const getuser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, ...userDetails } = user._doc;

        res.status(200).json(userDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLendingRequests = async (req, res) => {
    const userId = req.params.id;

    try {
        const transactions = await Transaction.find({
            lender_id: userId,
            transaction_status: "requested"
        });

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
                    lending_id: transaction.lending_id,
                    interest_rate: transaction.interest_rate,
                    duration: lending.duration,
                };
            })
        );

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error or data inconsistency detected" });
    }
};

export const actionOnLendingStatus = async (req, res) => {
    try {
        const { transaction_id,
            action,
            pin,
            borrower_id,
            lending_id, } = req.body;

        const transaction = await Transaction.findById(transaction_id);
        console.log(transaction);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (action === "accepted") {
            await Transaction.deleteMany({
                borrower_id: transaction.borrower_id,
                amount: transaction.amount,
                _id: { $ne: transaction_id },
            });

            const lender = await User.findById(transaction.lender_id);
            if (!lender) {
                return res.status(404).json({ message: 'Lender not found' });
            }
            const borrower = await User.findById(transaction.borrower_id);
            if (!borrower) {
                return res.status(404).json({ message: 'Borrower not found' });
            }

            if (lender.bank_details.balance < transaction.amount) {
                return res.status(400).json({ message: 'Insufficient balance.' });
            }

            lender.bank_details.balance -= transaction.amount;
            await lender.save();

            borrower.bank_details.balance += transaction.amount;
            await borrower.save();

            transaction.transaction_status = "pending";
            await transaction.save();

            res.status(200).json({ message: 'Transaction accepted, conflicts removed, and lender’s balance updated.' });
            const lendingResult = await Lending.updateOne(
                { _id: lending_id }, // Find the lending record with this lending_id
                { $pull: { requests: { borrower_id } } } // Remove the borrower from the requests array
            );

            // Check if the lending request was found and updated
            if (lendingResult.nModified === 0) {
                return res.status(404).json({ message: 'Borrower not found in lending requests' });
            }

        } else if (action === "rejected") {
            await Transaction.findByIdAndDelete(transaction_id);
            res.status(200).json({ message: 'Transaction rejected and removed.' });
            const lendingResult = await Lending.updateOne(
                { _id: lending_id }, // Find the lending record with this lending_id
                { $pull: { requests: { borrower_id } } } // Remove the borrower from the requests array
            );

            // Check if the lending request was found and updated
            if (lendingResult.nModified === 0) {
                return res.status(404).json({ message: 'Borrower not found in lending requests' });
            }
        } else {
            res.status(400).json({ message: 'Invalid action.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.params.id;

        const transactions = await Transaction.find({
            $or: [
                { lender_id: userId },
                { borrower_id: userId }
            ]
        }).sort({ createdAt: -1 });

        const lenderIds = [...new Set(transactions.map(transaction => transaction.lender_id.toString()))];
        const borrowerIds = [...new Set(transactions.map(transaction => transaction.borrower_id.toString()))];

        const lenders = await User.find({ _id: { $in: lenderIds } }, 'name');
        const borrowers = await User.find({ _id: { $in: borrowerIds } }, 'name');

        const lenderMap = lenders.reduce((acc, lender) => {
            acc[lender._id.toString()] = lender.name;
            return acc;
        }, {});

        const borrowerMap = borrowers.reduce((acc, borrower) => {
            acc[borrower._id.toString()] = borrower.name;
            return acc;
        }, {});

        const formattedTransactions = transactions.map(transaction => {
            const isLender = transaction.lender_id.toString() === userId;
            return {
                date: transaction.createdAt,
                name: isLender ? borrowerMap[transaction.borrower_id.toString()] : lenderMap[transaction.lender_id.toString()],
                amount: transaction.amount,
                status: transaction.transaction_status,
                role: isLender ? 'lender' : 'borrower'
            };
        });

        res.status(200).json(formattedTransactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.params.id;

        const transactions = await Transaction.find({ borrower_id: userId });

        const currentDate = new Date();
        console.log("Current Date: ", currentDate);

        for (const transaction of transactions) {
            const lending = await Lending.findById(transaction.lending_id);

            if (!lending) {
                continue;
            }

            const updatedAtDate = new Date(transaction.updatedAt);

            if (isNaN(updatedAtDate.getTime())) {
                console.error("Invalid updatedAt date:", transaction.updatedAt);
                continue;
            }

            const lender = await User.findById(transaction.lender_id);

            if (!lender) {
                continue;
            }

            const dueDate = new Date(updatedAtDate);
            dueDate.setMonth(dueDate.getMonth() + lending.duration);

            const threeDaysFromNow = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
            const notifications = [];
            console.log(dueDate > currentDate);
            if (dueDate > currentDate) {
                notifications.push({
                    type: 'Payment Reminder!',
                    lender_name: lender.name,
                    lender_amount: lending.amount,
                    message: `Reminder: You have to pay  ₹${lending.amount} to ${lender.name} before ${dueDate.toISOString().split('T')[0]}.`,
                    date: currentDate.toISOString().split('T')[0],
                });
            }

            if (dueDate < currentDate) {
                notifications.push({
                    type: 'overdue_alert',
                    lender_name: lender.name,
                    lender_amount: lending.amount,
                    message: `Alert: You have an overdue payment of ₹${lending.amount} to ${lender.name} since ${dueDate.toISOString().split('T')[0]}.`,
                    date: currentDate.toISOString().split('T')[0],
                });
            }
        }

        console.log("Notifications: ", notifications);

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: error.message });
    }
};


export const getRepay = async (req, res) => {
    try {
        const { id } = req.params;  // Borrower ID

        // Fetch all transactions related to this borrower
        const transactions = await Transaction.find({ borrower_id: id, transaction_status: "pending" });
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this borrower." });
        }

        // Fetch all pending lendings related to this borrower


        // Create an array to hold repay details
        const repayDetails = [];

        for (const transaction of transactions) {
            // Fetch lender details using lender_id from the transaction
            const lender = await User.findById(transaction.lender_id); // Assuming you have a User model for lenders
            if (!lender) {
                return res.status(404).json({ message: "Lender not found." });
            }

            // Helper function to add months to a Date object
            const addMonths = (date, months) => {
                const newDate = new Date(date);
                newDate.setMonth(newDate.getMonth() + months);
                return newDate;
            };

            // Calculate dueDate by adding the lender's duration (in months) to the transaction's createdAt date
            const createdDate = new Date(transaction.createdAt);
            const dueDate = addMonths(createdDate, lender.duration);  // Assuming duration is in months

            // Calculate remaining time until due date
            const currentDate = new Date();  // Current date
            const remainingTime = dueDate.getTime() - currentDate.getTime();  // Difference in milliseconds

            // Convert remainingTime to days
            const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

            // Construct response data for each transaction
            repayDetails.push({
                id: transaction.transaction_id,
                lenderName: lender.name,
                principalAmount: transaction.amount,
                interestRate: transaction.interest_rate,
                dueDate: dueDate.toISOString().split('T')[0], // Format dueDate as YYYY-MM-DD
                remainingDays: remainingDays > 0 ? remainingDays : 0,
                // Ensure non-negative remaining days

            });
        }

        // Step 3: Send the repay details as a response
        res.status(200).json(repayDetails);
    } catch (error) {
        console.error("Error fetching repay details:", error);
        res.status(500).json({ error: error.message });
    }
};


export const updatePay = async (req, res) => {
    try {
        const { id, amount } = req.body; // Transaction ID and the payment amount

        // Fetch the transaction using the transaction ID
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        // Fetch the lender and borrower using their IDs
        const lender = await User.findById(transaction.lender_id);
        const borrower = await User.findById(transaction.borrower_id);
        if (!lender || !borrower) {
            return res.status(404).json({ message: "Lender or borrower not found." });
        }

        // Check if the borrower has enough balance to make the payment
        if (borrower.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance for this transaction." });
        }

        // Update the lender's balance
        lender.balance += amount; // Assuming there's a balance field in the User model
        await lender.save();

        // Update the borrower's balance
        if (borrower.balance - amount < 0) {
            return res.status(400).json({ message: "Insufficient balance for this transaction." });
        }
        borrower.balance -= amount; // Assuming there's a balance field in the User model
        await borrower.save();

        // Update the transaction status to 'paid'
        transaction.transaction_status = "paid";
        await transaction.save();

        // Send a success response
        res.status(200).json({ message: "Payment successful.", transaction });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ error: error.message });
    }
};
