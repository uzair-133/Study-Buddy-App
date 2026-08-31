import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { CornerDownRight } from 'lucide-react';
import { toast } from "react-toastify";

import api from '../../api/axios'
const LogOut = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const handleLogout = async () => {
        try {
            const res = await api.post("/api/auth/logout",
                {}, {
                withCredentials: true
            })
            setMessage(res.data.message)
            toast.success("logout successfully")
            navigate('/login');
        }
        catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Something went wrong")
        }

    }

    return (
        <>
            <NavLink className=' flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm font-semibold text-ink-soft hover:bg-paper' onClick={handleLogout} >    <CornerDownRight /> Logout</NavLink>

        </>
    )
}

export default LogOut