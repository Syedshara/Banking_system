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

        const {lender_id, borrower_id, amount} = req.body;
        const transaction = new Transaction({lender_id, borrower_id, amount, transaction_status:"requested"});
        await transaction.save();
        res.status(201).json(transaction);

    }catch(error){
        res.status(500).json({ message: error.message });

    }
}