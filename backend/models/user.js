import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        length: 10,

    },
    bank_details: {
        acc_number: {
            type: String,
            required: true,
            length: 11, // Ensure it's 11 digits
            validate: {
                validator: (v) => /^\d{11}$/.test(v), // Regular expression to ensure 11-digit format
                message: props => `${props.value} is not a valid account number!`
            }
        },
        pin: {
            type: String,
            required: true,
        },
        IFSC: {
            type: String,
            required: true,
        },
        upi_id: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;