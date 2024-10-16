
import User from '../models/user.js'; // Adjust the import path as necessary
import Lending from '../models/lending.js'; // Adjust the import path as necessary
export const createLending = async (req, res) => {
    try {
        // Destructure user_id and amount from req.body
        const { user_id, amount, max_interest, min_interest, duration } = req.body;

        // Fetch the user to get their balance
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the lending amount is less than or equal to the user's balance
        if (amount > user.bank_details.balance) {
            return res.status(400).json({ error: 'Insufficient balance for this lending' });
        }

        // Create the lending object with all required fields
        const lending = new Lending({
            user_id,
            amount,
            max_interest,
            min_interest,
            duration,
        });

        // Save the lending record
        await lending.save();

        // Optionally update user's balance (if you want to reduce it)
        user.bank_details.balance -= amount;
        await user.save();

        // Respond with the created lending record
        res.status(201).json(lending);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a lending
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

// Update an existing lending
export const updateLending = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLending = await Lending.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLending) {
            return res.status(404).json({ message: 'Lending not found' });
        }
        res.status(200).json(updatedLending);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all lendings for a specific user
export const getUserLendings = async (req, res) => {
    try {
        const { userId } = req.params;
        const test = {user_id:"670e2ae6a5ea1ce5617c0bc9"};
        const lendings = await Lending.find(test);
        res.status(200).json(lendings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
