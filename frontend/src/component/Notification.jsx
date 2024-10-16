import React, { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const response = await fetch(`http://10.16.58.118:3000/users/notification/${userId}`);
                const data = await response.json();

                console.log({ data });

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
                            <h3 className="text-lg font-semibold">{notification.type}</h3>
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
