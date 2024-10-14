import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../component/SideBar';
import TransferMoney from './TransferMoney';

const DashBoard = () => {
    const location = useLocation();
    const [tag, setTag] = useState("");

    useEffect(() => {
        // Get the query parameters
        const params = new URLSearchParams(location.search);
        const currentTag = params.get('tag');
        setTag(currentTag || ""); // Set tag if available, else default to empty string
    }, [location.search]);

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-slate-100'>
            <div className='w-full md:w-56'>
                <SideBar />
            </div>
            {tag == 'transfer' && <TransferMoney />}

        </div>
    );
};

export default DashBoard;