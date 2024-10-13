
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SideBar from '../component/SideBar'

const DashBoard = () => {

    return (
        <div className='min-h-screen flex flex-col md:flex-row bg-slate-100'>
            <div className='w-full md:w-56'>
                <SideBar />
            </div>

        </div>
    )
}

export default DashBoard