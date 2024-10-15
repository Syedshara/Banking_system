import React, { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Example API call to fetch notifications
        const fetchNotifications = async () => {
            try {
                // Replace with real API endpoint
                // const response = await fetch('http://api_endpoint/notifications');
                // const data = await response.json();

                // For testing, using static data
                const data = [
                    { id: 1, title: 'Payment Reminder', message: 'Your payment is due on 2024-10-20.', date: '2024-10-15' },
                    { id: 2, title: 'Overdue Alert', message: 'Your payment is overdue by 5 days.', date: '2024-10-12' },
                    { id: 3, title: 'New Offer', message: 'Get 20% off on your next transaction!', date: '2024-10-10' },
                ];

                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-4xl">
            <h2 className="text-2xl font-bold mb-5 text-center">Notifications</h2>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <Card key={notification.id} className="w-full p-2 shadow-lg bg-white rounded-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{notification.title}</h3>
                            <span className="text-xs text-gray-500">{notification.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{notification.message}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notification;
