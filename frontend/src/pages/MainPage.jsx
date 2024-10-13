import { useState } from "react";
import { Button, Card } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import SideBar from "../component/SideBar";
import DashBoard from "./DashBoard";

const MainPage = () => {
    const navigate = useNavigate(); // For navigation
    const [user, setUser] = useState({
        name: "User Name", // Replace with actual user data
        upiId: "example@upi" // Replace with actual UPI ID
    });

    const handleLogout = () => {
        // Add your logout logic here (e.g., clear user data, redirect to login page)
        console.log("Logging out...");
        navigate("/login"); // Redirect to login page
    };

    return (
        <div>
            <Nav />
            <DashBoard />


        </div>
    );
};

export default MainPage;
