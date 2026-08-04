import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const VerifyEmail = () => {
    const { token } = useParams()
    const [status, setStatus] = useState('verifying')

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get(`http://localhost:3000/api/auth/verify-email/${token}`)
                setStatus('success')
            } catch (err) {
                setStatus('failed')
            }
        }
        verify()
    }, [token])
    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                {status === "verifying" && <p>Email is verifying....</p>}
                {status === "success" && <p>Email verified! You can now log in.</p>}
                {status === "failed" && <p>Email verified! You can now log in.</p>}
            </div>

        </>
    )
}

export default VerifyEmail