// controller/user.js
import User from '../models/user.js';
import bcryptjs from "bcryptjs";
import Transaction from '../models/transaction.js';
import Lending from '../models/lending.js';
import logger from './logger.js';
import { emitNotification, emitHistory } from '../index.js'; // Import emitNotification
import History from '../models/history.js';
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
        const { transaction_id, action, lending_id, borrower_id } = req.body;

        const transaction = await Transaction.findById(transaction_id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (action === "accepted") {
            await Transaction.deleteMany(
                { borrower_id: transaction.borrower_id, amount: transaction.amount, _id: { $ne: transaction_id } },
            );

            const lender = await User.findById(transaction.lender_id)
            if (!lender) {
                logger.error(`Lender not found: ${transaction.lender_id}`);
                return res.status(404).json({ message: 'Lender not found' });
            }

            const borrower = await User.findById(transaction.borrower_id);
            if (!borrower) {
                logger.error(`Borrower not found: ${transaction.borrower_id}`);
                return res.status(404).json({ message: 'Borrower not found' });
            }

            if (lender.bank_details.balance < transaction.amount) {
                logger.error(`Insufficient balance for lender ID: ${lender._id}`);
                return res.status(400).json({ message: 'Insufficient balance.', transaction: transaction });
            }

            lender.bank_details.balance -= transaction.amount;
            await lender.save();

            borrower.bank_details.balance += transaction.amount;
            await borrower.save();

            transaction.transaction_status = "pending";
            await transaction.save();


            const lending = await Lending.findById(transaction.lending_id);


            const history = new History({

                lender_id: transaction.lender_id,
                borrower_id: transaction.borrower_id,
                amount: transaction.amount,
                interest_rate: transaction.interest_rate,
                pay_method: "paid"

            });
            await history.save();

            emitHistory({
                message: "history updated"
            })

            // Emit notification here
            emitNotification({
                type: 'Payment Reminder!',
                message: `Transaction ${transaction_id} accepted.`,
                userId: borrower_id,
            });
            await Lending.updateOne(
                { _id: lending_id },
                { $pull: { requests: { borrower_id } } },

            );


            logger.info(`Transaction ${transaction_id} accepted.`);
            res.status(200).json({ message: 'Transaction accepted.' });
        } else if (action === "rejected") {
            await Transaction.findByIdAndDelete(transaction_id,);

            await Lending.updateOne(
                { _id: lending_id },
                { $pull: { requests: { borrower_id } } },

            );
            console.log("emitted");

            // Emit notification here
            emitNotification({
                type: 'Transaction Rejected',
                message: `Transaction ${transaction_id} rejected.`,
                userId: borrower_id,
            });


            logger.info(`Transaction ${transaction_id} rejected.`);
            res.status(200).json({ message: 'Transaction rejected.' });
        } else {
            res.status(400).json({ message: 'Invalid action.' });
        }
    } catch (error) {
        logger.error(`Error processing transaction: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.params.id;

        const transactions = await History.find({
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
                amount: transaction.amount.toFixed(2),
                status: transaction.pay_method,
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

        const transactions = await Transaction.find({ borrower_id: userId, transaction_status: "pending" });
        const lenderTransactions = await Transaction.find({ lender_id: userId, transaction_status: "pending" });

        const currentDate = new Date();
        let notifications = [];

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

            // Calculate simple interest
            const principal = lending.amount;
            const rate = transaction.interest_rate; // Percentage
            const duration = lending.duration / 12; // Convert months to years
            const interest = (principal * rate * duration) / 100;
            const totalAmount = principal + interest;

            if (dueDate > currentDate) {
                notifications.push({
                    type: 'Payment Reminder!',
                    lender_name: lender.name,
                    lender_amount: totalAmount,
                    interestRate: transaction.interest_rate,
                    message: `Reminder: You have to pay ₹${totalAmount.toFixed(2)} to ${lender.name} before ${dueDate.toISOString().split('T')[0]}.`,
                    date: `${updatedAtDate.toLocaleDateString()} ${updatedAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // Format date without seconds
                });
            }

            if (dueDate < currentDate) {
                notifications.push({
                    type: 'overdue_alert',
                    lender_name: lender.name,
                    lender_amount: totalAmount,
                    interestRate: transaction.interest_rate,
                    message: `Alert: You have an overdue payment of ₹${totalAmount.toFixed(2)} to ${lender.name} since ${dueDate.toISOString().split('T')[0]}.`,
                    date: `${updatedAtDate.toLocaleDateString()} ${updatedAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // Format date without seconds
                });
            }
        }

        for (const transaction of lenderTransactions) {
            const lending = await Lending.findById(transaction.lending_id);

            if (!lending) {
                continue;
            }

            const updatedAtDate = new Date(transaction.updatedAt);

            if (isNaN(updatedAtDate.getTime())) {
                console.error("Invalid updatedAt date:", transaction.updatedAt);
                continue;
            }

            const borrower = await User.findById(transaction.borrower_id);

            if (!borrower) {
                continue;
            }

            const dueDate = new Date(updatedAtDate);
            dueDate.setMonth(dueDate.getMonth() + lending.duration);

            const principal = lending.amount;
            const rate = transaction.interest_rate; // Percentage
            const duration = lending.duration / 12; // Convert months to years
            const interest = (principal * rate * duration) / 100;
            const totalAmount = principal + interest;

            if (dueDate > currentDate) {
                notifications.push({
                    type: 'Amount to be received',
                    borrower_name: borrower.name,
                    borrower_amount: totalAmount,
                    interestRate: transaction.interest_rate,
                    message: `Reminder: ${borrower.name} has to pay you ₹${totalAmount.toFixed(2)} before ${dueDate.toISOString().split('T')[0]}.`,
                    date: `${updatedAtDate.toLocaleDateString()} ${updatedAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // Format date without seconds
                });
            }

            if (dueDate < currentDate) {
                notifications.push({
                    type: 'overdue_alert',
                    borrower_name: borrower.name,
                    borrower_amount: totalAmount,
                    interestRate: transaction.interest_rate,
                    message: `Alert: ${borrower.name} has an overdue payment of ₹${totalAmount.toFixed(2)} to you since ${dueDate.toISOString().split('T')[0]}.`,
                    date: `${updatedAtDate.toLocaleDateString()} ${updatedAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // Format date without seconds
                });
            }
        }

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: error.message });
    }
};


export const getRepay = async (req, res) => {
    try {
        const { id } = req.params; // Borrower ID

        // Fetch all transactions related to this borrower
        const transactions = await Transaction.find({ borrower_id: id, transaction_status: "pending" });
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this borrower." });
        }

        // Create an array to hold repay details
        const repayDetails = [];
        const addMonths = (date, months) => {
            const newDate = new Date(date);
            for (let i = 0; i < months; i++) {  // Use 'let' instead of 'int'
                newDate.setMonth(newDate.getMonth() + 1);
            }
            // This will log the number of months being added
            return newDate;
        };
        for (const transaction of transactions) {
            // Fetch lender details using lender_id from the transaction
            const lender = await User.findById(transaction.lender_id);

            console.log(transaction);
            if (!lender) {
                return res.status(404).json({ message: "Lender not found." });
            }

            const lending = await Lending.findById(transaction.lending_id);
            console.log(lending);

            const duration = lending.duration; // Duration can be any integer, e.g., 14

            // Calculate dueDate by adding the lender's duration (in months) to the transaction's createdAt date
            const createdDate = new Date(transaction.createdAt); // Ensure this is a valid date
            const dueDate = addMonths(createdDate, duration); // Use duration directly

            // Ensure dueDate is a valid date
            if (isNaN(dueDate.getTime())) {
                return res.status(500).json({ message: "Invalid due date calculation." });
            }

            // Calculate remaining time until due date
            const currentDate = new Date();
            const remainingTime = dueDate.getTime() - currentDate.getTime();

            // Convert remainingTime to days
            const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

            // Construct response data for each transaction
            repayDetails.push({
                id: transaction._id,
                lenderName: lender.name,
                duration: lending.duration,
                principalAmount: transaction.amount,
                interestRate: transaction.interest_rate,
                currentDate,



                dueDate: dueDate.toISOString().split('T')[0], // Format dueDate as YYYY-MM-DD
                remainingDays: remainingDays > 0 ? remainingDays : 0,
            });
        }

        // Step 3: Send the repay details as a response
        res.status(200).json(repayDetails);
    } catch (error) {
        console.error("Error fetching repay details:", error);
        res.status(500).json({ message: "Error fetching repay details.", error: error.message });
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
        if (borrower.bank_details.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance for this transaction." });
        }

        // Update the lender's balance
        lender.bank_details.balance += amount; // Assuming there's a balance field in the User model
        await lender.save();

        // Update the borrower's balance
        if (borrower.balance - amount < 0) {
            return res.status(400).json({ message: "Insufficient balance for this transaction." });
        }
        borrower.bank_details.balance -= amount; // Assuming there's a balance field in the User model
        await borrower.save();

        // Update the transaction status to 'paid'
        transaction.transaction_status = "paid";
        transaction.amount = amount;
        await transaction.save();
        const lending = await Lending.findById(transaction.lending_id);

        const history = new History({

            lender_id: transaction.borrower_id,
            borrower_id: transaction.lender_id,
            amount: transaction.amount,
            interest_rate: transaction.interest_rate,
            pay_method: "recieved"

        });
        await history.save();

        emitHistory({
            message: "history updated"
        })

        console.log("emitted");
        emitNotification({

            message: `paided.`,

        });

        // Send a success response
        res.status(200).json({ message: "Payment successful.", transaction });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ error: error.message });
    }
};
