import React, { useState } from 'react';
import { Button, Card, Label, TextInput, Radio } from 'flowbite-react';

const TransferMoney = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [receiverDetails, setReceiverDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState(Array(6).fill('')); // For 6-digit pin entry
    const [currentScreen, setCurrentScreen] = useState(1); // For screen control
    const [successMessage, setSuccessMessage] = useState('');

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setCurrentScreen(2); // Move to next screen after submitting payment details
    };

    const handlePinChange = (e, index) => {
        const newPin = [...pin];
        newPin[index] = e.target.value;
        setPin(newPin);
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pin.join('').length === 6) {
            setSuccessMessage('Transaction successful!');
            // Reset form or perform further actions as needed
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
                            <div className="flex gap-2">
                                <Radio
                                    id="upi"
                                    name="paymentMethod"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={() => setPaymentMethod('UPI')}
                                />
                                <Label htmlFor="upi">UPI ID</Label>

                                <Radio
                                    id="account"
                                    name="paymentMethod"
                                    value="Account"
                                    checked={paymentMethod === 'Account'}
                                    onChange={() => setPaymentMethod('Account')}
                                />
                                <Label htmlFor="account">Account</Label>

                                <Radio
                                    id="card"
                                    name="paymentMethod"
                                    value="Card"
                                    checked={paymentMethod === 'Card'}
                                    onChange={() => setPaymentMethod('Card')}
                                />
                                <Label htmlFor="card">Card</Label>
                            </div>
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
                                        required
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