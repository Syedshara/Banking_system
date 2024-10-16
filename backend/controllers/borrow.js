import Lending from "../models/lending.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js"

export const getLenders = async (req, res) => {
    try {
        const { money, interest, duration } = req.body;

        if (!money) {
            return res.status(400).json({ message: "Money is required." });
        }

        const minAmount = money * 0.9;
        const maxAmount = money * 1.1;

        const query = {
            amount: { $gte: minAmount, $lte: maxAmount }
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

        // Fetch user details for each lender
        const formattedLenders = await Promise.all(
            lenders.map(async (lender) => {
                const user = await User.findById(lender.user_id).select('name');
                return {
                    lending_id: lender._id,
                    lender_id: lender.user_id,
                    amount: lender.amount,
                    interest_range: `${lender.min_interest}-${lender.max_interest}%`,
                    duration: lender.duration,
                    user_name: user ? user.name : 'Balan'
                };
            })
        );

        res.status(200).json(formattedLenders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addRequest = async (req, res) => {
    try{

        const {lending_id,lender_id, borrower_id, amount} = req.body;
        const transaction = new Transaction({lending_id,lender_id, borrower_id, amount, transaction_status:"requested"});
        await transaction.save();
        res.status(201).json(transaction);

    }catch(error){
        res.status(500).json({ message: error.message });

    }
}

export const getRequestedTransactions = async (req, res) => {
    try {
        const { id } = req.params; // Get borrower ID from request parameters

        // Step 1: Fetch transactions for the borrower with status "requested"
        const transactions = await Transaction.find({ borrower_id: id, transaction_status: "requested" });
        
        // Debug log to check fetched transactions
        console.log("Fetched Transactions: ", transactions);

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
                        lenderName: lender.name, // Get the lender's name
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
        const {id} = req.params;
        //console.log(id);
        // Remove the transaction from the Transaction collection
        const result = await Transaction.findByIdAndDelete(id);

        // Check if the transaction was found and deleted
        if (!result) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Transaction withdrawn successfully' });
    } catch (error) {
        console.error("Error withdrawing transaction:", error);
        res.status(500).json({ message: error.message });
    }
    }