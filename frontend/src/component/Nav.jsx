import { Avatar, Dropdown, Navbar } from "flowbite-react";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import img from '../assets/profile/user.png';

const Nav = () => {
    const [userData, setUserData] = useState({ name: "", upi_id: "" }); // State to store user data
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch user details from the backend using the stored user_id
    useEffect(() => {
        const userId = localStorage.getItem("userId"); // Get user_id from localStorage
        if (userId) {
            fetch(`http://10.16.58.118:3000/users/${userId}`) // Replace with your actual API endpoint
                .then(response => response.json())
                .then(data => {
                    setUserData({ name: data.name, upi_id: data.upi_id });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
        }
    }, []);

    return (
        <Navbar fluid rounded>
            <Link
                to='/'
                className={`whitespace-nowrap text-lg sm:text-xl font-semibold text-blue-500 my-2`}
            >
                <span className='px-2 py-1 border-2 border-blue-500 rounded-lg text-black mx-1 text-lg sm:text-xl font-bold'>
                    P2P
                </span>
                Lending
            </Link>

            <div className="flex md:order-2">
                {loading ? (
                    <span>Loading...</span> // Display a loading state
                ) : (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt="User settings" img={img} rounded />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{userData.name || "Unknown User"}</span>
                            <span className="block truncate text-sm font-medium">{userData.upi_id || "Unknown UPI ID"}</span>
                        </Dropdown.Header>

                        <Dropdown.Divider />
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </Dropdown>
                )}

                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link href="#" active>
                    Home
                </Navbar.Link>
                <Navbar.Link href="#">About</Navbar.Link>
                <Navbar.Link href="#">History</Navbar.Link>
                <Navbar.Link href="#">Report</Navbar.Link>
                <Navbar.Link href="#">Contact</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Nav;