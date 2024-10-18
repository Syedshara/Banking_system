import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({

    lender_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: 'User' // Ensure it refers to the User collection
    },
    borrower_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: 'User' // Ensure it refers to the User collection
    },
    amount: {
        type: Number,
        required: true,
    },
    pay_method: {
        type: String,
        required: true,
    },
    interest_rate: {
        type: Number,
        required: true,
        min: 0, // Ensure interest is non-negative
    },
}, { timestamps: true });

const History = mongoose.model('history', historySchema);
export default History;