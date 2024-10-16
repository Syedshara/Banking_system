import mongoose from 'mongoose';

const lendingSchema = new mongoose.Schema({
    user_id: {
        type: String, // Reference to the User model
        required: true,
        ref: 'User' // Ensure it refers to the User collection
    },
    amount: {
        type: Number,
        required: true,
    },
    max_interest: {
        type: Number,
        required: true,
        min: 0, // Ensure interest is non-negative
    },
    min_interest: {
        type: Number,
        required: true,
        min: 0, // Ensure interest is non-negative
    },
    duration: {
        type: Number,
        required: true,
        min: 1, // Ensure duration is at least 1 month
    },
    requests: [{ borrower_id: mongoose.Schema.Types.ObjectId, status: { type: String, default: 'pending' } }]
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const Lending = mongoose.model('Lending', lendingSchema);

export default Lending;

