import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'

const ProtectedRoutes = ({ children, allowedRole }) => {
    const { user, loading } = useContext(UserContext)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet"></div>
            </div>
        )
    }

    if (!user || !user.role) {
        return <Navigate to='/login' replace />
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" replace />  
    }

    return children   
}

export default ProtectedRoutes