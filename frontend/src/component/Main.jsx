import { Button, Card } from 'flowbite-react';
import React, { useEffect, useState } from 'react';

const Main = () => {
    // State to manage borrowers and lenders
    const [borrowers, setBorrowers] = useState([]);
    const [lenders, setLenders] = useState([
        {
            id: 5,
            name: 'Bob Brown',
            amount: 7000,
            interestRate: 5.2,
        },
        {
            id: 6,
            name: 'David Black',
            amount: 9000,
            interestRate: 6.5,
        },
        {
            id: 7,
            name: 'Emily White',
            amount: 11000,
            interestRate: 4.8,
        },
        {
            id: 8,
            name: 'Frank Blue',
            amount: 13000,
            interestRate: 7.5,
        },
    ]);

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
                    duration: item.duration, // assuming duration is part of the response
                }));
                setBorrowers(formattedBorrowers);
            } catch (error) {
                console.error('Error fetching borrowers:', error);
            }
        };

        fetchBorrowers();
    }, []); // Empty dependency array ensures this runs only once on component mount

    // Handle accept or decline request function
    const handleAcceptRequest = async (request, actionType) => {
        const payload = {
            transaction_id: request.id,
            action: actionType,
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
                alert(`Request ${actionType}ed for ${request.name}`);
            } else {
                console.error('Error processing request:', result);
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                            <Card key={lender.id} className="p-4 shadow-lg pt-10 h-80">
                                {/* Lender Name */}
                                <div className="mb-3">
                                    <p className="text-lg font-semibold">Lender Name:</p>
                                    <p className="text-md">{lender.name}</p>
                                </div>

                                {/* Amount */}
                                <div className="mb-3">
                                    <p className="text-lg font-semibold">Amount:</p>
                                    <p className="text-md">₹{lender.amount}</p>
                                </div>

                                {/* Interest Rate */}
                                <div className="">
                                    <p className="text-lg font-semibold">Interest Rate:</p>
                                    <p className="text-md">{lender.interestRate}%</p>
                                </div>

                                {/* Withdraw Button */}
                                <Button color="red" onClick={() => handleAcceptRequest(lender, 'withdraw')}>
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