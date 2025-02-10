import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../component/SideBar';
import TransferMoney from '../component/BorrowMoney';
import Repay from '../component/Repay';
import ViewTransactions from '../component/ViewTransactions';
import ViewBalance from '../component/ViewBalance';
import LendMoney from '../component/LendMoney';
import BorrowMoney from '../component/BorrowMoney';
import Notification from '../component/Notification';
import Main from '../component/Main';
// sdvds
const DashBoard = () => {
    const location = useLocation();
    const [tag, setTag] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const currentTag = params.get('tag');
        setTag(currentTag || "");
    }, [location.search]);

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-slate-100'>
            <div className='w-full md:w-56'>
                <SideBar />
            </div>
            {tag == 'transactions' && <ViewTransactions />}
            {tag == 'borrow' && <BorrowMoney />}
            {tag == "lend" && <LendMoney />}
            {tag == "repay" && <Repay />}
            {tag == "balance" && <ViewBalance />}
            {tag == "notification" && <Notification />}
            {tag == "home" && <Main />}

        </div>
    );
};

export default DashBoard;