import React, { useEffect, useState } from 'react'; 
import { Button } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';

const Entry = () => {
    const navigate = useNavigate();
    const [showAnimation, setShowAnimation] = useState(false); 

    useEffect(() => {
        setShowAnimation(true);
    }, []);

    const handleExistedUser = () => {
        navigate('/login');
    };

    const handleNewUser = () => {
        navigate('/register'); 
    };

    return (
        <div className="flex flex-col justify-center items-start ml-16 min-h-screen ">
            <div
                className="absolute inset-0 bg-cover bg-center -z-50"
                style={{
                    backgroundImage: "url('https://www.invest19.com/blog/wp-content/uploads/2020/04/should-bet-on-banking-sector-1.jpg')",
                    opacity: 0.8,
                }}
            />
            <div
                className="absolute inset-0 -z-40 bg-slate-950 opacity-70"
            />
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
                <p className="text-start text-white text-md sm:text-lg mb-5 ">
                         Welcome to the P2P Lending Platform! This application allows users to seamlessly connect for peer-to-peer lending. Whether you're looking to borrow or lend money, our platform provides a secure and efficient way to manage your financial transactions. Join us today and experience the future of lending with transparent and user-friendly services. 
                </p>
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
