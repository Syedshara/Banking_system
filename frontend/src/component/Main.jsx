import { Button, Card } from 'flowbite-react';
import React, { useState } from 'react';

const Main = () => {
    // Dummy data for borrowers and lenders with unique IDs
    const [borrowers, setBorrowers] = useState([
        {
            id: 1,
            name: 'John Doe',
            amount: 5000,
            interestRate: 5,
        },
        {
            id: 2,
            name: 'Jane Smith',
            amount: 8000,
            interestRate: 6,
        },
        {
            id: 3,
            name: 'Alice Johnson',
            amount: 12000,
            interestRate: 4.5,
        },
        {
            id: 4,
            name: 'Charlie Green',
            amount: 15000,
            interestRate: 7,
        },
    ]);

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

    // Handle accept request function
    const handleAcceptRequest = (request, type) => {
        console.log(`${type} request accepted:`, request);
        alert(`Accepted request from ${request.name}`);
    };

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-7xl pt-10">
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
                            <Card key={borrower.id} className="p-4 shadow-lg pt-10 h-80">
                                {/* Borrower Name */}
                                <div className="mb-3">
                                    <p className="text-lg font-semibold">Borrower Name:</p>
                                    <p className="text-md">{borrower.name}</p>
                                </div>

                                {/* Amount */}
                                <div className="mb-3">
                                    <p className="text-lg font-semibold">Amount:</p>
                                    <p className="text-md">₹{borrower.amount}</p>
                                </div>

                                {/* Interest Rate */}
                                <div className="">
                                    <p className="text-lg font-semibold">Interest Rate:</p>
                                    <p className="text-md">{borrower.interestRate}%</p>
                                </div>

                                {/* Accept Request Button */}
                                <div className="flex justify-between">
                                    <Button color="green" onClick={() => handleAcceptRequest(borrower, 'Borrower')}>
                                        Accept
                                    </Button>
                                    <Button color="red" onClick={() => handleAcceptRequest(borrower, 'Borrower')}>
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

                                {/* Accept Request Button */}

                                <Button color="red" onClick={() => handleAcceptRequest(lender, 'Lender')}>
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