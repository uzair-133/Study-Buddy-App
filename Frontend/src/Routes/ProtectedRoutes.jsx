import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../../../Frontend/src/Context/UserContext'
import { useContext } from 'react'
const ProtectedRoutes = ({children, allowedRole}) => {
    const { user, loading } = useContext(UserContext)
    if (loading) return <p>Loading...</p>
    if (!user) {
        return <Navigate to='/login' />
    }
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" />  
    }
    return children   
}

export default ProtectedRoutes