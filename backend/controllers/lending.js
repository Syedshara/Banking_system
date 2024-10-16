
import User from '../models/user.js'; 
import Lending from '../models/lending.js'; 
export const createLending = async (req, res) => {
    try {
        const { user_id, amount, max_interest, min_interest, duration } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (amount > user.bank_details.balance) {
            return res.status(400).json({ error: 'Insufficient balance for this lending' });
        }
        const lending = new Lending({
            user_id,
            amount,
            max_interest,
            min_interest,
            duration,

        });

        await lending.save();
        await user.save();

        res.status(201).json(lending);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteLending = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Lending.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Lending not found' });
        }
        res.status(200).json({ message: 'Lending deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateLending = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = {
            ...req.body,
            requests: [] 
        };

        const updatedLending = await Lending.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedLending) {
            return res.status(404).json({ message: 'Lending not found' });
        }

        res.status(200).json(updatedLending);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getUserLendings = async (req, res) => {
    try {
        const { userId } = req.params;
        const test = { user_id: userId };
        const lendings = await Lending.find(test);
        res.status(200).json(lendings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
