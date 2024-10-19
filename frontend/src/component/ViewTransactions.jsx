import React, { useEffect, useState } from 'react';
import { Card, Table, Dropdown } from 'flowbite-react';
import { io } from 'socket.io-client';


const ViewTransactions = () => {
    useEffect(() => {
        const socket = io.connect('http://localhost:3000'); // Adjust the URL as needed

        socket.on('connect', () => {
            console.log('Socket connected'); // Log when connected
        });

        // Listen for notifications
        socket.on('history', (history) => {
            console.log('New history received:', history); // Log incoming notifications
            fetchTransactions();
        });

        return () => {
            socket.disconnect(); // Clean up on component unmount
        };
    }, []);

    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('All');
    const fetchTransactions = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`http://localhost:3000/users/transaction_history/${userId}`);
            const data = await response.json();
            let filteredData = data.filter(transaction => transaction.status !== 'requested');
            if (filter !== 'All') {
                if (filter == "paid") {
                    filteredData = filteredData.filter(transaction => transaction.role === "lender");
                }
                else {
                    filteredData = filteredData.filter(transaction => transaction.role === "borrower");
                }

            }

            setTransactions(filteredData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {


        fetchTransactions();
    }, [filter]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-xl">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold">View Transaction History</h2>

                <Dropdown
                    label="Filters"
                    inline={true}
                    className="shadow- p-2 rounded"
                    onSelect={(value) => setFilter(value)}
                >
                    <Dropdown.Item onClick={() => setFilter('All')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('paid')}>Paid</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('recieved')}>Received</Dropdown.Item>

                </Dropdown>
            </div>

            <Card className="w-full max-w-3xl mx-auto max-h-[650px]  scrollbar-hide overflow-y-auto">
                <Table className="text-left text-gray-700">
                    <Table.Head>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Sender/Receiver</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <Table.Row key={transaction.id || index} className="bg-white hover:bg-gray-100">
                                    <Table.Cell>{formatDate(transaction.date)}</Table.Cell>
                                    <Table.Cell>{transaction.name}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            className={`font-semibold ${transaction.role === 'borrower'
                                                ? 'text-green-600'
                                                : 'text-red-600'}`}
                                        >
                                            ₹{transaction.amount}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span

                                        >
                                            {transaction.role == "borrower" ? "Received" : "Paid"}
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan="4" className="text-center">
                                    No transactions found.
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Card>
        </div >
    );
};

export default ViewTransactions;