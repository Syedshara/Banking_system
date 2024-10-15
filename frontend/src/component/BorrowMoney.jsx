import React, { useState, useRef } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BorrowMoney = () => {
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
            // Show success message
            toast.success('Transaction successful!');

            setSuccessMessage('Transaction successful!');

            // Reset the form fields and go back to the first step after 3 seconds
            setTimeout(() => {
                setPaymentMethod('');
                setReceiverDetails('');
                setAmount('');
                setReason('');
                setPin(Array(6).fill('')); // Reset PIN array
                setCurrentScreen(1); // Go back to the first step
                setSuccessMessage(''); // Clear success message
            }, 3000); // 3 seconds delay to show success message
        } else {
            alert('Please enter a valid 6-digit PIN.');
        }
    };

    const handleBackButton = () => {
        setPin(Array(6).fill(''));
        setCurrentScreen(1); // Return to payment method screen
    };

    return (
        <div className="p-5 w-full  mx-auto mt-5 mb-5 max-w-3xl bg-slate-200 ">
            <h2 className="text-2xl text-center font-bold mb-4">Transfer Money</h2>

            {currentScreen === 1 && (
                <Card className='w-full max-w-2xl mx-auto'>
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
                            </select>
                        </div>

                        {/* Receiver Details */}
                        <div className="mb-4">
                            <Label htmlFor="receiverDetails" value="Receiver Details" />
                            <TextInput
                                id="receiverDetails"
                                type="text"
                                placeholder="Enter receiver UPI ID or account"
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

                        <Button type="submit" className='mt-14 mx-auto w-48 font-semibold py-auto' size='xl' gradientDuoTone="greenToBlue">
                            Pay
                        </Button>
                    </form>
                </Card>
            )}

            {currentScreen === 2 && (
                <div className="mt-20">
                    <Card>
                        <form onSubmit={handlePinSubmit} className='flex flex-col items-center gap-3 '>
                            <Label htmlFor="pin" value="Enter 6-Digit PIN" className='mx-auto self-center' />
                            <div className="flex gap-2 justify-center my-4">
                                {pin.map((value, index) => (
                                    <TextInput
                                        key={index}
                                        id='pin'
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
                            <Button type="submit" className='mx-auto mt-5 font-bold' gradientDuoTone="greenToBlue">
                                Confirm Transaction
                            </Button>

                            {/* Add back button */}
                            <Button
                                className='mx-auto mt-2'
                                color="light"
                                onClick={handleBackButton}
                            >
                                Back
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

            <ToastContainer />
        </div>
    );
};

export default BorrowMoney;