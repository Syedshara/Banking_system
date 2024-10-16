import { Button, Card } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import bcryptjs from 'bcryptjs';

const Main = () => {
    // State to manage borrowers and lenders
    const [borrowers, setBorrowers] = useState([]);
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            fetch(`http://10.16.58.118:3000/users/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setPin(data.bank_details.pin);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setError("Failed to fetch user data.");
                    setLoading(false);
                });
        }
    }, []);

    const [user_pin, setPin] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);


    const [lenders, setLenders] = useState([]);


    // State to manage which box is currently visible
    const [activeTab, setActiveTab] = useState('borrowers');

    // Fetch borrower data from the backend API
    useEffect(() => {
        const fetchBorrowers = async () => {
            const userId = localStorage.getItem('user_id'); // Get user_id from local storage
            if (!userId) {
                console.error('User ID not found in local storage.');
                return;
            }

            try {
                const response = await fetch(`http://10.16.58.118:3000/users/lending_requests/${userId}`); // Pass user_id to the API endpoint
                const data = await response.json();

                const formattedBorrowers = data.map((item) => ({
                    id: item.transaction_id, // Use a unique identifier
                    name: item.borrower_name,
                    amount: item.amount,
                    interestRate: item.interest_rate,
                    lending_id: item.lending_id,
                    borrower_id: item.borrower_id,
                    duration: item.duration, // assuming duration is part of the response
                }));
                setBorrowers(formattedBorrowers);
            } catch (error) {
                console.error('Error fetching borrowers:', error);
            }
        };

        fetchBorrowers();
    }, []); // Empty dependency array ensures this runs only once on component mount

    // Fetch lender data from the backend API
    useEffect(() => {
        const fetchLenders = async () => {
            const userId = localStorage.getItem('user_id'); // Get user_id from local storage
            if (!userId) {
                console.error('User ID not found in local storage.');
                return;
            }

            try {
                const response = await fetch(`http://10.16.58.118:3000/borrow/requested_transactions/${userId}`); // Pass user_id to the API endpoint
                const data = await response.json();


                const formattedLenders = data.map((transaction) => ({
                    id: transaction.transactionId, // Use transaction ID as the identifier
                    lenderName: transaction.lenderName,
                    lenderID: transaction.lenderID,
                    lendingId: transaction.lending_id, // Lender's lending ID
                    amount: transaction.amount, // Requested amount
                    interestRate: transaction.interestRate,
                    duration: transaction.duration, // Duration of the loan
                    // Max interest rate
                }));
                setLenders(formattedLenders);
            } catch (error) {
                console.error('Error fetching lenders:', error);
            }
        };

        fetchLenders();
    }, []); // Empty dependency array ensures this runs only once on component mount

    // Handle accept or decline request function
    const handleAcceptRequest = async (request, actionType) => {

        const pin = await promptForPin();
        if (!pin) {
            showMessageCard('PIN entry cancelled.');
            return;
        }





        console.log(request);
        const payload = {
            transaction_id: request.id,
            action: actionType,
            pin: pin,
            borrower_id: request.borrower_id,
            lending_id: request.lending_id,

        };

        try {
            const response = await fetch('http://10.16.58.118:3000/users/lending_status', { // Replace with actual backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (response.ok) {
                showMessageCard(`Request ${actionType}ed for ${request.name}`);
                setBorrowers((prevLenders) => prevLenders.filter((item) => item.id !== request.id));
                alert(`Request ${actionType}ed for ${request.lenderName || request.name}`);
            } else {
                console.error('Error processing request:', result);
                showMessageCard('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessageCard('Something went wrong. Please try again.');
        }
    };
    const handleWithdraw = async (lender) => {
        const userId = localStorage.getItem("user_id");
        console.log(lender);

        try {
            const response = await fetch(`http://10.16.58.118:3000/borrow/withdraw`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ borrower_id: userId, transactionId: lender.id, lending_id: lender.lendingId }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setLenders((prevLenders) => prevLenders.filter((item) => item.id !== lender.id));
                // Handle success (e.g., show notification)
            } else {
                console.error(data.message); // Handle error
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Example of usage: handleWithdraw('670e6234bcfe2a58e7c8cdef', 'user_id_here');

    const promptForPin = () => {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '999';

            const pinContainer = document.createElement('div');
            pinContainer.className = 'w-full max-w-sm flex flex-col justify-center';
            pinContainer.style.position = 'fixed';
            pinContainer.style.top = '50%';
            pinContainer.style.left = '50%';
            pinContainer.style.transform = 'translate(-50%, -50%)';
            pinContainer.style.padding = '20px';
            pinContainer.style.backgroundColor = 'white';
            pinContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            pinContainer.style.zIndex = '1000';
            pinContainer.style.borderRadius = '10px';

            const label = document.createElement('label');
            label.className = 'text-slate-100 text-md font-semibold';
            label.innerText = 'Your PIN:';
            label.style.color = '#333';
            label.style.fontFamily = 'Arial, sans-serif';
            label.style.opacity = '2';
            label.style.fontSize = '18px';
            label.style.fontFamily = 'Arial, sans-serif';
            pinContainer.appendChild(label);

            const pinInputs = [];
            const pinValues = Array(6).fill('');
            const handlePinChange = (index, value) => {
                pinValues[index] = value;
                if (value && index < 5) {
                    pinInputs[index + 1].focus();
                }
            };

            const handlePinKeyDown = (index, e) => {
                if (e.key === 'Backspace' && !pinValues[index] && index > 0) {
                    pinInputs[index - 1].focus();
                } else if (e.key === 'Enter') {
                    submitButton.click();
                } else if (e.key === 'Escape') {
                    document.body.removeChild(overlay);
                    document.body.removeChild(pinContainer);
                    resolve(null);
                }
            };

            const pinInputContainer = document.createElement('div');
            pinInputContainer.className = 'flex space-x-2';
            for (let i = 0; i < 6; i++) {
                const input = document.createElement('input');
                input.type = 'password';
                input.maxLength = 1;
                input.className = 'w-10 text-center';
                input.style.borderRadius = '5px';
                input.addEventListener('input', (e) => handlePinChange(i, e.target.value));
                input.addEventListener('keydown', (e) => handlePinKeyDown(i, e));
                pinInputContainer.appendChild(input);
                pinInputs.push(input);
            }
            pinContainer.appendChild(pinInputContainer);

            const submitButton = document.createElement('button');
            submitButton.innerText = 'Submit';
            submitButton.style.marginTop = '20px';
            submitButton.className = 'w-full ml-2';
            submitButton.style.color = 'green';
            pinContainer.appendChild(submitButton);

            document.body.appendChild(overlay);
            document.body.appendChild(pinContainer);

            submitButton.addEventListener('click', () => {
                const rpin = pinValues.join('');
                document.body.removeChild(overlay);
                document.body.removeChild(pinContainer);
                // Compare the entered PIN with the hashed user PIN
                const isMatch = bcryptjs.compareSync(rpin, user_pin);
                if (!isMatch) {
                    showMessageCard("Invalid PIN");
                    resolve(null); // Resolve with null if the PIN is invalid
                } else {
                    resolve(rpin); // Resolve with the valid PIN
                }
            });

            pinInputs[0].focus();
        });
    };

    const showMessageCard = (message) => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';

        const messageCard = document.createElement('div');
        messageCard.style.position = 'fixed';
        messageCard.style.top = '50%';
        messageCard.style.left = '50%';
        messageCard.style.transform = 'translate(-50%, -50%)';
        messageCard.style.padding = '20px';
        messageCard.style.backgroundColor = 'white';
        messageCard.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        messageCard.style.zIndex = '1000';
        messageCard.style.borderRadius = '10px'; // Added border radius
        messageCard.innerText = message;

        document.body.appendChild(overlay);
        document.body.appendChild(messageCard);

        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.removeChild(messageCard);
        }, 3000);
    };

    return (
        <div className="p-5 w-full mt-5 mb-5 max-w-7xl ml-10 pt-10">
            {/* Tabs for Borrower and Lender */}
            <div className="flex justify-between mb-5">
                <Button onClick={() => setActiveTab('borrowers')} color={activeTab === 'borrowers' ? 'cyan' : 'gray'}>
                    Inboxes
                </Button>
                <Button onClick={() => setActiveTab('lenders')} color={activeTab === 'lenders' ? 'cyan' : 'gray'}>
                    Requests
                </Button>
            </div>

            {/* Display Requests Section */}
            <div className="grid p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-y-auto h-[700px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {activeTab === 'borrowers' ? (
                    borrowers.length === 0 ? (
                        <p>No borrower requests available.</p>
                    ) : (
                        borrowers.map((borrower) => (
                            <Card key={borrower.id} className="shadow-lg py-5 pt-5 h-80">
                                {/* Borrower Name */}
                                <div className="flex items-center gap-3 mb-3">
                                    <p className="text-lg text-nowrap font-semibold">Borrower Name:</p>
                                    <p className="text-md">{borrower.name}</p>
                                </div>

                                {/* Amount */}
                                <div className="flex items-center gap-6 mb-3">
                                    <p className="text-lg font-semibold">Amount:</p>
                                    <p className="text-md">₹{borrower.amount}</p>
                                </div>

                                {/* Interest Rate */}
                                <div className="flex items-center gap-6 mb-3">
                                    <p className="text-lg font-semibold">Interest Rate:</p>
                                    <p className="text-md">{borrower.interestRate}%</p>
                                </div>
                                <div className="flex items-center gap-6 mb-3">
                                    <p className="text-lg font-semibold">Duration :</p>
                                    <p className="text-md">{borrower.duration} months</p>
                                </div>

                                {/* Accept and Decline Buttons */}
                                <div className="flex justify-between">
                                    <Button color="green" onClick={() => handleAcceptRequest(borrower, 'accepted')}>
                                        Accept
                                    </Button>
                                    <Button color="red" onClick={() => handleAcceptRequest(borrower, 'rejected')}>
                                        Decline
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )
                ) : (
                    lenders.length === 0 ? (
                        <p>No lender requests available.</p>
                    ) : (
                        lenders.map((lender) => (
                            <Card key={lender.id} className="p-4 shadow-lg pt-5 h-80">
                                {/* Lender Name */}
                                <div className="flex items-center gap-3 mb-3">
                                    <p className="text-lg font-semibold">Lender Name:</p>
                                    <p className="text-md">{lender.lenderName}</p>
                                </div>

                                {/* Amount */}
                                <div className="flex items-center gap-6 mb-3">
                                    <p className="text-lg font-semibold">Amount:</p>
                                    <p className="text-md">₹{lender.amount}</p>
                                </div>

                                {/* Interest Rate */}
                                <div className="flex items-center gap-6 mb-3">
                                    <p className="text-lg font-semibold">Interest Rate:</p>
                                    <p className="text-md">{lender.interestRate}%</p>
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                    <p className="text-lg font-semibold">Duration :</p>
                                    <p className="text-md">{lender.duration} months</p>
                                </div>


                                {/* Withdraw Button */}
                                <Button color="red" onClick={() => handleWithdraw(lender)}>
                                    Withdraw Request
                                </Button>
                            </Card>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default Main;