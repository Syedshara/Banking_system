import React, { useState, useRef } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';

const ViewBalance = () => {
    const [accountType, setAccountType] = useState(''); // To hold the account/card selection
    const [pin, setPin] = useState(Array(6).fill('')); // For 6-digit pin entry
    const [currentScreen, setCurrentScreen] = useState(1); // For screen control
    const [balance, setBalance] = useState(null); // To store the balance value

    // To reference each input field for auto-focus
    const pinRefs = useRef([]);

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        setCurrentScreen(2); // Move to PIN entry screen
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
            // Simulating balance fetching based on account type
            if (accountType === 'Account') {
                setBalance('₹50,000');
            } else if (accountType === 'Card') {
                setBalance('₹30,000');
            }
            setCurrentScreen(3); // Move to the balance display screen
        } else {
            alert('Please enter a valid 6-digit PIN.');
        }
    };

    const handleBack = () => {
        if (currentScreen === 2) {
            setCurrentScreen(1); // Go back to account selection
        } else if (currentScreen === 3) {
            setCurrentScreen(2); // Go back to PIN entry
        }
    };

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-3xl bg-slate-200">
            <h2 className="text-2xl text-center font-bold mb-4">View Balance</h2>

            {/* Account/Card Selection Screen */}
            {currentScreen === 1 && (
                <Card className="w-full max-w-2xl mx-auto">
                    <form onSubmit={handleAccountSubmit}>
                        <div className="mb-4">
                            <Label htmlFor="accountType" value="Choose Account or Card" />
                            <select
                                id="accountType"
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                className="w-full p-2 mt-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="Account">Account</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            className="mt-8 mx-auto w-48 font-semibold"
                            size="xl"
                            gradientDuoTone="greenToBlue"
                        >
                            Next
                        </Button>
                    </form>
                </Card>
            )}

            {/* PIN Entry Screen */}
            {currentScreen === 2 && (
                <div className="mt-5">
                    <Card>
                        <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-3">
                            <Label htmlFor="pin" value="Enter 6-Digit PIN" className="mx-auto self-center" />
                            <div className="flex gap-2 justify-center my-4">
                                {pin.map((value, index) => (
                                    <TextInput
                                        key={index}
                                        id="pin"
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

                            <div className="flex justify-between w-full max-w-xs">
                                <Button
                                    type="button"
                                    className="mx-auto mt-2 font-bold"
                                    gradientDuoTone="redToYellow"
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="mx-auto mt-2 font-bold"
                                    gradientDuoTone="greenToBlue"
                                >
                                    Confirm
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Balance Display Screen */}
            {currentScreen === 3 && balance && (
                <div className="mt-5">
                    <Card className="text-center">
                        <h3 className="text-xl font-semibold mb-3">Available Balance</h3>
                        <p className="text-2xl text-green-600 font-bold">{balance}</p>
                        <Button
                            type="button"
                            className="mx-auto mt-6 font-bold"
                            gradientDuoTone="redToYellow"
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ViewBalance;