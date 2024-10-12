// src/pages/Entry.jsx
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { Button } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';

const Entry = () => {
    const navigate = useNavigate();
    const [showAnimation, setShowAnimation] = useState(false); // State to control animations

    useEffect(() => {
        // Trigger animations after the component mounts
        setShowAnimation(true);
    }, []);

    const handleExistedUser = () => {
        navigate('/login'); // Navigate to the login page
    };

    const handleNewUser = () => {
        navigate('/register'); // Navigate to the registration page
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950">
            {/* Logo with animation from top */}
            <Link
                to='/'
                className={`self-center whitespace-nowrap text-lg sm:text-4xl font-semibold text-blue-500 my-10 ${showAnimation ? 'animate-slide-down' : ''}`}
            >
                <span className='px-2 py-1 border-2 border-blue-500 rounded-lg text-white mx-1 text-lg sm:text-4xl font-bold'>
                    Online
                </span>
                Banking
            </Link>

            {/* Buttons with animation from bottom */}
            <div className={`flex gap-5 ${showAnimation ? 'animate-slide-up' : ''}`}>
                <Button gradientDuoTone="purpleToBlue" onClick={handleExistedUser}>
                    Existing User
                </Button>
                <Button outline gradientDuoTone="purpleToBlue" onClick={handleNewUser}>
                    New User
                </Button>
            </div>
        </div>
    );
};

export default Entry;
