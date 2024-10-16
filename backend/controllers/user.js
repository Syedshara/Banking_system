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
                    lending_id: transaction.lending_id,
                    interest_rate: transaction.interest_rate,
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
        const { transaction_id,
            action,
            pin,
            borrower_id,
            lending_id, } = req.body;

        // Find the transaction using the provided transaction_id
        const transaction = await Transaction.findById(transaction_id);
        console.log(transaction);
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

            // Step 2: Fetch the lender details
            const lender = await User.findById(transaction.lender_id);
            if (!lender) {
                return res.status(404).json({ message: 'Lender not found' });
            }
            const borrower = await User.findById(transaction.borrower_id);
            if (!borrower) {
                return res.status(404).json({ message: 'Borrower not found' });
            }


            // Step 3: Check if the lender has sufficient balance
            if (lender.bank_details.balance < transaction.amount) {
                return res.status(400).json({ message: 'Insufficient balance.' });
            }

            // Step 4: Deduct the loan amount from the lender's balance
            lender.bank_details.balance -= transaction.amount;
            await lender.save();

            borrower.bank_details.balance += transaction.amount;
            await borrower.save();



            // Step 5: Update the status of the accepted transaction
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
            // Step 6: Remove the rejected transaction
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

        // Step 1: Fetch transactions where the user is either lender or borrower
        const transactions = await Transaction.find({
            $or: [
                { lender_id: userId },
                { borrower_id: userId }
            ]
        }).sort({ createdAt: -1 }); // Sort by date descending (most recent first)

        // Step 2: Collect unique lender and borrower IDs
        const lenderIds = [...new Set(transactions.map(transaction => transaction.lender_id.toString()))];
        const borrowerIds = [...new Set(transactions.map(transaction => transaction.borrower_id.toString()))];

        // Step 3: Fetch users by their IDs
        const lenders = await User.find({ _id: { $in: lenderIds } }, 'name');
        const borrowers = await User.find({ _id: { $in: borrowerIds } }, 'name');

        // Create a map for quick lookup
        const lenderMap = lenders.reduce((acc, lender) => {
            acc[lender._id.toString()] = lender.name; // Store lender names with their IDs
            return acc;
        }, {});

        const borrowerMap = borrowers.reduce((acc, borrower) => {
            acc[borrower._id.toString()] = borrower.name; // Store borrower names with their IDs
            return acc;
        }, {});

        // Step 4: Format the output
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

        // Step 5: Send the formatted response
        res.status(200).json(formattedTransactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters

        // Step 1: Fetch all transactions where the user is a borrower
        const transactions = await Transaction.find({ borrower_id: userId });

        // Debug log to check fetched transactions
        // console.log("Fetched Transactions: ", transactions);

        const currentDate = new Date();
        console.log("Current Date: ", currentDate); // Log current date
        const notifications = [];

        // Step 2: Loop through transactions to fetch lending info and create notifications
        for (const transaction of transactions) {
            // Fetch the lending details manually
            const lending = await Lending.findById(transaction.lending_id); // Using transaction.lending_id directly

            // Debug log to check fetched lending
            //console.log("Fetched Lending: ", lending);

            if (!lending) {
                continue; // Skip if no lending found
            }

            // Log updatedAt value from transaction
            //console.log("Updated At (transaction): ", transaction.updatedAt);

            // Use updatedAt from transaction for due date calculation
            const updatedAtDate = new Date(transaction.updatedAt);
            //console.log("Parsed Updated At Date: ", updatedAtDate);

            // Check if updatedAtDate is valid
            if (isNaN(updatedAtDate.getTime())) {
                console.error("Invalid updatedAt date:", transaction.updatedAt);
                continue; // Skip if updatedAt is invalid
            }

            // Fetch the lender's user details
            const lender = await User.findById(transaction.lender_id); // Fetch lender details

            // Debug log to check fetched lender
            //console.log("Fetched Lender: ", lender);

            if (!lender) {
                continue; // Skip if no lender found
            }

            // Calculate due date based on transaction updatedAt and lending duration
            const dueDate = new Date(updatedAtDate);
            dueDate.setMonth(dueDate.getMonth() + lending.duration); // Add duration to the updated date

            // Debug log to check due dates
            //console.log("Due Date: ", dueDate);

            // Check for Payment Reminders (3 days before due date)



            const threeDaysFromNow = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);

            console.log(dueDate > currentDate);
            if (dueDate > currentDate) {
                //console.log("1st if");
                notifications.push({
                    type: 'payment_reminder',
                    lender_name: lender.name,
                    lender_amount: lending.amount,
                    message: `Reminder: You have a payment of $${lending.amount} to ${lender.name} on ${dueDate.toISOString().split('T')[0]}.`,
                    date: currentDate.toISOString().split('T')[0],
                });
            }

            // Check for Overdue Alerts
            if (dueDate < currentDate) {
                //console.log("2nd if");
                notifications.push({
                    type: 'overdue_alert',
                    lender_name: lender.name,
                    lender_amount: lending.amount,
                    message: `Alert: You have an overdue payment of $${lending.amount} to ${lender.name} since ${dueDate.toISOString().split('T')[0]}.`,
                    date: currentDate.toISOString().split('T')[0],
                });
            }
        }

        // Debug log to check notifications before sending response
        console.log("Notifications: ", notifications);

        // Step 3: Send the notifications as a response
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: error.message });
    }
};
