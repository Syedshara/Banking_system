import React from 'react';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser, HiCog, HiLogout } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const navigate = useNavigate();

    const handleNavigation = (tag) => {
        navigate(`/siderbar?tag=${tag}`);
    };

    return (
        <Sidebar aria-label="Default sidebar example" className="min-h-screen">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={HiArrowSmRight} onClick={() => handleNavigation('transfer')}>
                        Transfer Money
                    </Sidebar.Item>
                    <Sidebar.Item icon={GrTransaction} onClick={() => handleNavigation('transactions')}>
                        View Transactions
                    </Sidebar.Item>
                    <Sidebar.Item icon={HiCog} onClick={() => handleNavigation('settings')}>
                        Account Settings
                    </Sidebar.Item>
                    <Sidebar.Item icon={HiChartPie} onClick={() => handleNavigation('scheduled')}>
                        Scheduled Transaction
                    </Sidebar.Item>
                    <Sidebar.Item icon={HiLogout} onClick={() => handleNavigation('logout')}>
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default SideBar;