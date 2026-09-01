import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/auth/me', { withCredentials: true });
            setUser(res.data?.user || null);
        } catch (err) {
            console.log('User fetch failed:', err.response?.data?.message || err.message);
            setUser(null);
            setError(err.response?.data?.message || 'Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
