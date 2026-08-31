import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const UserContext = createContext();

const emptyUser = { name: "", role: "" };

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(emptyUser);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await api.get('/api/auth/me', { withCredentials: true });
            setUser(res.data?.user || emptyUser);
            
        } catch (err) {
            console.log('User fetch failed:', err.response?.data?.message || err.message);
            setUser(emptyUser);
            setError(err.response?.data?.message || 'Failed to fetch user data');
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;



