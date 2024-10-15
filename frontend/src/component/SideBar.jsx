import React from 'react';
import { useState, useEffect } from 'react';
import { Sidebar } from "flowbite-react";
import { HiLogout } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import { RiSendPlaneFill, RiUserReceived2Fill } from "react-icons/ri";
import { MdNotificationsActive, MdAccountBalanceWallet } from "react-icons/md"



const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const handleNavigation = (tag) => {
        navigate(`/main?tag=${tag}`);
    };
    const [tag, setTag] = useState('')
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const getTag = params.get('tag')
        if (getTag) {
            setTag(getTag)
        }
    }, [location.search])
    const handleLogout = () => {
        navigate('/');
    }

    return (
        <Sidebar aria-label="Default sidebar example" className="min-h-screen">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={RiUserReceived2Fill} active={tag === 'borrow' || !tag} onClick={() => handleNavigation('borrow')}>
                        Borrow Money
                    </Sidebar.Item>
                    <Sidebar.Item icon={RiSendPlaneFill} active={tag === 'lend' || !tag} onClick={() => handleNavigation('lend')}>
                        Lend Money
                    </Sidebar.Item>

                    <Sidebar.Item icon={GrTransaction} onClick={() => handleNavigation('transactions')}>
                        View Transactions
                    </Sidebar.Item>
                    <Sidebar.Item icon={MdAccountBalanceWallet} onClick={() => handleNavigation('balance')}>
                        View Balance
                    </Sidebar.Item>
                    <Sidebar.Item icon={MdNotificationsActive} onClick={() => handleNavigation('notification')}>
                        Notifications
                    </Sidebar.Item>
                    <Sidebar.Item icon={HiLogout} onClick={handleLogout}>
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default SideBar;