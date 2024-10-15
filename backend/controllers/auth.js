import User from '../models/user.js';
import bcryptjs from 'bcryptjs';

export const createUser = async (req, res) => {
    const { name, email, acc_number, pin, IFSC, upi_id, phone } = req.body;

    if (!name || !email || !acc_number || name.trim() === '' || email.trim() === '' || acc_number.trim() === '') {
        return res.status(400).json({ error: 'Fill all the fields.' });
    }

    try {
        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone },
                { "bank_details.acc_number": acc_number },
                { "bank_details.upi_id": upi_id }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email, phone number, account number, or UPI ID.' });
        }

        const hashedPin = bcryptjs.hashSync(pin, 10);
        const balance = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

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
        res.status(201).json({ message: 'User created successfully syed', userId: result._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
};

export const getUsers = async (req, res) => {
    const { upi_id, pin } = req.body;

    if (!upi_id || !pin || upi_id.trim() === '' || pin.trim() === '') {
        return res.status(400).json({ error: 'Please provide UPI ID and PIN.' });
    }

    try {

        const user = await User.findOne({ "bank_details.upi_id": upi_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found with this UPI ID.' });
        }


        const isMatch = bcryptjs.compareSync(pin, user.bank_details.pin);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid PIN.' });
        }

        res.status(200).json({ message: 'Login successful!', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to login', details: err.message });
    }
};