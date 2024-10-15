import User from '../models/user.js'; // Import the User model
import bcryptjs from 'bcryptjs';

export const createUser = async (req, res) => {
    const { name, email, acc_number, pin, IFSC, upi_id } = req.body;

    // Check if required fields are provided
    if (!name || !email || !acc_number || name.trim() === '' || email.trim() === '' || acc_number.trim() === '') {
        return res.status(400).json({ error: 'Fill all the fields.' });
    }

    // Hash the pin
    const hashedPin = bcryptjs.hashSync(pin, 10);

    // Generate a random balance between 1000 and 10000
    const balance = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

    // Create a new user object using the Mongoose model
    const newUser = new User({
        name,
        email,
        bank_details: {
            acc_number, // Account number provided
            pin: hashedPin, // Use hashed pin
            IFSC, // Provide IFSC
            upi_id, // Provide UPI ID
            balance // Assign the randomly generated balance
        },
    });

    try {
        const result = await newUser.save(); // Save user using Mongoose
        res.status(201).json({ message: 'User created successfully', userId: result._id });
    } catch (err) {
        // Send a response with an error status
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