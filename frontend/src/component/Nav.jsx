
import { Avatar, Dropdown, Navbar } from "flowbite-react";

import React from 'react'
import { Link } from "react-router-dom";
import img from '../assets/profile/user.png'
const Nav = () => {
    return (
        <Navbar fluid rounded>
            <Link
                to='/'
                className={` whitespace-nowrap text-lg sm:text-xl font-semibold text-blue-500 my-2 `}
            >
                <span className='px-2 py-1 border-2 border-blue-500 rounded-lg text-black mx-1 text-lg sm:text-xl font-bold'>
                    Online
                </span>
                Banking
            </Link>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img={img} rounded />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                    </Dropdown.Header>

                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
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
    )
}

export default Nav