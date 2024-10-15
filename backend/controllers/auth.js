import User from '../models/user.js';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID package

export const createUser = async (req, res) => {
    const { name, email, acc_number, pin, IFSC, upi_id, phone } = req.body;

    // Validate required fields
    if (!name || !email || !acc_number || !phone || !upi_id || name.trim() === '' || email.trim() === '' || acc_number.trim() === '' || phone.trim() === '' || upi_id.trim() === '') {
        return res.status(400).json({ error: 'Fill all the fields.' });
    }

    try {
        // Check if user already exists with email, phone, or UPI ID
        const existingUser = await User.findOne({ $or: [{ email }, { phone }, { upi_id }] });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists with this email, phone number, or UPI ID.' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to check existing user', details: err.message });
    }

    // Hash the PIN and generate a random balance
    const hashedPin = bcryptjs.hashSync(pin, 10);
    const balance = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

    // Generate a unique user_id
    const user_id = uuidv4();

    try {
        // Create a new user object with generated user_id and hashed PIN
        const newUser = new User({
            user_id, // Store the generated user_id
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

        // Save the new user to the database
        const result = await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: result._id, user_id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
};

export const getUsers = async (req, res) => {
    const { upi_id, pin } = req.body;

    // Check if required fields are provided
    if (!upi_id || !pin || upi_id.trim() === '' || pin.trim() === '') {
        return res.status(400).json({ error: 'Please provide UPI ID and PIN.' });
    }

    try {
        // Find user by UPI ID
        const user = await User.findOne({ "bank_details.upi_id": upi_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found with this UPI ID.' });
        }

        // Compare the provided PIN with the hashed PIN stored in the database
        const isMatch = bcryptjs.compareSync(pin, user.bank_details.pin);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid PIN.' });
        }

        // If everything is valid, return success response
        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to login', details: err.message });
    }
};