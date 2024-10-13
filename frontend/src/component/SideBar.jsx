import React from 'react';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser, HiCog, HiLogout } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";

const SideBar = () => {
    return (
        <Sidebar aria-label="Default sidebar example" className="min-h-screen">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="/transfer" icon={HiArrowSmRight}>
                        Transfer Money
                    </Sidebar.Item>
                    <Sidebar.Item href="/transactions" icon={GrTransaction}>
                        View Transactions
                    </Sidebar.Item>
                    <Sidebar.Item href="/settings" icon={HiCog}>
                        Account Settings
                    </Sidebar.Item>
                    <Sidebar.Item href="/profile" icon={HiChartPie}>
                        Scheduled Transaction
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiLogout}>
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default SideBar;
