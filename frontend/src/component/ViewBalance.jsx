import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';

const ViewBalance = () => {
    const [pin, setPin] = useState(Array(6).fill(''));
    const [currentScreen, setCurrentScreen] = useState(1);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const pinRefs = useRef([]);

    const handlePinChange = (e, index) => {
        const newPin = [...pin];
        const { value } = e.target;

        if (/^[0-9]?$/.test(value)) {
            newPin[index] = value;
            setPin(newPin);

            if (value && index < 5) {
                pinRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
            pinRefs.current[index - 1].focus();
        }
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pin.join('').length === 6) {
            setBalance(balance);
            setCurrentScreen(3);
        } else {
            alert('Please enter a valid 6-digit PIN.');
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            fetch(`http://localhost:3000/users/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setBalance(data.bank_details.balance);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setError("Failed to fetch user data.");
                    setLoading(false);
                });
        }
    }, []);

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-xl">
            <h2 className="text-2xl text-center font-bold mb-4">View Balance</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {currentScreen === 1 && (
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
                                        ref={(el) => (pinRefs.current[index] = el)}
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                className="mx-auto mt-2 font-bold"
                                gradientDuoTone="greenToBlue"
                            >
                                Confirm
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {currentScreen === 3 && balance !== null && (
                <div className="mt-5">
                    <Card className="text-center">
                        <h3 className="text-xl font-semibold mb-3">Available Balance</h3>
                        <p className="text-2xl text-green-600 font-bold">
                            {"₹" + balance.toLocaleString()}
                        </p>
                        <Button
                            type="button"
                            className="mx-auto mt-6 font-bold"
                            gradientDuoTone="greenToBlue"
                            onClick={() => setCurrentScreen(1)}
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
