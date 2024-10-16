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
                    interest_rate: (lending.min_interest + lending.max_interest) / 2,
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
        const { transaction_id, action } = req.body;

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

        } else if (action === "rejected") {
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
                    type: 'payment_reminder',
                    lender_name: lender.name,
                    lender_amount: lending.amount,
                    message: `Reminder: You have an immediate payment of ₹${lending.amount} to ${lender.name} on ${dueDate.toISOString().split('T')[0]}.`,
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
