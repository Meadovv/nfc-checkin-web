import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import api from '../utils/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(JSON.parse(storedToken));
    }, []);

    useEffect(() => {
        if (token) verify();
    }, [token]);

    const login = async ({ username, password }) => {
        const data = await axios.execute('post', api.GLOBAL.login, { username, password });
        const token = {
            'x-api-key': data.token,
            'x-user-id': data._id,
        }
        setToken(token);
        localStorage.setItem('token', JSON.stringify(token));
    };

    const verify = async () => {
        const data = await axios.execute('get', api.GLOBAL.verify, null, { enableMessage: false });
        if(data) {
            setUser(data);
            setIsAuthenticated(true);
        } else {
            logout();
        }
    } 

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
