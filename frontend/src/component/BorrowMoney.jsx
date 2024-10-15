import React, { useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';

const BorrowMoney = () => {
    const [money, setMoney] = useState('');
    const [duration, setDuration] = useState('');
    const [interestRate, setInterestRate] = useState('');

    const handleRequestSubmit = (e) => {
        e.preventDefault();

        // Check if money field is not empty
        if (!money) {
            alert('Money field is required.');
            return;
        }

        // Reset the form fields after submission
        setMoney('');
        setDuration('');
        setInterestRate('');
    };

    const lendingData = [
        { name: 'John Doe', amount: '1000', interestRange: '5-10%', duration: '30 days' },
        { name: 'Jane Smith', amount: '1500', interestRange: '4-9%', duration: '45 days' },
        { name: 'Alex Johnson', amount: '2000', interestRange: '3-8%', duration: '60 days' },
        { name: 'Emily Davis', amount: '2500', interestRange: '6-12%', duration: '90 days' },
        { name: 'Michael Brown', amount: '3000', interestRange: '5-11%', duration: '120 days' },
        { name: 'Sarah Wilson', amount: '500', interestRange: '2-6%', duration: '15 days' },
        { name: 'David Lee', amount: '1800', interestRange: '4-10%', duration: '75 days' },
        { name: 'Chris Evans', amount: '2200', interestRange: '5-9%', duration: '100 days' },
    ];

    return (
        <div className="w-full mx-auto mb-14 max-w-5xl px-20 pb-20 pt-5">
            <div className="flex h-full flex-col w-full gap-5">
                {/* Card Section (1/3) */}
                <Card className="w-full">
                    <form onSubmit={handleRequestSubmit} className="flex flex-wrap">
                        {/* Column 1: Money and Duration */}
                        <div className="w-1/2 pr-2">
                            {/* Money */}
                            <div className="mb-4 mx-4">
                                <Label htmlFor="money" value="Money" />
                                <TextInput
                                    id="money"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={money}
                                    onChange={(e) => setMoney(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Duration */}
                            <div className="mb-4 mx-4">
                                <Label htmlFor="duration" value="Duration (in days, optional)" />
                                <TextInput
                                    id="duration"
                                    type="number"
                                    placeholder="Enter duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Column 2: Interest Rate and Button */}
                        <div className="w-1/2 pl-2">
                            {/* Interest Rate */}
                            <div className="mb-4 mx-4">
                                <Label htmlFor="interestRate" value="Interest Rate (%) (optional)" />
                                <TextInput
                                    id="interestRate"
                                    type="number"
                                    placeholder="Enter interest rate"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-8 mx-auto w-48 font-semibold py-auto"
                                size="xl"
                                gradientDuoTone="greenToBlue"
                            >
                                Request
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Background Section (2/3) */}
                <div className="w-full h-96 overflow-y-auto mx-2  flex flex-col gap-2">
                    {/* Ensure cards are visible */}
                    {lendingData.map((data, index) => (
                        <Card key={index} className="max-h-28 flex py-2">
                            <div className="flex w-full justify-between px-4 py-2">
                                <div>
                                    <p><strong>Name:</strong> {data.name}</p>
                                    <p><strong>Amount:</strong> ${data.amount}</p>
                                    <p><strong>Interest Range:</strong> {data.interestRange}</p>
                                    <p><strong>Duration:</strong> {data.duration}</p>
                                </div>
                                <div className="flex items-center">
                                    <Button color="light">
                                        Request
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BorrowMoney;