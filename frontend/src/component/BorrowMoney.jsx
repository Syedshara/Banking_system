import React, { useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';

const BorrowMoney = () => {
    const [money, setMoney] = useState('');
    const [duration, setDuration] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [lenders, setLenders] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); 

    const handleRequestSubmit = async (e) => {
        e.preventDefault();

        if (!money) {
            alert('Money field is required.');
            return;
        }
        setIsLoading(true);

        try {
            const userId = localStorage.getItem("user_id");
            const response = await fetch('http://10.16.58.118:3000/borrow/getlenders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    money,
                    duration: duration || null, 
                    interest_rate: interestRate || null,
                }),
            });

            const data = await response.json();
            console.log(data);
            setLenders(data);

        } catch (error) {
            console.error('Error fetching lenders:', error);
            alert('Failed to fetch lenders. Please try again.');
        } finally {
            setIsLoading(false); 
        }
    };

    const handleLenderRequest = async (lender) => {
        const userId = localStorage.getItem('user_id'); 
        if (lender.has_requested) {
            alert('You have already requested this lender.');
            return;
        }
        try {
            const response = await fetch('http://10.16.58.118:3000/borrow/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    borrower_id: userId,
                    lending_id: lender.lending_id, 
                    lender_id: lender.lender_id, 
                    amount: lender.amount, 
                    interest_rate: interestRate || lender.min_interest

                }),
            });

            const result = await response.json();
            console.log('Request sent successfully:', result);
            setLenders((prevLenders) =>
                prevLenders.map((l) =>
                    l.lending_id === lender.lending_id ? { ...l, has_requested: true } : l
                )
            );

            alert('Lender selected successfully!');
        } catch (error) {
            console.error('Error sending lender request:', error);
            alert('Failed to select lender. Please try again.');
        }
    };

    return (
        <div className="w-full mx-auto mb-14 max-w-5xl px-20 pb-20 pt-5">
            <div className="flex h-full flex-col w-full gap-5">
                <Card className="w-full">
                    <form onSubmit={handleRequestSubmit} className="flex flex-wrap">
                        <div className="w-1/2 pr-2">
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
                            <div className="mb-4 mx-4">
                                <Label htmlFor="duration" value="Duration (in Months, optional)" />
                                <TextInput
                                    id="duration"
                                    type="number"
                                    placeholder="Enter duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-1/2 pl-2">
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
                                disabled={isLoading}
                            >
                                {isLoading ? 'Requesting...' : 'Request'}
                            </Button>
                        </div>
                    </form>
                </Card>
                <div className="w-full h-96 overflow-y-auto mx-2 flex flex-col gap-2">
                    {lenders.length === 0 ? (
                        <p className="text-center mt-5 text-lg">No lenders available.</p>
                    ) : (
                        lenders.map((lender, index) => (
                            <Card key={index} className="max-h-28 flex py-2">
                                <div className="flex w-full justify-between px-4 py-2">
                                    <div>
                                        <p><strong>Name:</strong> {lender.user_name}</p>
                                        <p><strong>Amount:</strong> ₹{lender.amount}</p>
                                        <p><strong>Interest Range:</strong> {lender.interest_range}</p>
                                        <p><strong>Duration:</strong> {lender.duration} months</p>
                                    </div>
                                    <div className="flex items-center">
                                        <Button
                                            color="light"
                                            onClick={() => handleLenderRequest(lender)}
                                            disabled={lender.has_requested} 
                                        >
                                            {lender.has_requested ? 'Requested' : 'Request'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowMoney;