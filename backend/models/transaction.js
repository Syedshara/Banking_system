import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    lending_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: 'Lending' // Ensure it refers to the User collection
    },
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
    transaction_status: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction',transactionSchema);
export default Transaction;