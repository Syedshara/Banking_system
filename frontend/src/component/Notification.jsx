import React, { useState, useEffect } from 'react';
import { Card, Dropdown } from 'flowbite-react';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [filter, setFilter] = useState('All'); 

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const response = await fetch(`http://10.16.58.118:3000/users/notification/${userId}`);
                const data = await response.json();

                console.log({ data });
                setNotifications(data);
                setFilteredNotifications(data); 
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);
    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);

        if (selectedFilter === 'All') {
            setFilteredNotifications(notifications);
        } else {
            const filtered = notifications.filter(notification => {
                if (selectedFilter === 'Payment Reminders') {
                    return notification.type === 'Payment Reminder!';
                }
                if (selectedFilter === 'Amount to be Received') {
                    return notification.type === 'Amount to be received';
                }
                return false;
            });
            setFilteredNotifications(filtered);
        }
    };

    return (
        <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-4xl">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Notifications</h2>

                <Dropdown
                    label="Filters"
                    inline={true}
                    className="shadow p-2 rounded"
                >
                    <Dropdown.Item onClick={() => handleFilterChange('All')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('Payment Reminders')}>Payment Reminders</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('Amount to be Received')}>Amount to be Received</Dropdown.Item>
                </Dropdown>
            </div>

            <div className="space-y-4 max-h-[650px] px-10 scrollbar-hide overflow-y-auto">
                {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className="w-full p-2 shadow-lg bg-white rounded-lg">
                        <div className="flex justify-between items-center">
                            <h3 className={`font-semibold ${notification.type === 'Payment Reminder!'
                                ? 'text-red-600'
                                : 'text-green-600'}`}>
                                {notification.type}
                            </h3>
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
