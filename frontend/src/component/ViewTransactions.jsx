import React, { useEffect, useState } from 'react';
import { Card, Table, Dropdown } from 'flowbite-react';

const ViewTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('All'); // Default filter

    useEffect(() => {
        // Example API call based on selected filter
        const fetchTransactions = async () => {
            try {
                // Replace with real `port_id` and `user_id`
                // const response = await fetch(`http://port_id/lend/user/${user_id}?filter=${filter}`);
                // const data = await response.json();

                // For testing, using static data
                const data = [
                    { id: 1, date: '2024-10-14', senderReceiver: 'John Doe', amount: '500', type: 'Lender', status: 'Paid' },
                    { id: 2, date: '2024-10-13', senderReceiver: 'Jane Doe', amount: '1000', type: 'Borrower', status: 'Pending' },
                    { id: 3, date: '2024-10-12', senderReceiver: 'Mark Smith', amount: '150', type: 'Lender', status: 'Overdue' },
                ];

                if (filter !== 'All') {
                    const filteredData = data.filter(transaction => transaction.status === filter);
                    setTransactions(filteredData);
                } else {
                    setTransactions(data);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [filter]); // Fetch transactions whenever the filter changes

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-4xl">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold">View Transaction History</h2>

                <Dropdown
                    label="Filters"
                    inline={true}
                    className="shadow- p-2 rounded"
                    onSelect={(value) => setFilter(value)}
                >
                    <Dropdown.Item onClick={() => setFilter('All')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Paid')}>Paid</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('Overdue')}>Overdue</Dropdown.Item>
                </Dropdown>
            </div>

            <Card className="w-full max-w-3xl mx-auto">
                <Table className="text-left text-gray-700">
                    <Table.Head>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Sender/Receiver</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
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
                                <Table.Cell><span
                                    className={` ${transaction.status === 'Overdue'
                                        ? 'text-yellow-300 font-semibold'
                                        : 'font-normal'
                                        }`}
                                >
                                    {transaction.status}
                                </span></Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Card>
        </div>
    );
};

export default ViewTransactions;
