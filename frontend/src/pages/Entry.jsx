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
        <div className="flex flex-col justify-center items-start ml-16 min-h-screen ">
            <div
                className="absolute inset-0 bg-cover bg-center -z-50"
                style={{
                    backgroundImage: "url('https://www.invest19.com/blog/wp-content/uploads/2020/04/should-bet-on-banking-sector-1.jpg')", // Replace with your image URL
                    opacity: 0.8,
                }}
            />
            <div
                className="absolute inset-0 -z-40 bg-slate-950 opacity-70" // Adjust opacity for shade effect
            />
            {/* Logo with animation from top */}
            <div className='w-full max-w-2xl flex flex-col gap-5 justify-center items-start'>
                <Link
                    to='/'
                    className={` whitespace-nowrap text-lg sm:text-4xl font-semibold text-blue-500 my-10 ${showAnimation ? 'animate-slide-down' : ''}`}
                >
                    <span className='px-2 py-1 border-2 border-blue-500 rounded-lg text-white mx-1 text-lg sm:text-4xl font-bold'>
                        P2P
                    </span>
                    Lending
                </Link>

                {/* Project description */}
                <p className="text-start text-white text-md sm:text-lg mb-5 ">
                    Welcome to the Banking Registration Portal! This platform allows new users to seamlessly register for banking services. Choose between creating an account or adding a card, and provide your personal details, banking information, and secure UPI ID with a PIN. Our goal is to offer a smooth and secure registration experience, ensuring your information is safely processed. Join us and take the first step towards hassle-free banking!
                </p>

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

        </div>
    );
};

export default Entry;
