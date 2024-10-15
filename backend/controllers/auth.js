import User from '../models/user.js'; // Import the User model
import bcryptjs from 'bcryptjs';

export const createUser = async (req, res) => {
    const { name, email, acc_number, pin, IFSC, upi_id, phone } = req.body;

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
        phone,
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
    try {
        const users = await User.find({}); // Use the User model to fetch all users
        res.status(200).json(users); // Send the users list as response
    } catch (err) {
        // Send a response with an error status
        res.status(500).json({ error: 'Failed to retrieve users', details: err.message });
    }
};