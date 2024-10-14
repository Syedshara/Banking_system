import React, { useState, useRef } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';

const TransferMoney = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [receiverDetails, setReceiverDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [pin, setPin] = useState(Array(6).fill('')); // For 6-digit pin entry
    const [currentScreen, setCurrentScreen] = useState(1); // For screen control
    const [successMessage, setSuccessMessage] = useState('');

    // To reference each input field for auto-focus
    const pinRefs = useRef([]);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setCurrentScreen(2); // Move to next screen after submitting payment details
    };

    const handlePinChange = (e, index) => {
        const newPin = [...pin];
        const { value, key } = e.target;

        // Allow only numeric inputs
        if (/^[0-9]?$/.test(value)) {
            newPin[index] = value;
            setPin(newPin);

            // Automatically focus on the next input
            if (value && index < 5) {
                pinRefs.current[index + 1].focus();
            }
        }

        // Move back to the previous input when Backspace is pressed in an empty input
        if (key === 'Backspace' && !newPin[index] && index > 0) {
            pinRefs.current[index - 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        const { key } = e;

        // Move back to the previous input when Backspace is pressed in an empty input
        if (key === 'Backspace' && pin[index] === '' && index > 0) {
            pinRefs.current[index - 1].focus();
        }
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pin.join('').length === 6) {
            setSuccessMessage('Transaction successful!');
            setCurrentScreen(3);
        } else {
            alert('Please enter a valid 6-digit PIN.');
        }
    };

    return (
        <div className="p-5 mx-auto mt-5 mb-5 max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Transfer Money</h2>

            {currentScreen === 1 && (
                <Card>
                    <form onSubmit={handlePaymentSubmit}>
                        <div className="mb-4">
                            <Label htmlFor="paymentMethod" value="Choose Payment Method" />
                            <select
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full p-2 mt-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select a method</option>
                                <option value="UPI">UPI ID</option>
                                <option value="Account">Account</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>

                        {/* Receiver Details */}
                        <div className="mb-4">
                            <Label htmlFor="receiverDetails" value="Receiver Details" />
                            <TextInput
                                id="receiverDetails"
                                type="text"
                                placeholder="Enter receiver UPI ID, account, or card number"
                                value={receiverDetails}
                                onChange={(e) => setReceiverDetails(e.target.value)}
                                required
                            />
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <Label htmlFor="amount" value="Amount" />
                            <TextInput
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        {/* Reason for Transaction */}
                        <div className="mb-4">
                            <Label htmlFor="reason" value="Reason for Transaction" />
                            <select
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full p-2 mt-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select a reason</option>
                                <option value="Payment for Services">Payment for Services</option>
                                <option value="Loan Repayment">Loan Repayment</option>
                                <option value="Gift">Gift</option>
                                <option value="Charity">Charity</option>
                                <option value="Rent Payment">Rent Payment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <Button type="submit" gradientDuoTone="greenToBlue">
                            Pay / Send
                        </Button>
                    </form>
                </Card>
            )}

            {currentScreen === 2 && (
                <div className="mt-5">
                    <Card>
                        <form onSubmit={handlePinSubmit}>
                            <Label htmlFor="pin" value="Enter 6-Digit PIN" />
                            <div className="flex gap-2 justify-center my-4">
                                {pin.map((value, index) => (
                                    <TextInput
                                        key={index}
                                        type="password"
                                        maxLength={1}
                                        className="w-12 text-center text-lg"
                                        value={pin[index]}
                                        onChange={(e) => handlePinChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        required
                                        ref={(el) => (pinRefs.current[index] = el)} // Assign ref to each input
                                    />
                                ))}
                            </div>
                            <Button type="submit" gradientDuoTone="greenToBlue">
                                Confirm Transaction
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {currentScreen === 3 && successMessage && (
                <div className="mt-5">
                    <Card className="text-center text-green-600">
                        {successMessage}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TransferMoney;
