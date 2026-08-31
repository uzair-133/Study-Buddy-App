import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Components/common/Navbar'
import api from '../api/axios'
const VerifyEmail = () => {
    const { token } = useParams()
    const [status, setStatus] = useState('verifying')
    const hasRun = useRef(false)  
    useEffect(() => {
        if (hasRun.current) return   //  agar pehle chal chuka hai, to ruk jao
        hasRun.current = true
        const verify = async () => {
            try {
                await api.get(`/api/auth/verify-email/${token}`)
                setStatus('success')
            } catch (err) {
                console.error(err)
                setStatus('failed')
            }
        }
        verify()
    }, [token])
    return (
        <>
            <div className='bg-paper min-h-screen m-2 pt-6   md:pt-8 md:m-2'>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    {status === "verifying" && <p>Email is verifying....</p>}
                    {status === "success" && <p>Email verified! You can now log in.</p>}
                    {status === "failed" && <p>Email verification failed.</p>}
                </div>
            </div>

        </>
    )
}

export default VerifyEmail