import React from 'react';
import { Card, Label, Table } from 'flowbite-react';

const ViewTransactions = () => {
    // Temporary data for display
    const transfers = [
        {
            id: 1,
            paymentMethod: 'UPI',
            receiverDetails: 'receiver@upi',
            amount: '500',
            reason: 'Payment for Services',
            status: 'Success',
            date: '2024-10-14',
        },
        {
            id: 2,
            paymentMethod: 'Account',
            receiverDetails: '1234567890',
            amount: '1000',
            reason: 'Loan Repayment',
            status: 'Pending',
            date: '2024-10-13',
        },
        {
            id: 3,
            paymentMethod: 'UPI',
            receiverDetails: 'another@upi',
            amount: '150',
            reason: 'Gift',
            status: 'Failed',
            date: '2024-10-12',
        },
    ];

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-4xl bg-slate-200 ">
            <h2 className="text-2xl text-center font-bold mb-4">View Transfers</h2>

            <Card className='w-full max-w-3xl mx-auto'>
                <Table className="text-left text-gray-700">
                    <Table.Head>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Payment Method</Table.HeadCell>
                        <Table.HeadCell>Receiver</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Reason</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {transfers.map((transfer) => (
                            <Table.Row key={transfer.id} className="bg-white hover:bg-gray-100">
                                <Table.Cell>{transfer.date}</Table.Cell>
                                <Table.Cell>{transfer.paymentMethod}</Table.Cell>
                                <Table.Cell>{transfer.receiverDetails}</Table.Cell>
                                <Table.Cell>₹{transfer.amount}</Table.Cell>
                                <Table.Cell>{transfer.reason}</Table.Cell>
                                <Table.Cell>
                                    <span
                                        className={`font-semibold ${transfer.status === 'Success'
                                            ? 'text-green-600'
                                            : transfer.status === 'Pending'
                                                ? 'text-yellow-500'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {transfer.status}
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