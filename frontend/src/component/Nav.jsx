import { Avatar, Dropdown, Navbar } from "flowbite-react";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import img from '../assets/profile/user.png';
import { MdNotificationsActive } from "react-icons/md";

const Nav = () => {
    const [userData, setUserData] = useState({ name: "", upi_id: "" });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            fetch(`http://10.16.58.118:3000/users/${userId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setUserData({ name: data.name, upi_id: data.bank_details.upi_id });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        navigate('/');
    };

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
                    <span>Loading...</span>
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
                        <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
                    </Dropdown>
                )}

                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link href="/main?tag=home" active>
                    Home
                </Navbar.Link>
                <Navbar.Link href="#">About</Navbar.Link>
                <Navbar.Link href="/main?tag=notification">Notifications</Navbar.Link>

            </Navbar.Collapse>
        </Navbar>
    );
};

export default Nav;