import Lending from '../models/lending.js';

// Create a new lending
export const createLending = async (req, res) => {
    try {
        const lending = new Lending(req.body);
        await lending.save();
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
