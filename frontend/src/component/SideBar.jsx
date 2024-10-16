import React, { useState, useEffect } from 'react';
import { Sidebar } from "flowbite-react";
import { HiLogout } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router-dom";
import { RiSendPlaneFill, RiUserReceived2Fill } from "react-icons/ri";
import { MdNotificationsActive, MdAccountBalanceWallet } from "react-icons/md";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (tag) => {
        navigate(`/main?tag=${tag}`);
    };

    const [tag, setTag] = useState('');
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const getTag = params.get('tag');
        if (getTag) {
            setTag(getTag);
        }
    }, [location.search]);

    const handleLogout = () => {
        localStorage.removeItem('user_id'); // Clear user_id from localStorage
        navigate('/'); // Redirect to the homepage or login page
    };

    return (
        <Sidebar aria-label="Default sidebar example" className="min-h-screen">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={RiUserReceived2Fill} className='cursor-pointer' active={tag === 'borrow' || !tag} onClick={() => handleNavigation('borrow')}>
                        Borrow Money
                    </Sidebar.Item>
                    <Sidebar.Item icon={RiSendPlaneFill} className='cursor-pointer' active={tag === 'lend'} onClick={() => handleNavigation('lend')}>
                        Lend Money
                    </Sidebar.Item>
                    <Sidebar.Item icon={GrTransaction} className='cursor-pointer' onClick={() => handleNavigation('transactions')}>
                        View Transactions
                    </Sidebar.Item>
                    <Sidebar.Item icon={MdAccountBalanceWallet} className='cursor-pointer' onClick={() => handleNavigation('balance')}>
                        View Balance
                    </Sidebar.Item>
                    <Sidebar.Item icon={MdNotificationsActive} className='cursor-pointer' onClick={() => handleNavigation('notification')}>
                        Notifications
                    </Sidebar.Item>
                    <Sidebar.Item icon={HiLogout} onClick={handleLogout} className='cursor-pointer'>
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default SideBar;