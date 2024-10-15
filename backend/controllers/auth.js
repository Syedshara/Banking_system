import User from '../models/user.js';
import bcryptjs from 'bcryptjs';

export const createUser = async (req, res) => {
    const { name, email, acc_number, pin, IFSC, upi_id, phone } = req.body;

    if (!name || !email || !acc_number || !phone || !upi_id || name.trim() === '' || email.trim() === '' || acc_number.trim() === '' || phone.trim() === '' || upi_id.trim() === '') {
        return res.status(400).json({ error: 'Fill all the fields.' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone }, { upi_id }] });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists with this email, phone number, or UPI ID.' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to check existing user', details: err.message });
    }

    const hashedPin = bcryptjs.hashSync(pin, 10);
    const balance = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

    try {
        const newUser = new User({
            name,
            email,
            phone,
            bank_details: {
                acc_number,
                pin: hashedPin,
                IFSC,
                upi_id,
                balance
            },
        });
        const result = await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: result._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve users', details: err.message });
    }
};