import React, { useEffect, useState } from 'react';
import { Card, Table } from 'flowbite-react';

const ViewTransactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Example API call
        const fetchTransactions = async () => {
            try {
                // Fetch dynamically, replace with real `port_id` and `user_id`
                // const response = await fetch(`http://port_id/lend/user/${user_id}`);
                // const data = await response.json();
                
                // For testing, using static data
                const data = [
                    { id: 1, date: '2024-10-14', senderReceiver: 'John Doe', amount: '500', type: 'Lender' },
                    { id: 2, date: '2024-10-13', senderReceiver: 'Jane Doe', amount: '1000', type: 'Borrower' },
                    { id: 3, date: '2024-10-12', senderReceiver: 'Mark Smith', amount: '150', type: 'Lender' },
                ];

                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-4xl bg-slate-200">
            <h2 className="text-2xl text-center font-bold mb-4">View Transaction History</h2>

            <Card className='w-full max-w-3xl mx-auto'>
                <Table className="text-left text-gray-700">
                    <Table.Head>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Sender/Receiver</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {transactions.map((transaction) => (
                            <Table.Row key={transaction.id} className="bg-white hover:bg-gray-100">
                                <Table.Cell>{transaction.date}</Table.Cell>
                                <Table.Cell>{transaction.senderReceiver}</Table.Cell>
                                <Table.Cell>
                                    <span
                                        className={`font-semibold ${transaction.type === 'Borrower'
                                            ? 'text-green-600' // Green for Borrowers
                                            : 'text-red-600' // Red for Lenders
                                            }`}
                                    >
                                        ₹{transaction.amount}
                                    </span>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Card>
        </div>
    );
};

export default ViewTransactions;
