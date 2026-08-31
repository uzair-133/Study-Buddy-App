import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Navbar from './common/Navbar'
const CheckYourEmail = () => {
    const location = useLocation()
    const email = location.state?.email
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md text-center bg-paper-raised border border-line rounded-2xl p-8">
                    <Mail className="mx-auto text-violet mb-4" size={40} />
                    <h1 className="font-display text-2xl font-semibold text-ink mb-2">
                        Check your inbox
                    </h1>
                    <p className="font-sans text-ink-soft text-sm mb-6">
                        We've sent a verification link to <strong>{email}</strong>.
                        Click the link in the email to activate your account.
                    </p>
                    <Link to="/login" className="text-violet font-semibold text-sm hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </>
    )
}

export default CheckYourEmail